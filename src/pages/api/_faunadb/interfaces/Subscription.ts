export interface Subscription {
  ref: {
    id: string;
  },
  data: {
    id: string,
    userId: string,
    status: string,
    priceId: string,
    createdAt: string | number,
    deleted?: boolean,
  }
}