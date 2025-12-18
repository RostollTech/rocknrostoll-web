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
        if (items && items.length > 0) {
            // Map your frontend cart items to Stripe line items
            // Note: In a real app, you should validate prices on server-side to avoid tampering
            // For this demo, we trust the passed structure or look up price IDs

            // OPTION A: Using ad-hoc prices (easiest for demo)
            line_items = items.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.name + (item.size ? ` (Talla: ${item.size})` : ''),
                    },
                    unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to cents
                },
                quantity: item.quantity,
            }));
        } else {
            // FALLBACK (User Request): Producte de prova si no hi ha dades
            line_items = [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Producte de Prova (Codi d\'Exemple)',
                        },
                        unit_amount: 2000, // 20.00 €
                    },
                    quantity: 1,
                },
            ];
        }

        // Add donation if present
        if (donation && parseFloat(donation) > 0) {
            line_items.push({
                price_data: {
                    currency: 'eur',
                    product_data: { name: 'Donatiu' },
                    unit_amount: Math.round(parseFloat(donation) * 100)
                },
                quantity: 1
            });
        }

        // 3. Create Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `${origin}/success`,
            cancel_url: `${origin}/cancel`,
            customer_email: customerEmail, // Pre-fill email if user provided it
        });

        // 4. Return URL
        res.status(200).json({ url: session.url });

    } catch (err) {
        console.error('Error a Stripe:', err);
        res.status(500).json({ error: err.message });
    }
}
