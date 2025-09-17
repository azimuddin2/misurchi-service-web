'use client';

import Spinner from '@/components/shared/Spinner';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useGetOrdersByEmailQuery } from '@/redux/features/order/orderApi';
import { TOrder } from '@/types/order.type';
import { Badge } from '@/components/ui/badge';

const OrdersRequest = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  const { data, isLoading } = useGetOrdersByEmailQuery(email);
  const orders = data?.data ?? [];

  const columns: ColumnDef<TOrder>[] = [
    {
      accessorKey: 'products',
      header: 'Products',
      cell: ({ row }) => {
        const products = row.original.products || [];
        const visible = products.slice(0, 2);

        return (
          <div className="lg:flex flex-col gap-2 w-fit">
            {visible.map((p) => (
              <div key={p.product} className="flex items-center gap-3">
                <Image
                  src={p.image || '/placeholder.png'}
                  alt={p.name}
                  width={64}
                  height={64}
                  className="lg:w-24 lg:h-24 object-cover rounded border"
                />
                <div>
                  <p className="text-base font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {p.quantity}
                  </p>
                  <p className="text-sm text-gray-500">Price: ${p.price}</p>
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'vendor',
      header: 'Vendor Provider',
      cell: ({ row }) => (
        <div>
          <p className="text-base font-semibold">
            {row.original.vendor?.businessName}
          </p>
          <p className="text-sm text-gray-500">{row.original.vendor?.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { className: string; label: string }> =
          {
            pending: {
              className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
              label: 'Pending',
            },
            shipped: {
              className: 'bg-blue-100 text-blue-800 border-blue-300',
              label: 'Shipped',
            },
            delivered: {
              className: 'bg-green-100 text-green-800 border-green-300',
              label: 'Delivered',
            },
            cancelled: {
              className: 'bg-red-100 text-red-800 border-red-300',
              label: 'Cancelled',
            },
          };

        const badge = statusMap[status] || {
          className: 'bg-gray-100 text-gray-800 border-gray-300',
          label: status,
        };

        return (
          <Badge
            variant="outline"
            className={`capitalize px-2 py-1 rounded-full ${badge.className}`}
          >
            {badge.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-base">
          {format(new Date(row.original.createdAt), 'dd MMM, yyyy hh:mm a')}
        </span>
      ),
    },
    {
      accessorKey: 'totalPrice',
      header: 'SubTotal',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">
          ${row.original.totalPrice}
        </span>
      ),
    },
    {
      accessorKey: 'request',
      header: 'Request',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.status === 'pending' ? (
            <Button
              size="sm"
              variant={'outline'}
              className="border border-red-400 rounded text-red-500 capitalize hover:text-red-600 cursor-pointer"
            >
              Cancelled
            </Button>
          ) : (
            <Button
              size="sm"
              variant={'outline'}
              className="capitalize rounded cursor-pointer"
            >
              Return
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto my-10 p-3">
      {/* <h1 className="text-xl mb-3">My Orders</h1> */}
      <MSWTable columns={columns} data={orders || []} />
    </div>
  );
};

export default OrdersRequest;
