import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import Stripe from 'stripe';
import { IS_SHOP_OPEN } from '../src/utils/shopConfig.js';
import { reserveStock, restoreStock, createReservation, reserveNewPickupCode } from './db.js';

// Catàleg de productes: font única de veritat (products.json), la mateixa que
// fa servir server.js per a les vendes físiques i l'admin. Així els preus del
// checkout no es poden desincronitzar d'un canvi fet només en un altre lloc.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/products.json'), 'utf-8'));
const CATALOG_BY_NAME = new Map(CATALOG.map(p => [p.name, p]));

// Productes com "Pack Lo de Sempre" no tenen estoc propi: són la unió d'altres
// productes reals (bundleOf). La talla que arriba del carret és les talles de
// cada peça unides amb "+" (mateix ordre que bundleOf a products.json), p.ex.
// "M+L". Aquesta funció "desplega" una línia de comanda en les línies d'estoc
// reals que cal reservar/descomptar.
function expandToStockLines(item) {
    const product = CATALOG_BY_NAME.get(item.name);
    if (!product?.bundleOf) {
        return [{ name: item.name, size: item.size, quantity: item.quantity }];
    }
    const sizes = String(item.size || '').split('+');
    return product.bundleOf.map((component, i) => ({
        name: component.product,
        size: sizes[i] || '',
        quantity: item.quantity,
    }));
}

// Text llegible per a Stripe/rebuts quan la talla és composta (pack).
function describeSize(item) {
    const product = CATALOG_BY_NAME.get(item.name);
    if (!product?.bundleOf || !item.size) return item.size;
    const sizes = String(item.size).split('+');
    return product.bundleOf.map((component, i) => `${component.label} ${sizes[i] || '?'}`).join(' / ');
}

