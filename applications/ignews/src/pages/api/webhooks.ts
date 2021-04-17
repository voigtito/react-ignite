import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        );
    }
    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false
    }
}

// Set the relevant events.
// Do not listening to the create event because in checkout event the user is already created.
const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        // Get the stripe secret because every webhook is public.
        const secret = req.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            // Match the scret with the webhook secret.
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
        } catch (error) {
            console.log(error)
            return res.status(400).send(`Webhook error: ${error.message}`)
        }

        const { type } = event;

        if (relevantEvents.has(type)) {
            try {
                switch (type) {
                    case 'checkout.session.completed':
                        // Save and type the checkout as a checkout event.
                        const checkoutSession = event.data.object as Stripe.Checkout.Session;
                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true
                        )
                        break;
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        const subscription = event.data.object as Stripe.Subscription;
                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            false
                        )
                        break;
                    default:
                        throw new Error('Unhandled event.')
                }
            } catch (error) {
                return res.json({ error: 'Webhook handler failed.' })
            }
        }

        res.json({ reveived: true });
    } else {
        // If the request was not a post.
        res.setHeader('Allow', 'Post');
        res.status(405).end('Method not allowed');
    }
}