export type TReferralLink = {
  referralCode: string;
  referralLink: string;
};

export type TTransaction = {
  transactionId: string;
  points: number;
  method: string;
  referee: string;
  date: string;
  status: string;
};

export type TReferralStats = {
  pointsPerReferral: number;
  totalPoints: number;
  worthEquivalent: string;
  payoutNotice: string;
  businessNames: string;
  transactions: TTransaction[];
};
