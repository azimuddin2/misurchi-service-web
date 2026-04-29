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
import { useState } from 'react';
import CancelledModal from './cancelled-modal';
import ReturnModal from './return-modal';
import OrderReviewModal from './order-review-modal';

const statusMap: Record<string, { className: string; label: string }> = {
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
  returned: {
    className: 'bg-purple-100 text-purple-800 border-purple-300',
    label: 'Returned',
  },
};

const PaymentBadge = ({ isPaid }: { isPaid: boolean }) =>
  isPaid ? (
    <Badge className="bg-green-100 text-green-700 border-green-300 border rounded-full px-2 py-1 text-xs">
      Paid
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-700 border-red-300 border rounded-full px-2 py-1 text-xs">
      Unpaid
    </Badge>
  );

const OrdersRequest = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  const [selectedCancelOrder, setSelectedCancelOrder] = useState<TOrder | null>(
    null,
  );
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<TOrder | null>(
    null,
  );
  const [selectedReviewOrder, setSelectedReviewOrder] = useState<TOrder | null>(
    null,
  );

  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isReturnModalOpen, setReturnModalOpen] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  const { data, isLoading } = useGetOrdersByEmailQuery(email);
  const orders = data?.data ?? [];

  const handleConfirmCancel = () => {
    if (!selectedCancelOrder) return;
    setCancelModalOpen(false);
    setSelectedCancelOrder(null);
  };

  const handleConfirmReturn = () => {
    if (!selectedReturnOrder) return;
    setReturnModalOpen(false);
    setSelectedReturnOrder(null);
  };

  const renderActionButtons = (order: TOrder) => {
    const { status, isPaid, request } = order;
    const requestType = request?.type ?? 'none';
    const vendorApproved = request?.vendorApproved;

    const requestLabel =
      requestType === 'cancelled' ? 'Cancellation' : 'Return';

    // ✅ Request already submitted
    if (requestType !== 'none') {
      return (
        <div className="flex flex-col gap-1">
          {/* Pending */}
          {vendorApproved === null && (
            <div className="flex flex-col gap-1">
              <span className="text-yellow-600 font-medium text-sm flex items-center gap-1">
                ⏳ Awaiting Vendor Response
              </span>
              <span className="text-sm text-gray-500">
                Your {requestLabel.toLowerCase()} request is under review.
              </span>
            </div>
          )}

          {/* Approved */}
          {vendorApproved === true && (
            <div className="flex flex-col gap-1">
              <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                ✅ {requestLabel} Approved
              </span>
              <span className="text-sm text-gray-500">
                Your {requestLabel.toLowerCase()} request has been approved.
              </span>
            </div>
          )}

          {/* Rejected */}
          {vendorApproved === false && (
            <div className="flex flex-col gap-1">
              <span className="text-red-600 font-medium text-sm flex items-center gap-1">
                ❌ {requestLabel} Rejected
              </span>
              <span className="text-sm text-gray-500">
                Your {requestLabel.toLowerCase()} request was declined by the
                vendor.
              </span>
            </div>
          )}
        </div>
      );
    }

    // ✅ Unpaid + Pending → Cancel
    if (!isPaid && status === 'pending') {
      return (
        <Button
          size="sm"
          variant="outline"
          className="border border-red-400 rounded text-red-500 hover:text-red-600 w-1/2 cursor-pointer"
          onClick={() => {
            setSelectedCancelOrder(order);
            setCancelModalOpen(true);
          }}
        >
          Cancel
        </Button>
      );
    }

    // ✅ Paid + Pending or Shipped → Cancel
    if (isPaid && (status === 'pending' || status === 'shipped')) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="border border-red-400 rounded text-red-500 hover:text-red-600 cursor-pointer w-1/2"
          onClick={() => {
            setSelectedCancelOrder(order);
            setCancelModalOpen(true);
          }}
        >
          Cancel
        </Button>
      );
    }

    // ✅ Paid + Delivered → Return + Review
    if (isPaid && status === 'delivered') {
      return (
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border border-green-500 rounded text-green-500 hover:text-green-600 cursor-pointer w-1/2"
            onClick={() => {
              setSelectedReturnOrder(order);
              setReturnModalOpen(true);
            }}
          >
            Return
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border border-blue-400 rounded text-blue-500 hover:text-blue-600 cursor-pointer w-1/2"
            onClick={() => {
              setSelectedReviewOrder(order);
              setReviewModalOpen(true);
            }}
          >
            Review
          </Button>
        </div>
      );
    }

    // ✅ Unpaid + Delivered → No action
    if (!isPaid && status === 'delivered') {
      return <span className="text-gray-400 text-sm">No action available</span>;
    }

    return null;
  };

  const columns: ColumnDef<TOrder>[] = [
    {
      accessorKey: 'products',
      header: 'Products',
      cell: ({ row }) => {
        const products = row.original.products || [];
        return (
          <div className="flex flex-col gap-2 min-w-[260px] max-w-[320px]">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-3 p-2 rounded-sm"
              >
                <Image
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border"
                />
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-medium break-words">
                    {product.name}
                  </p>
                  <div className="flex gap-2 flex-wrap my-1">
                    {product.size && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                        Size: {product.size}
                      </span>
                    )}
                    {product.color && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded flex items-center gap-1 font-medium">
                        Color:
                        <span
                          className="w-3 h-3 rounded-full border border-gray-300 ml-1"
                          style={{ backgroundColor: product.color }}
                        />
                        {product.color}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Quantity: {product.quantity}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Price: ${product.price}
                  </p>
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
          <p className="text-base font-semibold text-gray-600">
            {row.original.vendor?.businessName || 'Unknown Vendor'}
          </p>
          <p className="text-sm text-gray-500">{row.original.vendor?.email}</p>
          <p className="text-xs text-gray-500">{row.original.vendor?.phone}</p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Delivery Status',
      cell: ({ row }) => {
        const status = row.original.status;
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
      accessorKey: 'isPaid',
      header: 'Payment Status',
      cell: ({ row }) => {
        const { isPaid, trnId } = row.original;
        return (
          <div className="flex flex-col gap-1">
            <PaymentBadge isPaid={isPaid} />
            {trnId && (
              <span className="text-xs text-gray-500 font-mono break-all">
                TXN ID: {trnId}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date & Time',
      cell: ({ row }) => (
        <span className="text-sm">
          {format(new Date(row.original.createdAt), 'dd MMM, yyyy hh:mm a')}
        </span>
      ),
    },
    {
      accessorKey: 'totalPrice',
      header: 'Total',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">
          ${row.original.totalPrice.toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'request',
      header: 'Action',
      cell: ({ row }) => renderActionButtons(row.original),
    },
  ];

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto lg:my-6 p-3">
      <h1 className="text-xl mb-3">My Orders</h1>
      <MSWTable columns={columns} data={orders} />

      <CancelledModal
        selectedOrder={selectedCancelOrder}
        isOpen={isCancelModalOpen}
        onOpenChange={setCancelModalOpen}
        onConfirm={handleConfirmCancel}
      />
      <ReturnModal
        selectedOrder={selectedReturnOrder}
        isOpen={isReturnModalOpen}
        onOpenChange={setReturnModalOpen}
        onConfirm={handleConfirmReturn}
      />
      <OrderReviewModal
        selectedOrder={selectedReviewOrder}
        isOpen={isReviewModalOpen}
        onOpenChange={setReviewModalOpen}
      />
    </div>
  );
};

export default OrdersRequest;
