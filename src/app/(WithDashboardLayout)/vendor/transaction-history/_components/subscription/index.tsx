'use client';

import Spinner from '@/components/shared/Spinner';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetSubPaymentByVendorQuery } from '@/redux/features/subPayment/subPaymentApi';
import { useAppSelector } from '@/redux/hooks';
import { TSubPayment } from '@/types/subPayment.type';
import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { MSWTable } from '@/components/ui/core/MSWTable';
import MSWPagination from '@/components/ui/core/MSWPagination';
import ActiveSubscription from './active-subscription';

const SubscriptionHistory = () => {
  const user = useAppSelector(selectCurrentUser);
  const vendorId = user?.vendorId as string;
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 3;
  const createdAt = searchParams.get('createdAt') || '';

  const { data, isLoading } = useGetSubPaymentByVendorQuery({
    vendorId,
    page,
    limit,
    query: {
      createdAt,
    },
  });

  const subPayments: TSubPayment[] = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const columns: ColumnDef<TSubPayment>[] = [
    {
      accessorKey: 'plan',
      header: 'Plan Name',
      cell: ({ row }) => {
        const plan = row.original.plan as any;
        return (
          <span className="font-medium text-gray-900">{plan?.name || '-'}</span>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <span>${row.original.amount.toFixed(2)}</span>,
    },
    {
      accessorKey: 'durationType',
      header: 'Trial',
      cell: ({ row }) => (
        <span className="text-gray-600 capitalize">
          {row.original.durationType}
        </span>
      ),
    },
    {
      accessorKey: 'subscription',
      header: 'Start Date',
      cell: ({ row }) => {
        const subscription = row.original.subscription as any;
        return (
          <span className="text-gray-600">
            {subscription?.startedAt
              ? format(new Date(subscription.startedAt), 'MMMM d, yyyy')
              : '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'expiredAt',
      header: 'Expiration Date',
      cell: ({ row }) => {
        const subscription = row.original.subscription as any;
        return (
          <span className="text-gray-600">
            {subscription?.expiredAt
              ? format(new Date(subscription.expiredAt), 'MMMM d, yyyy')
              : '-'}
          </span>
        );
      },
    },

    {
      accessorKey: 'isPaid',
      header: 'Plan Status',
      cell: ({ row }) => {
        const subscription = row.original.subscription as any;
        const now = new Date();

        const isExpired = subscription?.expiredAt
          ? new Date(subscription.expiredAt) < now
          : false;

        const status = isExpired
          ? 'expired'
          : subscription?.status || 'pending';

        return (
          <span
            className={`font-medium capitalize text-sm ${
              status === 'active'
                ? 'text-green-600 bg-green-50 px-4 py-1 rounded'
                : status === 'expired'
                  ? 'text-red-600 bg-red-50 px-2 py-1 rounded'
                  : status === 'canceled'
                    ? 'text-orange-500 bg-orange-50 px-2 py-1 rounded'
                    : 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded'
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mt-3">
      {/* Table */}
      <MSWTable columns={columns} data={subPayments} />

      {/* Pagination */}
      {subPayments.length > 0 && <MSWPagination totalPage={meta.totalPage} />}

      <ActiveSubscription vendorId={vendorId} />
    </div>
  );
};

export default SubscriptionHistory;
