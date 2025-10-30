import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import {
  useCreateVendorAccountMutation,
  useGetVendorAccountStatusMutation,
} from '@/redux/features/stripe/stripeApi';
import { ArrowRight } from 'lucide-react';

const BankAccount = () => {
  const user = useAppSelector(selectCurrentUser);

  // Vendor profile fetch
  const { data: vendorData } = useGetVendorProfileQuery(user?.email as string);
  const vendorId = vendorData?.data?._id as string;

  // Stripe account creation
  const [createVendorAccount, { isLoading: isCreating }] =
    useCreateVendorAccountMutation();

  // Stripe account status
  const [getVendorAccountStatus] = useGetVendorAccountStatusMutation();
  const [status, setStatus] = useState<string>('Loading...');

  // Fetch Stripe status when vendorId available
  useEffect(() => {
    const fetchStatus = async () => {
      if (!vendorId) return;
      try {
        const res = await getVendorAccountStatus({ vendorId }).unwrap();
        setStatus(res.data?.status ?? 'pending');
      } catch (error) {
        setStatus('pending');
      }
    };
    fetchStatus();
  }, [vendorId, getVendorAccountStatus]);

  // Handle Stripe onboarding
  const handleAddBankAccount = async () => {
    if (!vendorId) return;

    try {
      const result = await createVendorAccount({ vendorId }).unwrap();

      if (result.data?.onboardingUrl) {
        window.location.href = result.data.onboardingUrl;
      } else if (result.data?.existing) {
        alert(result.data.message);
        window.location.href = result.data.onboardingUrl;
      }
    } catch (error) {
      alert('Failed to create Stripe account');
    }
  };

  return (
    <div className="mt-5">
      <h1 className="text-2xl font-semibold">Bank Account</h1>
      <div className="shadow p-5 rounded-sm mt-2">
        <div className="flex justify-between px-10">
          <h2 className="text-lg font-medium capitalize text-center">
            Set Up Your Bank Account
          </h2>
          <p className="mt-3 text-center">
            Status: <span className="font-semibold">{status}</span>
          </p>
        </div>

        <button
          onClick={handleAddBankAccount}
          disabled={isCreating || !vendorId}
          className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-3 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4 flex items-center justify-center shadow-gray-500"
        >
          <span className="uppercase text-sm font-semibold mr-2">
            Add bank account
          </span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default BankAccount;
