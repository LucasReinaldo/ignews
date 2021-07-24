import { query as q } from "faunadb";
import { getUserByStripeCustomerId } from "pages/api/_faunadb/getUserByStripeCustomerId";

import { fauna } from "services/fauna";
import { stripe } from "services/stripe";

export async function saveSubscription(subscriptionId: string, customerId: string): Promise<void> {  
  const userRef = await getUserByStripeCustomerId(customerId);

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    createdAt: subscription.items.data[0].created,
    deleted: subscription.items.data[0].deleted,
  };

  await fauna.query(
    q.Create(
      q.Collection('subscriptions'),
      { data: subscriptionData }
    )
  )
}