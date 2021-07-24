import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

import { getUserByEmail } from "pages/api/_faunadb/getUserByEmail";

import { fauna } from "services/fauna";
import { stripe } from "services/stripe";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { priceId } = request.body;

  if (request.method === 'POST') {
    const session = await getSession({ req: request });

    const user = await getUserByEmail(session.user.email);

    let stripeCustomerId = user.data.stripeCustomerId;

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      stripeCustomerId = stripeCustomer.id;

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          { data: { stripeCustomerId } }
        )
      )
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: priceId }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    })

    return response.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}