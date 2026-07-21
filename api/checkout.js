import Stripe from 'stripe';
import { IS_SHOP_OPEN } from '../src/utils/shopConfig.js';
import { reserveStock, restoreStock, createReservation } from './db.js';

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

            const PRODUCTS_CATALOG = {
                "Camiseta": 0,
                "Camiseta Infant": 0,
                "Camiseta Màniga Llarga": 0
            };

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

                if (item.size) {
                    productData.description = `Talla: ${item.size}`;
                    productData.metadata.talla = item.size;
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

        // Reserva l'estoc ABANS de crear la sessió (agregat per producte, totes les
        // talles sumades). Si no n'hi ha prou, llança error i no es crea res.
        // El webhook 'checkout.session.expired' retorna la reserva si el comprador
        // abandona el pagament (la sessió caduca als 30 minuts).
        const totalPerProduct = {};
        orderItems.forEach(item => {
            totalPerProduct[item.name] = (totalPerProduct[item.name] || 0) + item.quantity;
        });
        reserveStock(totalPerProduct);

        let session;
        try {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                phone_number_collection: {
                    enabled: true,
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
                },
                success_url: `${origin}/success`,
                cancel_url: `${origin}/cancel`,
                customer_email: customerEmail, // Pre-fill email if user provided it
                locale: 'es',
                shipping_address_collection: {
                    allowed_countries: ['ES', 'FR', 'PT', 'AD', 'IT', 'DE', 'AT', 'BE', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'GR', 'HR', 'HU', 'IE', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'RO', 'SE', 'SI', 'SK'],
                },
            });
        } catch (err) {
            // Stripe ha fallat: desfés la reserva perquè l'estoc no quedi bloquejat.
            restoreStock(totalPerProduct);
            throw err;
        }

        // Vincula la reserva a la sessió perquè el webhook la pugui completar o alliberar.
        createReservation(session.id, orderItems);

        // 4. Return URL
        res.status(200).json({ url: session.url });

    } catch (err) {
        console.error('Error a Stripe:', err);
        res.status(500).json({ error: err.message });
    }
}
