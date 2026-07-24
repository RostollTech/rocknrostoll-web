import Stripe from 'stripe';
import { decrementStock, recordOrder, completeReservation, releaseReservation } from './db.js';
import { expandToStockLines } from './catalog.js';

export default async function handler(req, res) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Signatura de webhook no vàlida:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Reassembla els trossos items_0, items_1, ... (límit de 500 chars per valor de metadata)
        let itemsJson = '';
        for (let i = 0; session.metadata?.[`items_${i}`] !== undefined; i++) {
            itemsJson += session.metadata[`items_${i}`];
        }

        let items = [];
        try {
            items = JSON.parse(itemsJson || '[]');
        } catch (err) {
            console.error('Metadata d\'items il·legible per a la sessió', session.id, err.message);
            items = [];
        }

        const donationCents = Math.round((parseFloat(session.metadata?.donation) || 0) * 100);

        // El nom el demana Stripe mateix (custom_fields), més fiable que el del
        // nostre formulari perquè és obligatori a la pantalla de pagament.
        const nomField = session.custom_fields?.find(f => f.key === 'nom_complet');
        const customerName = nomField?.text?.value || session.metadata?.customer_name || '';

        // Idempotent: Stripe reintenta webhooks; només la primera entrega actua.
        const isNew = recordOrder({
            stripeSessionId: session.id,
            channel: 'online',
            customerName,
            customerEmail: session.customer_details?.email || session.customer_email || '',
            items,
            donationCents,
            totalCents: session.amount_total || 0,
            // Ja reservat en crear la sessió, perquè es pogués mostrar a Stripe
            // (custom_text) abans que existís aquesta comanda.
            pickupCode: session.metadata?.pickup_code || null,
        });

        if (isNew) {
            // L'estoc ja es va reservar en crear la sessió: només cal marcar la
            // reserva com a completada. El descompte directe queda com a xarxa de
            // seguretat per a sessions creades abans del sistema de reserves.
            const hadReservation = completeReservation(session.id);
            if (!hadReservation) {
                items.flatMap(expandToStockLines).forEach(line => decrementStock(line.name, line.size, line.quantity));
            }
        }
    }

    if (event.type === 'checkout.session.expired') {
        // El comprador ha abandonat el pagament: retorna l'estoc reservat.
        // Idempotent: només la primera entrega restaura.
        releaseReservation(event.data.object.id);
    }

    res.json({ received: true });
}
