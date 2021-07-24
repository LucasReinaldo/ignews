import Image from "next/image";
import girlCoding from "../../public/images/avatar.svg";

import styles from "styles/home.module.scss";
import { SubscribeButton } from "components/SubscribeButton";
import { GetStaticProps } from "next";
import { stripe } from "services/stripe";

type HomeProps = {
  product: {
    priceId: string;
    amount: number;
    amountFormatted: number;
  };
};

const PRICE_ID = "price_1IO4ViGjeBFjApgt88mQy64T";
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(PRICE_ID, {
    expand: ["product"],
  });

  const amountFormatted = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(price.unit_amount / 100);

  const product = {
    priceId: price.id,
    amount: price.unit_amount / 100,
    amountFormatted,
  };

  return {
    props: {
      product,
    },
    revalidate: ONE_DAY_IN_SECONDS,
  };
};

export default function Home({ product }: HomeProps) {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <p className={styles.welcome}>👋 Hey, welcome!</p>
        <h1 className={styles.mainHeader}>
          News about the <span className={styles.highlightText}>React</span>{" "}
          world.
        </h1>
        <p className={styles.mainContent}>
          Get access to all the publications
          <span className={styles.subscription}>
            for {product.amountFormatted} month.
          </span>
        </p>
        <div className={styles.subscribeButton}>
          <SubscribeButton priceId={PRICE_ID} />
        </div>
      </section>
      <Image
        src={girlCoding}
        width={500}
        height={500}
        alt="Girl on a chair coding"
      />
    </main>
  );
}
