import { TBooking } from './booking.type';
import { TOrder } from './order.type';
import { IUser, TVendorUser } from './user.type';

export type TStatus = 'pending' | 'paid' | 'refunded';

export type TDeliveryStatus = 'pending' | 'ongoing' | 'shipped' | 'delivered';

export enum PAYMENT_MODEL_TYPE {
  Order = 'Order',
  Booking = 'Booking',
}

export type TPayment = {
  _id: string;
  user: IUser;
  vendor: TVendorUser;

  modelType: string;
  reference: TOrder | TBooking;

  status: TStatus;

  deliveryStatus?: TDeliveryStatus;

  trnId: string;
  adminAmount: number;
  vendorAmount: number;
  paymentIntentId: string;
  price: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TSalesTaxSummary = {
  year: number;
  totalSalesRevenue: number;
  platformFees: number;
  netPayouts: number;
  subscriptionFeesPaid: number;
  refundIssue: number;
  payoutDatesAndMethods: string;
};

export type TSubscriptionTaxSummary = {
  _id: string;
  planName: string;
  amount: number;
  durationType: 'monthly' | 'yearly';
  tranId: string;
  paidAt: string;
  startDate: string;
  expirationDate: string;
  planStatus: string;
  refundIssue: number;
  payoutDatesAndMethods: string;
};
