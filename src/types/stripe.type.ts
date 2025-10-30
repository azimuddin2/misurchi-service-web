export type TVendorStripeAccount = {
  _id: string;
  vendor: string;
  stripeAccountId: string;
  email: string;
  status: 'pending' | 'verified' | 'restricted';
  detailsSubmitted: boolean;
  payoutsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

// Response for onboarding URL
export type TStripeOnboardingResponse = {
  account?: TVendorStripeAccount;
  onboardingUrl?: string;
  existing?: boolean;
  message?: string;
};
