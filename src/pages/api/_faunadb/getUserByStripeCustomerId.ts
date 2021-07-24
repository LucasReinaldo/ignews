import { query as q } from "faunadb";

import { fauna } from "services/fauna";
import { User } from "./interfaces/User";

export async function getUserByStripeCustomerId(customerId: string): Promise<User> {
  return fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )
}