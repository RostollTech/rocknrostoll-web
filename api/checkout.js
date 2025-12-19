import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 1. Get origin for redirection
        const origin = req.headers.origin || req.headers.referer || 'http://localhost:5173';

        // 2. Parse body (if sent by frontend)
        const { items, customerEmail, donation } = req.body || {};

        let line_items = [];

        // If dynamic items are provided, build stripe line items
        if (items && Array.isArray(items) && items.length > 0) {

            const PRODUCTS_CATALOG = {
                "Pack 30 edició - versió limitada": 40,
                "Dessuadores 30 edició - versió limitada": 28,
                "Gorra 30 edició - versió limitada": 10,
                "Bossa de tela 30 edició - versió limitada": 8
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

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            phone_number_collection: {
                enabled: true,
            },
            line_items: line_items,
            mode: 'payment',
            payment_intent_data: Object.keys(paymentIntentData.metadata).length > 0 || paymentIntentData.description ? paymentIntentData : undefined,
            success_url: `${origin}/success`,
            cancel_url: `${origin}/cancel`,
            customer_email: customerEmail, // Pre-fill email if user provided it
            locale: 'es',
            shipping_address_collection: {
                allowed_countries: ['ES', 'FR', 'PT', 'AD', 'IT', 'DE', 'AT', 'BE', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'GR', 'HR', 'HU', 'IE', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'RO', 'SE', 'SI', 'SK'],
            },
        });

        // 4. Return URL
        res.status(200).json({ url: session.url });

    } catch (err) {
        console.error('Error a Stripe:', err);
        res.status(500).json({ error: err.message });
    }
}