export default async function handler(req, res) {
    if (!IS_SHOP_OPEN) {
        return res.status(403).json({ error: 'La venda online està tancada.' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 1. Get origin for redirection
        const origin = req.headers.origin || req.headers.referer || 'http://localhost:5173';

        // 2. Parse body (if sent by frontend)
        const { items, customerEmail, customerName, donation } = req.body || {};

        let line_items = [];

        // If dynamic items are provided, build stripe line items
        if (items && Array.isArray(items) && items.length > 0) {

            // Preus derivats de products.json (mai del client): evita que el
            // catàleg de preus del checkout es desincronitzi del real.
            const PRODUCTS_CATALOG = Object.fromEntries(
                CATALOG
                    .filter(p => p.name !== 'Donatiu')
                    .map(p => [p.name, parseFloat(String(p.price).replace(',', '.'))])
                    .filter(([, price]) => Number.isFinite(price))
            );

            line_items = items.map(item => {
                // Security Check: Quantity must be a positive integer
                if (!Number.isInteger(item.quantity) || item.quantity < 1) {
                    throw new Error(`Quantitat no vàlida per al producte: ${item.name}`);
                }

                // Security Check: Prevent prototype pollution or invalid names
                if (!Object.prototype.hasOwnProperty.call(PRODUCTS_CATALOG, item.name)) {
                    throw new Error(`Producte no vàlid o no existent: ${item.name}`);
                }

                const catalogPrice = PRODUCTS_CATALOG[item.name];

                // Extra safety: ensure it's a number
                if (typeof catalogPrice !== 'number') {
                    throw new Error(`Error intern de preu per: ${item.name}`);
                }

                // Prepare product data structure
                const productData = {
                    name: item.name,
                    metadata: {}
                };

                const sizeLabel = describeSize(item);
                if (sizeLabel) {
                    productData.description = `Talla: ${sizeLabel}`;
                    productData.metadata.talla = sizeLabel;
                }

                return {
                    price_data: {
                        currency: 'eur',
                        product_data: productData,
                        unit_amount: Math.round(catalogPrice * 100),
                    },
                    quantity: item.quantity,
                };
            });
        }

        // Add donation if present (Minimum 1€) - Validated safe parsing
        if (donation) {
            const donationValue = parseFloat(donation);
            if (!isNaN(donationValue) && donationValue >= 1) {
                line_items.push({
                    price_data: {
                        currency: 'eur',
                        product_data: { name: 'Donatiu' },
                        unit_amount: Math.round(donationValue * 100)
                    },
                    quantity: 1
                });
            }
        }

        if (line_items.length === 0) {
            return res.status(400).json({ error: 'No items or donation in cart' });
        }

        // 3. Create Session

        // Prepare PaymentIntent data for clear reporting
        const paymentIntentData = {
            metadata: {}
        };
        const summaryParts = [];

        if (items && Array.isArray(items)) {
            items.forEach(item => {
                const sizeSuffix = item.size ? ` (${item.size})` : '';
                // Clean Name for description
                const cleanName = item.name.replace(' 30 edició - versió limitada', '');

                summaryParts.push(`${item.quantity} x ${cleanName}${sizeSuffix}`);

                // METADATA STRATEGY FOR COLUMNS:
                // We create keys like "Pack_M", "Dess_L", "Gorra" so Stripe Export creates columns for them.
                let metaKey = cleanName.split(' ')[0]; // "Pack", "Dessuadores", "Gorra", "Bossa"
                // Normalize key (remove accents, lowercase maybe? Keep simple: "Dessuadores_M")
                if (item.size) {
                    metaKey += `_${item.size}`;
                }

                // Add to metadata (sum if multiple lines of same type, though unlikely in this cart logic)
                const currentQty = parseInt(paymentIntentData.metadata[metaKey] || '0');
                paymentIntentData.metadata[metaKey] = currentQty + item.quantity;
            });
        }

        if (donation) {
            const donationVal = parseFloat(donation);
            if (!isNaN(donationVal) && donationVal >= 1) {
                summaryParts.push(`Donatiu (${donationVal}€)`);
                paymentIntentData.metadata['Donatiu'] = donationVal;
            }
        }

        if (summaryParts.length > 0) {
            paymentIntentData.description = summaryParts.join(', ').substring(0, 1000);
        }

        // Add a general "talla" summary for quick glance if needed, but the columns above are better for stats
        const allSizes = items
            .filter(i => i.size)
            .map(i => `${i.size} (${i.name.split(' ')[0]})`)
            .join(', ');

        if (allSizes) {
            paymentIntentData.metadata['resum_talles'] = allSizes.substring(0, 500);
        }

        // Compact summary so the webhook can record the order without extra API calls.
        // Stripe caps each metadata value at 500 chars, so the JSON is split into
        // numbered chunks (items_0, items_1, ...) that the webhook reassembles.
        const orderItems = (items || []).map(item => ({
            name: item.name,
            size: item.size || null,
            quantity: item.quantity,
        }));
        const itemsJson = JSON.stringify(orderItems);
        const itemsChunks = {};
        for (let i = 0; i * 500 < itemsJson.length; i++) {
            itemsChunks[`items_${i}`] = itemsJson.substring(i * 500, (i + 1) * 500);
        }

        // Reserva l'estoc ABANS de crear la sessió (agregat per producte+talla,
        // per si el carret repetís la mateixa línia). Si no n'hi ha prou, llança
        // error i no es crea res. El webhook 'checkout.session.expired' retorna
        // la reserva si el comprador abandona el pagament (caduca als 30 minuts).
        // Els productes "pack" (bundleOf) no tenen estoc propi: es desploguen
        // aquí en les línies reals (les peces que realment els formen) abans
        // de tocar l'estoc.
        const stockLines = orderItems.flatMap(expandToStockLines);
        const totalsByLine = new Map();
        stockLines.forEach(item => {
            const key = `${item.name}::${item.size || ''}`;
            const existing = totalsByLine.get(key);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                totalsByLine.set(key, { name: item.name, size: item.size, quantity: item.quantity });
            }
        });
        const reservationItems = Array.from(totalsByLine.values());
        reserveStock(reservationItems);

        // Reserva el codi de recollida ABANS de crear la sessió perquè es pugui
        // mostrar (només com a text fix, no editable) a la pròpia pantalla de
        // Stripe via custom_text. El webhook reutilitza aquest mateix codi.
        const pickupCode = reserveNewPickupCode();

        let session;
        try {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                phone_number_collection: {
                    enabled: true,
                },
                custom_fields: [
                    {
                        key: 'nom_complet',
                        label: { type: 'custom', custom: 'Nom i cognoms' },
                        type: 'text',
                        optional: false,
                        // Prefill amb el nom que ja ha escrit al formulari de la web,
                        // així no l'ha de tornar a escriure a Stripe (Stripe no permet
                        // amagar el camp del tot, però sí deixar-lo ja emplenat).
                        text: customerName ? { default_value: String(customerName).substring(0, 140) } : undefined,
                    },
                ],
                custom_text: {
                    // Text fix, no editable: apareix a la pantalla de pagament abans
                    // de confirmar, i es torna a mostrar a la pantalla de confirmació
                    // de Stripe just abans de redirigir a /success. Stripe no permet
                    // controlar la mida de font (renderitza el text amb el seu propi
                    // estil fix); només accepta un subconjunt de Markdown (negreta i
                    // enllaços), així que remarquem el codi en negreta.
                    submit: { message: `El teu codi de recollida serà: **${pickupCode}**` },
                    after_submit: { message: `El teu codi de recollida és **${pickupCode}**. Guarda'l, l'hauràs de presentar per recollir la comanda.` },
                },
                line_items: line_items,
                mode: 'payment',
                // La sessió caduca als 30 min (mínim de Stripe): si el comprador
                // abandona, l'estoc reservat es retorna via webhook 'expired'.
                expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
                payment_intent_data: Object.keys(paymentIntentData.metadata).length > 0 || paymentIntentData.description ? paymentIntentData : undefined,
                metadata: {
                    ...itemsChunks,
                    donation: String(donation || ''),
                    customer_name: String(customerName || '').substring(0, 500),
                    pickup_code: pickupCode,
                },
                success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/cancel`,
                customer_email: customerEmail, // Pre-fill email if user provided it
                locale: 'es',
            });
        } catch (err) {
            // Stripe ha fallat: desfés la reserva perquè l'estoc no quedi bloquejat.
            restoreStock(reservationItems);
            throw err;
        }

        // Vincula la reserva a la sessió perquè el webhook la pugui completar o
        // alliberar — amb les línies reals (reservationItems), no les de pack,
        // perquè la restauració en cas d'expiració toqui l'estoc correcte.
        createReservation(session.id, reservationItems);

        // 4. Return URL
        res.status(200).json({ url: session.url });

    } catch (err) {
        console.error('Error a Stripe:', err);
        res.status(500).json({ error: err.message });
    }
}
