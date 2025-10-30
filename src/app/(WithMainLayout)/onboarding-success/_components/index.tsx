'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useGetVendorAccountStatusMutation } from '@/redux/features/stripe/stripeApi';

const OnboardingSuccess = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: vendorData } = useGetVendorProfileQuery(user?.email as string);
  const vendorId = vendorData?.data?._id as string;

  const [getVendorAccountStatus, { data }] =
    useGetVendorAccountStatusMutation();
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    const fetchStatus = async () => {
      if (vendorId) {
        try {
          const res = await getVendorAccountStatus({ vendorId }).unwrap();
          setStatus(res.data?.status ?? 'pending');
        } catch (error) {
          console.error('Failed to fetch Stripe status:', error);
          setStatus('pending');
        }
      }
    };

    fetchStatus();
  }, [vendorId, getVendorAccountStatus]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-md text-center">
      <h1 className="text-2xl font-bold mb-4 text-green-700">
        🎉 Stripe Onboarding Complete
      </h1>

      <p className="text-gray-700 mb-4">
        {status === 'pending'
          ? 'Your Stripe account is almost ready. Please wait for verification.'
          : `Your Stripe account status is: `}
        {status !== 'pending' && (
          <span className="font-semibold text-green-600">{status}</span>
        )}
      </p>

      {status === 'Loading...' && (
        <p className="text-gray-400">Loading account status...</p>
      )}

      <button
        onClick={() => (window.location.href = '/vendor/dashboard')}
        className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-3 cursor-pointer text-base font-semibold mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4 flex items-center justify-center shadow-gray-500"
      >
        {status === 'verified' ? 'Go to Dashboard' : 'Check Dashboard Later'}
      </button>
    </div>
  );
};

export default OnboardingSuccess;
