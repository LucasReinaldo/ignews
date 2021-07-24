import { Stripe } from "stripe";
import MyPackage from "../../package.json";

export const stripe = new Stripe(
  process.env.STRIPE_SK,
  {
    apiVersion: '2020-08-27',
    appInfo: {
      name: 'IGNews',
      version: MyPackage.version
    }
  }
);