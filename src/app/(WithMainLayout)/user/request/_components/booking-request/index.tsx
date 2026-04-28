'use client';

import Spinner from '@/components/shared/Spinner';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetBookingsByEmailQuery } from '@/redux/features/booking/bookingApi';
import { useAppSelector } from '@/redux/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { TBooking } from '@/types/booking.type';
import Image from 'next/image';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { format } from 'date-fns';
import { CalendarClock, CalendarX, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import CancelModal from './cancel-modal';
import RescheduleModal from './reschedule-modal';
import BookingReviewModal from './booking-review-modal';

const statusMap: Record<string, { className: string; label: string }> = {
  pending: {
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    label: 'Pending',
  },
  confirmed: {
    className: 'bg-blue-100 text-blue-800 border-blue-300',
    label: 'Confirmed',
  },
  ongoing: {
    className: 'bg-purple-100 text-purple-800 border-purple-300',
    label: 'Ongoing',
  },
  completed: {
    className: 'bg-green-100 text-green-800 border-green-300',
    label: 'Completed',
  },
  cancelled: {
    className: 'bg-red-100 text-red-800 border-red-300',
    label: 'Cancelled',
  },
};

type PaymentBadgeProps = {
  isPaid: boolean;
  paidAmount?: number;
  totalAmount: number;
};

export const PaymentBadge = ({
  isPaid,
  paidAmount,
  totalAmount,
}: PaymentBadgeProps) => {
  const percentage =
    paidAmount !== undefined
      ? Math.min(100, Math.max(0, Math.round((paidAmount / totalAmount) * 100)))
      : 0;

  // ✅ Fully Paid
  if (isPaid) {
    return (
      <span className="text-xs px-2 py-1 rounded-full w-fit bg-green-100 text-green-700 border border-green-300">
        Paid (100%)
      </span>
    );
  }

  // ✅ Partial Payment
  if (paidAmount !== undefined && paidAmount > 0) {
    return (
      <span className="text-xs px-2 py-1 rounded-full w-fit bg-yellow-100 text-yellow-700 border border-yellow-300">
        {percentage}% Paid
      </span>
    );
  }

  // ❌ Unpaid
  return (
    <span className="text-xs px-2 py-1 rounded-full bg-red-100 w-fit text-red-600 border border-red-300">
      Unpaid
    </span>
  );
};

const BookingsRequest = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  const [selectedCancelBooking, setSelectedCancelBooking] =
    useState<TBooking | null>(null);

  const [selectedRescheduleBooking, setSelectedRescheduleBooking] =
    useState<TBooking | null>(null);

  const [selectedReviewBooking, setSelectedReviewBooking] =
    useState<TBooking | null>(null);

  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  const { data, isLoading } = useGetBookingsByEmailQuery(email);
  const bookings = data?.data ?? [];

  const handleConfirmCancel = () => {
    if (!selectedCancelBooking) return;
    setCancelModalOpen(false);
    setSelectedCancelBooking(null);
  };

  const handleConfirmReschedule = () => {
    if (!selectedRescheduleBooking) return;
    setRescheduleModalOpen(false);
    setSelectedRescheduleBooking(null);
  };

  const renderRequestStatus = (booking: TBooking) => {
    const requestType = booking.request?.type ?? 'none';
    const vendorApproved = booking.request?.vendorApproved;

    if (requestType === 'none') return null;

    const requestLabel =
      requestType === 'cancel' ? 'Cancellation' : 'Reschedule';

    return (
      <div className="flex flex-col gap-1">
        {/* ✅ Pending — null  */}
        {vendorApproved === null && (
          <div className="flex flex-col gap-1">
            <span className="text-yellow-600 text-sm font-medium flex items-center gap-1">
              ⏳ Awaiting Vendor Response
            </span>
            <span className="text-sm text-gray-500">
              Your {requestLabel.toLowerCase()} request is under review.
            </span>
          </div>
        )}

        {/* ✅ Approved */}
        {vendorApproved === true && (
          <div className="flex flex-col gap-1">
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              ✅ {requestLabel} Approved
            </span>
            <span className="text-sm text-gray-500">
              Your {requestLabel.toLowerCase()} request has been approved.
            </span>
          </div>
        )}

        {/* ✅ Rejected */}
        {vendorApproved === false && (
          <div className="flex flex-col gap-1">
            <span className="text-red-600 text-sm font-medium flex items-center gap-1">
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
  };

  const renderActionButtons = (booking: TBooking) => {
    const { status, request } = booking;
    const requestType = request?.type ?? 'none';

    if (requestType !== 'none') {
      return renderRequestStatus(booking);
    }

    if (['pending', 'confirmed', 'ongoing'].includes(status)) {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border border-green-600 text-green-600 hover:text-green-700 hover:border-green-700 hover:bg-white rounded cursor-pointer"
            onClick={() => {
              setSelectedRescheduleBooking(booking);
              setRescheduleModalOpen(true);
            }}
          >
            <CalendarClock className="w-4 h-4 mr-1" />
            Reschedule
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border border-red-600 text-red-600 rounded hover:text-red-700 hover:border-red-700 hover:bg-white cursor-pointer"
            onClick={() => {
              setSelectedCancelBooking(booking);
              setCancelModalOpen(true);
            }}
          >
            <CalendarX className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      );
    }

    // ✅ Completed → Review Button
    if (status === 'completed') {
      return (
        <Button
          size="sm"
          variant="outline"
          className="border border-blue-500 text-blue-600 rounded"
          onClick={() => {
            setSelectedReviewBooking(booking);
            setReviewModalOpen(true);
          }}
        >
          <Star className="w-4 h-4 mr-1" />
          Review
        </Button>
      );
    }

    if (status === 'cancelled') {
      return (
        <span className="text-red-500 text-sm font-medium">Cancelled</span>
      );
    }

    return null;
  };

  const columns: ColumnDef<TBooking>[] = [
    {
      accessorKey: 'service',
      header: 'Service',
      cell: ({ row }) => {
        const service = row.original.service;
        const imageUrl = service?.images?.[0]?.url || '/placeholder.png';

        return (
          <div className="lg:flex gap-3 min-w-[260px]">
            <Image
              src={imageUrl}
              alt={service?.name || 'Service'}
              width={100}
              height={100}
              className="w-20 h-20 rounded border object-cover"
            />

            <div className="lg:mt-0 mt-2">
              <p className="font-medium">{row.original.serviceName}</p>

              <p className="text-sm text-gray-500">
                Provider: {row.original.vendor?.businessName}
              </p>

              <p className="text-xs text-gray-400">ID: {service?.serviceId}</p>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: 'date',
      header: 'Date & Time',
      cell: ({ row }) => (
        <div>
          <p>{format(new Date(row.original.date), 'dd MMM, yyyy')}</p>
          <p className="text-sm text-gray-500">{row.original.time}</p>
          <p className="text-sm text-gray-400">
            Duration - {row.original.duration}s
          </p>
        </div>
      ),
    },

    {
      accessorKey: 'payment',
      header: 'Payment',
      cell: ({ row }) => {
        const {
          paymentType,
          isPaid,
          paidAmount,
          remainingAmount = 0,
          price,
          trnId,
        } = row.original;

        return (
          <div className="flex flex-col gap-1 text-sm min-w-[140px]">
            {/* Payment Type */}
            <span className="capitalize">{paymentType} payment</span>

            {/* Badge */}
            <PaymentBadge
              isPaid={isPaid}
              paidAmount={paidAmount}
              totalAmount={price}
            />

            {/* Paid Amount */}
            {paidAmount !== undefined && (
              <span className="text-xs text-gray-500">Paid: ${paidAmount}</span>
            )}

            {/* Remaining Amount */}
            {remainingAmount > 0 ? (
              <span className="text-xs text-red-500">
                Due: ${remainingAmount}
              </span>
            ) : (
              <span className="text-xs text-green-600">No due</span>
            )}

            {/* Transaction ID */}
            {trnId && (
              <span className="text-xs text-gray-400 break-all">
                TXN: {trnId}
              </span>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },

    {
      accessorKey: 'status',
      header: 'Booking Status',
      cell: ({ row }) => {
        const status = row.original.status;

        const badge = statusMap[status] || {
          className: 'bg-gray-100 text-gray-800 border-gray-300',
          label: status,
        };

        return (
          <Badge
            variant="outline"
            className={`capitalize rounded-full ${badge.className}`}
          >
            {badge.label}
          </Badge>
        );
      },
    },

    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => renderActionButtons(row.original),
    },
  ];

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto my-5 p-3">
      <h1 className="text-xl mb-3">My Bookings</h1>

      <MSWTable columns={columns} data={bookings} />

      <CancelModal
        selectedBooking={selectedCancelBooking}
        isOpen={isCancelModalOpen}
        onOpenChange={setCancelModalOpen}
        onConfirm={handleConfirmCancel}
      />

      <RescheduleModal
        selectedBooking={selectedRescheduleBooking}
        isOpen={isRescheduleModalOpen}
        onOpenChange={setRescheduleModalOpen}
        onConfirm={handleConfirmReschedule}
      />

      <BookingReviewModal
        selectedBooking={selectedReviewBooking}
        isOpen={isReviewModalOpen}
        onOpenChange={setReviewModalOpen}
      />
    </div>
  );
};

export default BookingsRequest;
