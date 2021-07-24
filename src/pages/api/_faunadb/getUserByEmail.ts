import { query as q } from "faunadb";

import { fauna } from "services/fauna";
import { User } from "./interfaces/User";

export async function getUserByEmail(email: string): Promise<User> {
  return fauna.query(
    q.Get(
      q.Match(
        q.Index('user_by_email'),
        q.Casefold(email)
      )
    )
  )
}