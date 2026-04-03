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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreateCheckoutSessionMutation } from '@/redux/features/payment/paymentApi';
import { toast } from 'sonner';
import {
  CalendarDays,
  Clock,
  Timer,
  BadgeCheck,
  Hourglass,
  MapPin,
} from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  ongoing: {
    label: 'Ongoing',
    className: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

const MyBookings = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  const { data, isLoading } = useGetBookingsByEmailQuery(email);
  const bookings = data?.data ?? [];

  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const handleCheckout = async (booking: TBooking) => {
    try {
      const payAmount =
        booking.paymentType === 'full'
          ? booking.price
          : booking.paymentType === 'half'
            ? booking.paymentStatus === 'half-paid'
              ? booking.remainingAmount
              : booking.price / 2
            : 0;

      const payload: any = {
        user: booking.user,
        vendor: booking.vendor,
        modelType: 'Booking',
        reference: booking._id,
        price: payAmount,
      };

      const response = await createCheckoutSession(payload).unwrap();

      if (response.success && response.data) {
        window.location.href = response.data;
      } else {
        toast.error(response.message || 'Failed to start payment.');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong.');
    }
  };

  const columns: ColumnDef<TBooking>[] = [
    {
      accessorKey: 'service',
      header: 'Service',
      cell: ({ row }) => {
        const service = row.original.service;
        const imageUrl = service?.images?.[0]?.url || '/placeholder.png';
        return (
          <div className="flex items-start gap-3 min-w-[220px]">
            <Image
              src={imageUrl}
              alt={service?.name || 'Service'}
              width={100}
              height={100}
              className="w-20 h-24 rounded-md object-cover border shadow-sm"
            />
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm leading-tight">
                {row.original.serviceName}
              </p>
              <p className="text-xs text-gray-500">
                🏪 {row.original.vendor?.businessName}
              </p>
              <Badge
                variant="outline"
                className={`text-xs w-fit mt-1 ${statusConfig[row.original.status]?.className}`}
              >
                {statusConfig[row.original.status]?.label}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Schedule',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 text-sm min-w-[130px]">
          <span className="flex items-center gap-1 text-gray-700">
            <CalendarDays size={14} className="text-green-600" />
            {format(new Date(row.original.date), 'dd MMM, yyyy')}
          </span>
          <span className="flex items-center gap-1 text-gray-700">
            <Clock size={14} className="text-green-600" />
            {row.original.time}
          </span>
          <span className="flex items-center gap-1 text-gray-500">
            <Timer size={14} className="text-green-600" />
            {row.original.duration}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Payment',
      cell: ({ row }) => {
        const {
          price,
          paymentType,
          paymentStatus,
          paidAmount,
          remainingAmount,
        } = row.original;

        return (
          <div className="flex flex-col gap-1 text-sm min-w-[140px]">
            <p className="font-bold text-green-600 text-base">
              ${price.toFixed(2)}
            </p>

            {paymentType === 'full' && (
              <span className="text-xs text-gray-500">Full payment</span>
            )}

            {paymentType === 'half' && paymentStatus === 'pending' && (
              <span className="text-xs text-yellow-600">
                Pay ${(price / 2).toFixed(2)} now (50%)
              </span>
            )}

            {paymentType === 'half' && paymentStatus === 'half-paid' && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-green-600">
                  ✅ Paid ${paidAmount?.toFixed(2)}
                </span>
                <span className="text-xs text-orange-500">
                  ⏳ Due ${remainingAmount?.toFixed(2)}
                </span>
              </div>
            )}

            {paymentType === 'later' && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin size={12} /> Pay at venue
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const { isPaid, paymentType, paymentStatus, trnId, trnIds } =
          row.original;

        // সম্পূর্ণ paid
        if (isPaid) {
          return (
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                <BadgeCheck size={16} /> Fully Paid
              </span>
              <p className="text-xs text-gray-400 break-all">TRX: {trnId}</p>
            </div>
          );
        }

        // Later — pay at venue
        if (paymentType === 'later') {
          return (
            <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
              <Hourglass size={14} /> Pay at venue
            </span>
          );
        }

        // Half paid — দ্বিতীয় ৫০% বাকি
        if (paymentType === 'half' && paymentStatus === 'half-paid') {
          return (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-green-600 font-medium">
                ✅ 50% Done
              </span>
              <p className="text-xs text-gray-400 break-all">
                TRX: {trnIds?.[0]}
              </p>
              <Button
                onClick={() => handleCheckout(row.original)}
                size="sm"
                className="text-white mt-1 bg-gradient-to-t to-orange-600 from-orange-400 hover:opacity-90 font-semibold cursor-pointer rounded"
              >
                Pay Remaining 50%
              </Button>
            </div>
          );
        }

        // প্রথমবার pay
        return (
          <Button
            onClick={() => handleCheckout(row.original)}
            disabled={isLoading}
            size="sm"
            className="text-gray-50 rounded border-gray-800 bg-gradient-to-t to-green-800 from-green-600/70 hover:opacity-90 font-semibold cursor-pointer"
          >
            {paymentType === 'half' ? 'Pay 50%' : 'Pay Now'}
          </Button>
        );
      },
    },
  ];

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto my-10 p-3">
      <h1 className="text-xl mb-3">My Bookings</h1>
      <MSWTable columns={columns} data={bookings || []} />
    </div>
  );
};

export default MyBookings;
