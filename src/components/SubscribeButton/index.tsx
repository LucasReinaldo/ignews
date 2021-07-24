import { signIn, useSession } from "next-auth/client";
import { nextApi } from "services/nextApi";
import { getStripeJs } from "services/stripe-js";

import styles from "./styles.module.scss";

type SubscribeButtonProps = {
  priceId: string;
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const { data } = await nextApi.post("/stripe/subscribe", {
        priceId,
      });

      const stripeJs = await getStripeJs();

      await stripeJs.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {}
  }

  return (
    <button
      className={styles.subscribeButton}
      onClick={handleSubscribe}
      type="button"
    >
      Subscribe now
    </button>
  );
}
