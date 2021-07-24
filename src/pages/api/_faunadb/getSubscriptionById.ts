import { query as q } from "faunadb";

import { fauna } from "services/fauna";
import { Subscription } from "./interfaces/Subscription";

export async function getSubscriptionById(id: string): Promise<Subscription> {
  return fauna.query(
    q.Get(
      q.Match(
        q.Index('subscription_by_id'),
        id,
      )
    )
  )
}