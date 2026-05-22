'use client';

import Spinner from '@/components/shared/Spinner';
import { useGetActiveSubscriptionByVendorQuery, useCancelActiveSubscriptionMutation } from '@/redux/features/subPayment/subPaymentApi';
import Image from 'next/image';
import React, { useState } from 'react';
import checkIcon from '@/assets/icons/check.png';
import closeIcon from '@/assets/icons/close.png';
import { TSubscriptionPlan } from '@/types/plan.type';
import { TSubscription } from '@/types/subscription.type';
import { ArrowRight, Clock, PackageX } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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

const ActiveSubscription = ({ vendorId }: { vendorId: string }) => {
  const { data, isLoading, refetch } = useGetActiveSubscriptionByVendorQuery(vendorId);
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelActiveSubscriptionMutation();
  const [showModal, setShowModal] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  const activeSubscription = data?.data as any;
  const plan = activeSubscription?.plan as TSubscriptionPlan;
  const subscription = activeSubscription as TSubscription;

  const handleCancel = async () => {
    try {
      const res = await cancelSubscription(vendorId).unwrap();
      setCancelMessage(res?.message);
      setShowModal(true);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!activeSubscription || !plan) {
    return (
      <div className="bg-white rounded-lg p-10 shadow text-center mt-24 border">
        <PackageX className="mx-auto mb-3 text-gray-400" size={48} />
        <h3 className="text-xl font-semibold text-gray-700 mb-1">
          No Subscription Found
        </h3>
        <p className="text-gray-400 text-sm">
          You don&apos;t have any active subscription yet.
        </p>
        <Link href="/pricing">
          <button className="inline-flex items-center gap-2 text-gray-50 bg-gradient-to-t to-green-800 from-green-500/70 hover:opacity-90 px-8 py-3 cursor-pointer text-sm mt-4 shadow-sm rounded-sm border-b-4 border-r-4 border-gray-800 shadow-gray-500 uppercase font-medium">
            Explore Subscription Plans
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    );
  }

  const now = new Date();

  const isExpired =
    subscription?.status === 'expired' ||
    subscription?.isExpired ||
    new Date(subscription?.expiredAt) < now;

  const isCanceled = subscription?.status === 'canceled';
  const isBasicPlan = plan?.cost === 0;

  if (isExpired) {
    return (
      <div className="bg-white rounded-lg p-10 shadow text-center">
        <Clock className="mx-auto mb-3 text-orange-400" size={48} />
        <h3 className="text-xl font-semibold text-gray-700 mb-1">
          Subscription Expired
        </h3>
        <p className="text-gray-400 text-sm">
          {`Your subscription expired on ${new Date(
            subscription.expiredAt,
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}. Please renew to continue.`}
        </p>
        <Link href="/pricing">
          <button className="inline-flex items-center gap-2 text-gray-50 bg-gradient-to-t to-green-800 from-green-500/70 hover:opacity-90 px-8 py-3 cursor-pointer text-sm mt-4 shadow-sm rounded-sm border-b-4 border-r-4 border-gray-800 shadow-gray-500 uppercase font-medium">
            <span>Renew Subscription</span>
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-2 ml-2">
        Active Subscription &nbsp;
        <span className="text-green-600 text-sm font-normal">
          {subscription?.startedAt
            ? new Date(subscription.startedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
            : 'N/A'}
        </span>
        {' → '}
        <span className="text-red-500 text-sm font-normal">
          {subscription?.expiredAt
            ? new Date(subscription.expiredAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
            : 'N/A'}
        </span>
      </h2>

      <div key={plan?._id as string} className="bg-white rounded-lg p-8 shadow">
        <h2 className="text-3xl font-semibold text-center mb-2">
          {plan?.name}
        </h2>
        <p className="text-gray-500 text-center mb-6 capitalize">
          {plan?.description}
        </p>

        <div className="bg-gradient-to-t to-green-800 from-green-500/70 text-white text-center py-4 rounded-md mb-8">
          {plan?.cost === 0 ? (
            <span className="text-3xl font-bold">Free</span>
          ) : (
            <>
              <span className="text-3xl font-bold">
                ${plan?.cost?.toFixed(2)}
              </span>
              <span className="text-xl">
                {' '}/ {formatValidity(plan?.validity)}
              </span>
            </>
          )}
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-2">
            <Image src={checkIcon} alt="check" width={20} />
            <span>
              Cost: {plan?.cost === 0 ? 'Free' : `$${plan?.cost?.toFixed(2)}`}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Image
              src={plan?.features?.teamMembers ? checkIcon : closeIcon}
              alt=""
              width={20}
            />
            <span>
              Add Team Members: {plan?.features?.teamMembers ? 'Yes' : 'No'}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Image
              src={plan?.features?.sharedCalendar ? checkIcon : closeIcon}
              alt=""
              width={20}
            />
            <span>
              Shared Calendar: {plan?.features?.sharedCalendar ? 'Yes' : 'No'}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Image
              src={plan?.features?.taskHub ? checkIcon : closeIcon}
              alt=""
              width={20}
            />
            <span>Task Hub: {plan?.features?.taskHub ? 'Yes' : 'No'}</span>
          </li>
          <li className="flex items-center gap-2">
            <Image
              src={plan?.features?.grantPermissionAccess ? checkIcon : closeIcon}
              alt=""
              width={20}
            />
            <span>
              Grant Permission Access:{' '}
              {plan?.features?.grantPermissionAccess ? 'Yes' : 'No'}
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
            <span>Highlight Offer Max: {plan?.limits?.highlightOfferMax}</span>
          </li>
          <li className="flex items-center gap-2">
            <Image src={checkIcon} alt="check" width={20} />
            <span>Transaction Fee: {plan?.limits?.transactionFee}%</span>
          </li>
          <li className="flex items-center gap-2">
            <Image src={checkIcon} alt="check" width={20} />
            <span>Validity: {formatValidity(plan?.validity)}</span>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          {/* Upgrade Button */}
          <Link
            href="/pricing"
            className={`flex-1 ${isBasicPlan ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            <button
              disabled={!isBasicPlan}
              className={`w-full px-6 py-3 rounded-sm font-medium text-sm uppercase border-b-4 border-r-4 ${!isBasicPlan
                ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-t to-green-800 from-green-500/70 text-white border-gray-800 hover:opacity-90 cursor-pointer'
                }`}
            >
              Upgrade
            </button>
          </Link>

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            disabled={isBasicPlan || isCanceling || isCanceled}
            className={`flex-1 px-6 py-3 rounded-sm font-medium text-sm uppercase border-b-4 border-r-4 ${isBasicPlan || isCanceled
              ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              : 'bg-red-500 text-white border-red-800 hover:opacity-90 cursor-pointer'
              }`}
          >
            {isCanceled ? 'Plan Canceled' : isCanceling ? 'Canceling...' : 'Cancel Plan'}
          </button>
        </div>
      </div>

      {/* Cancel Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl text-center">
            <PackageX className="mx-auto mb-3 text-orange-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Subscription Canceled
            </h3>
            <p className="text-gray-500 text-sm mb-6">{cancelMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-gradient-to-t to-green-800 from-green-500/70 text-white rounded-sm font-medium hover:opacity-90"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveSubscription;