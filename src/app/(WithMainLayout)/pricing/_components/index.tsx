'use client';

import { ArrowRight } from 'lucide-react';
import checkIcon from '@/assets/icons/check.png';
import closeIcon from '@/assets/icons/close.png';
import Image from 'next/image';
import { useGetAllSubscriptionPlansQuery } from '@/redux/features/subscription/subscriptionApi';
import { TSubscriptionPlan } from '@/types/subscription.type';
import Spinner from '@/components/shared/Spinner';
import { useAddSubPaymentMutation } from '@/redux/features/subPayment/subPaymentApi';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useEffect, useState } from 'react';

const Pricing = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data, isLoading } = useGetAllSubscriptionPlansQuery({});
  const subscriptionPlans = data?.data || [];

  const router = useRouter();
  const [addSubPayment] = useAddSubPaymentMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleSubscribe: SubmitHandler<FieldValues> = async (plan) => {
    // 🧭 If user not logged in → redirect to login with "redirect" param
    if (!user?.email) {
      router.push(`/login?redirectPath=/pricing`);
      return;
    }

    // 🚫 Only vendors can subscribe
    if (user?.role !== 'vendor') {
      alert('Only vendors can subscribe to a plan.');
      return;
    }

    try {
      setLoadingPlanId(plan._id); // ✅ show loading only for clicked plan

      const payload = { plan: plan._id };

      // 🆓 Free plan
      if (plan.cost === 0) {
        const res = await addSubPayment(payload).unwrap();
        if (res.success) {
          alert('✅ Free subscription activated successfully!');
          router.push('/vendor/profile');
        }
        return;
      }

      // 💳 Paid plan → Stripe checkout redirect URL
      const res = await addSubPayment(payload).unwrap();
      if (res?.data && typeof res.data === 'string') {
        window.location.href = res.data;
      }
    } catch (err: any) {
      console.error('❌ Subscription error:', err);
      alert('Something went wrong while processing your subscription.');
    } finally {
      setLoadingPlanId(null); // ✅ reset loading after specific button completes
    }
  };

  if (isLoading) return <Spinner />;

  const formatValidity = (validity: string) => {
    switch (validity) {
      case 'free':
        return 'Free';
      case '1month':
        return '1 Month';
      case '1year':
        return '1 Year';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {subscriptionPlans.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          {subscriptionPlans.map((plan: TSubscriptionPlan) => (
            <div key={plan._id} className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-semibold text-center mb-2">
                {plan.name}
              </h2>
              <p className="text-gray-500 text-center mb-6 capitalize">
                {plan.description}
              </p>

              <div className="bg-gradient-to-t to-green-800 from-green-500/70 text-white text-center py-4 rounded-md mb-8">
                {plan.cost === 0 ? (
                  <span className="text-3xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold">
                      ${plan.cost.toFixed(2)}
                    </span>
                    <span className="text-xl">
                      {' '}
                      / {formatValidity(plan.validity)}
                    </span>
                  </>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Image src={checkIcon} alt="check" width={20} />
                  <span>
                    Cost: {plan.cost === 0 ? 'Free' : `$${plan.cost}`}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Image
                    src={plan.features.teamMembers ? checkIcon : closeIcon}
                    alt=""
                    width={20}
                  />
                  <span>
                    Add Team Members: {plan.features.teamMembers ? 'Yes' : 'No'}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Image
                    src={plan.features.sharedCalendar ? checkIcon : closeIcon}
                    alt=""
                    width={20}
                  />
                  <span>
                    Shared Calendar:{' '}
                    {plan.features.sharedCalendar ? 'Yes' : 'No'}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Image
                    src={plan.features.taskHub ? checkIcon : closeIcon}
                    alt=""
                    width={20}
                  />
                  <span>Task Hub: {plan.features.taskHub ? 'Yes' : 'No'}</span>
                </li>

                <li className="flex items-center gap-2">
                  <Image
                    src={
                      plan.features.grantPermissionAccess
                        ? checkIcon
                        : closeIcon
                    }
                    alt=""
                    width={20}
                  />
                  <span>
                    Grant Permission Access:{' '}
                    {plan.features.grantPermissionAccess ? 'Yes' : 'No'}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Image src={checkIcon} alt="check" width={20} />
                  <span>Service Max: {plan.limits.serviceMax}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Image src={checkIcon} alt="check" width={20} />
                  <span>Product Max: {plan.limits.productMax}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Image src={checkIcon} alt="check" width={20} />
                  <span>
                    Highlight Offer Max: {plan.limits.highlightOfferMax}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Image src={checkIcon} alt="check" width={20} />
                  <span>Transaction Fee: {plan.limits.transactionFee}%</span>
                </li>

                <li className="flex items-center gap-2">
                  <Image src={checkIcon} alt="check" width={20} />
                  <span>Validity: {formatValidity(plan.validity)}</span>
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loadingPlanId === plan._id}
                className={`w-full text-center border border-gray-300 rounded-md py-3 px-4 font-medium transition-colors ${
                  loadingPlanId === plan._id
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50'
                }`}
              >
                {loadingPlanId === plan._id ? (
                  'Processing...'
                ) : (
                  <>
                    Get Started{' '}
                    <ArrowRight className="inline-block ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center my-20">
          <Image
            src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            alt="No results"
            width={100}
            height={100}
            className="mx-auto"
          />
          <span className="text-center">No results.</span>
        </div>
      )}
    </div>
  );
};

export default Pricing;
