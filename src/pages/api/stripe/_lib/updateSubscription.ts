import { query as q } from "faunadb";

import { fauna } from "services/fauna";
import { stripe } from "services/stripe";

import { getUserByStripeCustomerId } from "pages/api/_faunadb/getUserByStripeCustomerId";
import { getSubscriptionById } from "pages/api/_faunadb/getSubscriptionById";

export async function updateSubscription(subscriptionId: string, customerId: string): Promise<void> {
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

  const subscriptionRef = await getSubscriptionById(subscriptionId);

  await fauna.query(
    q.Replace(
      q.Select(
        "ref",
        subscriptionRef,
      ),
      { data: subscriptionData }
    )
  )
}