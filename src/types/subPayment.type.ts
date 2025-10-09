export type TSubscriptionStatus = 'active' | 'expired' | 'canceled' | 'pending';

export type TSubscription = {
  _id?: string;
  user: string;
  plan: string;
  durationType: 'monthly' | 'yearly';
  isPaid: boolean;
  amount: number;
  code?: string;
  status: TSubscriptionStatus;
  startedAt: Date;
  expiredAt: Date;
  isExpired: boolean;
  isDeleted: boolean;
};
