export type TSalesTaxSummary = {
  year: number;
  totalSalesRevenue: number;
  platformFees: number;
  netPayouts: number;
  subscriptionFeesPaid: number;
  planName: string;
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

export type TPayoutEntry = {
  transactionId: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
};

export type TSalesTaxSummaryDetail = {
  year: number;
  totalSalesRevenue: number;
  platformFees: number;
  netPayouts: number;
  subscriptionFeesPaid: number;
  planName: string;
  refundIssue: number;
  payouts: TPayoutEntry[];
};
