'use client';

import Spinner from '@/components/shared/Spinner';
import { useGetActiveSubscriptionByVendorQuery } from '@/redux/features/subPayment/subPaymentApi';
import Image from 'next/image';
import React from 'react';
import checkIcon from '@/assets/icons/check.png';
import closeIcon from '@/assets/icons/close.png';
import { TSubPayment } from '@/types/subPayment.type';
import { TSubscriptionPlan } from '@/types/plan.type';
import { TSubscription } from '@/types/subscription.type';
import { ArrowRight, Clock, PackageX } from 'lucide-react';
import Link from 'next/link';

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
  const { data, isLoading } = useGetActiveSubscriptionByVendorQuery(vendorId);

  const activeSubscription = data?.data as TSubPayment;
  const plan = activeSubscription?.plan as TSubscriptionPlan;
  const subscription = activeSubscription?.subscription as TSubscription;

  if (isLoading) {
    return <Spinner />;
  }

  if (!activeSubscription || !plan || !subscription) {
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

  const isExpired =
    subscription?.status === 'expired' ||
    subscription?.isExpired ||
    new Date(subscription?.expiredAt) < new Date();

  const isCanceled = subscription?.status === 'canceled';

  if (isExpired || isCanceled) {
    return (
      <div className="bg-white rounded-lg p-10 shadow text-center">
        {isCanceled ? (
          <PackageX className="mx-auto mb-3 text-red-400" size={48} />
        ) : (
          <Clock className="mx-auto mb-3 text-orange-400" size={48} />
        )}
        <h3 className="text-xl font-semibold text-gray-700 mb-1">
          {isCanceled ? 'Subscription Canceled' : 'Subscription Expired'}
        </h3>
        <p className="text-gray-400 text-sm">
          {isCanceled
            ? 'Your subscription has been canceled. Renew to regain access to premium features.'
            : `Your subscription expired on ${new Date(
              subscription.expiredAt,
            ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}. Please renew to continue.`}
        </p>
        <Link href="/pricing">
          <button className="inline-flex items-center gap-2 text-gray-50 bg-gradient-to-t to-green-800 from-green-500/70 hover:opacity-90 px-8 py-3 cursor-pointer text-sm mt-4 shadow-sm rounded-sm border-b-4 border-r-4 border-gray-800 shadow-gray-500 uppercase font-medium ">
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
                {' '}
                / {formatValidity(plan?.validity)}
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
              src={
                plan?.features?.grantPermissionAccess ? checkIcon : closeIcon
              }
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
            <span>Add Service Max: {plan?.limits?.serviceMax}</span>
          </li>
          <li className="flex items-center gap-2">
            <Image src={checkIcon} alt="check" width={20} />
            <span>Add Product Max: {plan?.limits?.productMax}</span>
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
      </div>
    </div>
  );
};

export default ActiveSubscription;
