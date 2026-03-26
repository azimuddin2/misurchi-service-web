'use client';

import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useCreateStripeConnectAccountMutation } from '@/redux/features/stripe/stripeApi';
import { useGetUserProfileQuery } from '@/redux/features/user/userApi';

import {
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const BankAccount = () => {
  const user = useAppSelector(selectCurrentUser);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Fetch user profile
  const { data: vendorData, isLoading: isVendorLoading } =
    useGetUserProfileQuery(user?.email as string, {
      skip: !user?.email,
    });

  const vendorId = vendorData?.data?._id;
  const stripeAccountId = vendorData?.data?.stripeAccountId;
  const stripeOnboardingComplete = vendorData?.data?.stripeOnboardingComplete;

  const [createStripeConnectAccount, { isLoading: isCreating }] =
    useCreateStripeConnectAccountMutation();

  // ─── Stripe Onboarding Handler ───
  const handleAddBankAccount = async () => {
    try {
      const result = await createStripeConnectAccount().unwrap();
      const stripeData = result?.data;

      // 1️⃣ New onboarding link
      if (stripeData?.object === 'account_link' && stripeData?.url) {
        toast.success('Redirecting to Stripe...');
        window.location.href = stripeData.url;
        return;
      }

      // 2️⃣ Already connected
      if (stripeData?.object === 'already_connected') {
        setAlertMessage('Stripe account already connected successfully.');
        toast.success('Stripe account already connected');
        return;
      }

      // 3️⃣ Unexpected response
      setAlertMessage('Unable to generate Stripe onboarding link.');
      toast.error('Stripe onboarding link not found');
    } catch (err: any) {
      const message =
        err?.data?.message || 'Failed to connect Stripe. Please try again.';
      setAlertMessage(message);
      toast.error(message);
    }
  };

  const isDisabled = isCreating || isVendorLoading || !vendorId;
  const stripeConnected = Boolean(stripeAccountId);

  return (
    <div className="mt-5">
      <h1 className="text-2xl font-semibold">Bank Account</h1>

      <div className="shadow p-6 rounded-md mt-3 bg-white space-y-4">
        {/* Title */}
        <h2 className="text-lg font-medium">Set Up Your Stripe Bank Account</h2>
        <p className="text-sm text-gray-500">
          Connect your bank account via Stripe to receive payments securely. You
          will be redirected to Stripe's onboarding page.
        </p>

        {/* 1️⃣ Stripe Connected & Onboarding Complete */}
        {stripeConnected && stripeOnboardingComplete && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-md border border-green-200">
            <CheckCircle size={18} />
            Stripe account connected successfully.
          </div>
        )}

        {/* 2️⃣ Stripe Connected but Onboarding Incomplete */}
        {stripeConnected && !stripeOnboardingComplete && (
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 p-3 rounded-md border border-yellow-200">
            <AlertCircle size={18} />
            Stripe account exists but onboarding is incomplete. Please continue.
          </div>
        )}

        {/* 3️⃣ Alert from API */}
        {alertMessage && !stripeConnected && (
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 p-3 rounded-md border border-yellow-200">
            <AlertCircle size={18} />
            {alertMessage}
          </div>
        )}

        {/* 4️⃣ Button */}
        {!stripeConnected || !stripeOnboardingComplete ? (
          <button
            onClick={handleAddBankAccount}
            disabled={isDisabled}
            className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 p-3 rounded-md border-b-4 border-r-4 shadow-md text-sm font-semibold uppercase flex justify-center items-center gap-2 cursor-pointer"
          >
            {isCreating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Add / Continue Bank Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        ) : null}

        {/* 5️⃣ Vendor Missing */}
        {!isVendorLoading && !vendorId && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-md border border-red-200">
            <Info size={18} />
            Vendor profile not found. Please complete your profile first.
          </div>
        )}
      </div>
    </div>
  );
};

export default BankAccount;
