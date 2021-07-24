import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { stripe } from "services/stripe";

import stripeWebhookEvent from "./_utils/stripeWebhookEvent";
import { buffer } from "./_utils/buffer";

import { saveSubscription } from "./_lib/saveSubscription";
import { updateSubscription } from "./_lib/updateSubscription";

export const config = {
  api: {
    bodyParser: false,
  }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST') {
    const buf = await buffer(request);
    const sig = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SK);
    } catch (err) {
      return response.status(400).send(`Webhook error: ${err.message}`);
    }

    if (!stripeWebhookEvent.has(event.type)) {
      return response.json({ received: true, event: event.type });
    }

    try {
      switch (event.type) {
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;

          await updateSubscription(
            subscription.id,
            subscription.customer.toString(),
          );

          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          await saveSubscription(
            checkoutSession.subscription.toString(),
            checkoutSession.customer.toString(),
          );
          break;

        default:
          throw new Error('Unhandled event');
      }
    } catch (error) {
      return response.json({ error: 'Webhook handler failed' })
    }
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}