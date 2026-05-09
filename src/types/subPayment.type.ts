import { TSubscriptionPlan } from './plan.type';
import { TSubscription } from './subscription.type';
import { IUser, TVendorUser } from './user.type';

export type TSubPayment = {
  _id: string;
  user: string | IUser;
  vendor: string | TVendorUser;
  plan: string | TSubscriptionPlan;
  subscription?: string | TSubscription;
  durationType: 'monthly' | 'yearly';
  amount: number;
  tranId: string;
  isPaid: boolean;
  paidAt: Date;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
