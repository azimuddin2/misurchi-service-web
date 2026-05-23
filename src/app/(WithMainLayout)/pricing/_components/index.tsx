'use client';

import { ArrowRight } from 'lucide-react';
import checkIcon from '@/assets/icons/check.png';
import closeIcon from '@/assets/icons/close.png';
import Image from 'next/image';
import Spinner from '@/components/shared/Spinner';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { TSubscriptionPlan } from '@/types/plan.type';
import { useGetAllSubscriptionPlansQuery } from '@/redux/features/subscriptionPlan/subscriptionPlan';
import { useAddSubscriptionMutation } from '@/redux/features/subscription/subscriptionApi';

const Pricing = () => {
  const user = useAppSelector(selectCurrentUser);
  const vendorId = user?.vendorId as string;
  const { data, isLoading } = useGetAllSubscriptionPlansQuery({});
  const subscriptionPlans = data?.data || [];

  const router = useRouter();
  const [addSubscription] = useAddSubscriptionMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isRequestInFlight = useRef(false);

  const handleSubscribe: SubmitHandler<FieldValues> = async (plan) => {
    if (isRequestInFlight.current) return;
    isRequestInFlight.current = true;
    setIsSubmitting(true);
    setActiveError(null);

    if (!user?.email) {
      isRequestInFlight.current = false;
      setIsSubmitting(false);
      router.push(`/login?redirectPath=/pricing`);
      return;
    }

    if (user?.role !== 'vendor') {
      isRequestInFlight.current = false;
      setIsSubmitting(false);
      toast.error('Only vendors can subscribe to a plan.');
      return;
    }

    try {
      setLoadingPlanId(plan._id);
      const payload = { plan: plan._id, vendor: vendorId };

      if (plan.cost === 0) {
        const res = await addSubscription(payload).unwrap();
        if (res.success) {
          toast.success('Free subscription activated successfully!');
          router.push('/vendor/profile');
        }
        return;
      }

      const res = await addSubscription(payload).unwrap();
      if (res?.data && typeof res.data === 'string') {
        window.location.href = res.data;
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        'Something went wrong while processing your subscription.';
      if (
        msg.toLowerCase().includes('already have an active subscription') ||
        msg.toLowerCase().includes('already on a free plan')
      ) {
        setActiveError(msg);
      } else {
        toast.error(msg);
      }

      setLoadingPlanId(null);
      isRequestInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const isSubscriptionActive = !!activeError;

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
      {/* ✅ Active subscription banner */}
      {activeError && (
        <div className="mb-8 flex items-start gap-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg px-5 py-4 shadow-sm">
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <p className="font-semibold text-sm">Active Subscription Found</p>
            <p className="text-sm mt-0.5">{activeError}</p>
          </div>
        </div>
      )}

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
                  <span>
                    Service Max:{' '}
                    {plan.limits.serviceMax === 'unlimited'
                      ? 'Unlimited'
                      : plan.limits.serviceMax}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Image src={checkIcon} alt="check" width={20} />
                  <span>
                    Product Max:{' '}
                    {plan.limits.productMax === 'unlimited'
                      ? 'Unlimited'
                      : plan.limits.productMax}
                  </span>
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
                disabled={
                  isRequestInFlight.current ||
                  loadingPlanId === plan._id ||
                  isSubscriptionActive ||
                  isSubmitting
                }
                className={`w-full text-center border border-gray-300 rounded-md py-3 px-4 font-medium transition-colors ${
                  loadingPlanId === plan._id || isSubscriptionActive
                    ? 'opacity-50 cursor-not-allowed bg-gray-100'
                    : 'hover:bg-gray-50 cursor-pointer'
                }`}
              >
                {loadingPlanId === plan._id ? (
                  'Processing...'
                ) : isSubscriptionActive ? (
                  'Already Subscribed'
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
