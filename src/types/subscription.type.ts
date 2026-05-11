import { TSubscriptionPlan } from './plan.type';
import { IUser } from './user.type';

export type TSubscriptionStatus = 'active' | 'expired' | 'canceled' | 'pending';

export type TSubscription = {
  _id?: string;
  user: string | IUser;
  plan: string | TSubscriptionPlan;
  durationType: 'monthly' | 'yearly';
  isPaid: boolean;
  amount: number;
  code?: string;
  status: TSubscriptionStatus;
  startedAt: Date | string;
  expiredAt: Date | string;
  isExpired: boolean;
  isDeleted: boolean;
};
