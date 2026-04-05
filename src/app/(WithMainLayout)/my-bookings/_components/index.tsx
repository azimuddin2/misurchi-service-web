'use client';

import Spinner from '@/components/shared/Spinner';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetBookingsByEmailQuery } from '@/redux/features/booking/bookingApi';
import { useAppSelector } from '@/redux/hooks';
import { TBooking } from '@/types/booking.type';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useCreateCheckoutSessionMutation } from '@/redux/features/payment/paymentApi';
import { toast } from 'sonner';
import {
  CalendarDays,
  Clock,
  Timer,
  BadgeCheck,
  MapPin,
  CreditCard,
  Package,
  Sparkles,
} from 'lucide-react';

/* ─── Status config ──────────────────────────────────────────── */
const statusConfig: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: 'Pending',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  confirmed: {
    label: 'Confirmed',
    dot: 'bg-blue-400',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  ongoing: {
    label: 'Ongoing',
    dot: 'bg-violet-400',
    badge: 'bg-violet-50 text-violet-700 border border-violet-200',
  },
  completed: {
    label: 'Completed',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  cancelled: {
    label: 'Cancelled',
    dot: 'bg-red-400',
    badge: 'bg-red-50 text-red-700 border border-red-200',
  },
};

/* ─── Empty State ────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5 shadow-inner">
        <Package size={36} className="text-green-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        No bookings yet
      </h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Your upcoming and past bookings will appear here once you make a
        reservation.
      </p>
    </div>
  );
}

/* ─── Payment Action ─────────────────────────────────────────── */
function PaymentAction({
  booking,
  onCheckout,
}: {
  booking: TBooking;
  onCheckout: (b: TBooking) => void;
}) {
  const { isPaid, paymentType, paymentStatus, trnId, trnIds } = booking;

  if (isPaid) {
    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
          <BadgeCheck size={15} />
          Fully Paid
        </span>
        {trnId && (
          <p className="text-sm text-gray-400 font-mono truncate">
            TXN: {trnId}
          </p>
        )}
      </div>
    );
  }

  if (paymentType === 'later') {
    return (
      <span className="inline-flex items-center gap-1.5 text-amber-600 text-sm font-medium">
        <MapPin size={13} />
        Pay at venue
      </span>
    );
  }

  if (paymentType === 'half' && paymentStatus === 'half-paid') {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
            <BadgeCheck size={12} /> 50% paid
          </span>
          {trnIds?.[0] && (
            <p className="text-xs text-gray-400 font-mono truncate">
              TXN: {trnIds[0]}
            </p>
          )}
        </div>
        <Button
          onClick={() => onCheckout(booking)}
          size="sm"
          className="h-8 text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90 rounded cursor-pointer border-0 shadow-sm"
        >
          <CreditCard size={14} className="mr-1" />
          Pay Remaining 50%
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => onCheckout(booking)}
      size="sm"
      className="text-gray-50 rounded border-gray-800 bg-gradient-to-t to-green-800 from-green-600/70 hover:bg-green-500/80 font-semibold cursor-pointer whitespace-nowrap cursro-pointer"
    >
      <CreditCard size={12} className="mr-1" />
      {paymentType === 'half' ? 'Pay 50%' : 'Pay Now'}
    </Button>
  );
}

/* ─── Booking Card ───────────────────────────────────────────── */
function BookingCard({
  booking,
  onCheckout,
}: {
  booking: TBooking;
  onCheckout: (b: TBooking) => void;
}) {
  const status = statusConfig[booking.status] ?? statusConfig.pending;
  const imageUrl = booking.service?.images?.[0]?.url || '/placeholder.png';

  const { price, paymentType, paymentStatus, paidAmount, remainingAmount } =
    booking;

  return (
    <div className="group relative bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Top accent bar — color matches status */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${status.dot}`} />

      <div className="flex flex-col sm:flex-row gap-0">
        {/* ── Image ── */}
        <div className="relative sm:w-36 w-full h-40 sm:h-auto flex-shrink-0">
          <Image
            src={imageUrl}
            alt={booking.serviceName || 'Service'}
            fill
            className="object-cover sm:rounded-l-lg rounded-t-lg sm:rounded-tr-none"
          />
          {/* Gradient overlay on mobile bottom */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent sm:hidden" />
        </div>

        {/* ── Content ── */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-xl leading-snug line-clamp-1">
                {booking.serviceName}
              </h3>
              <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1 truncate">
                <Sparkles size={14} className="text-green-500 flex-shrink-0" />
                <span className="text-base">
                  Provider - {booking.vendor?.businessName}
                </span>
              </p>
            </div>
            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${status.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
            <InfoItem
              icon={<CalendarDays size={14} className="text-green-500" />}
              label="Date"
              value={format(new Date(booking.date), 'dd MMM, yyyy')}
            />
            <InfoItem
              icon={<Clock size={14} className="text-green-500" />}
              label="Time"
              value={booking.time}
            />
            <InfoItem
              icon={<Timer size={16} className="text-green-500" />}
              label="Duration"
              value={booking.duration}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Footer: Price + Action */}
          <div className="flex items-end justify-between gap-3 flex-wrap">
            {/* Price breakdown */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                Total
              </span>
              <span className="text-lg font-bold text-gray-900 leading-none">
                ${price.toFixed(2)}
              </span>

              {paymentType === 'full' && (
                <span className="text-sm text-gray-400">Full payment</span>
              )}

              {paymentType === 'half' && paymentStatus === 'pending' && (
                <span className="text-sm text-amber-600">
                  ${(price / 2).toFixed(2)} due now
                </span>
              )}

              {paymentType === 'half' && paymentStatus === 'half-paid' && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-emerald-600">
                    Paid ${paidAmount?.toFixed(2)}
                  </span>
                  <span className="text-sm text-orange-500">
                    Due ${remainingAmount?.toFixed(2)}
                  </span>
                </div>
              )}

              {paymentType === 'later' && (
                <span className="text-sm text-gray-400">Pay at venue</span>
              )}
            </div>

            {/* Action */}
            <PaymentAction booking={booking} onCheckout={onCheckout} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Info Item ──────────────────────────────────────────────── */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium flex items-center gap-1">
        {icon}
        <span className="text-sm">{label}</span>
      </p>
      <span className="text-sm text-gray-700 font-medium">{value}</span>
    </div>
  );
}

/* ─── Stats Bar ──────────────────────────────────────────────── */
// function StatsBar({ bookings }: { bookings: TBooking[] }) {
//   const total = bookings.length;
//   const completed = bookings.filter((b) => b.status === 'completed').length;
//   const pending = bookings.filter((b) =>
//     ['pending', 'confirmed'].includes(b.status),
//   ).length;
//   const totalSpent = bookings
//     .filter((b) => b.isPaid)
//     .reduce((s, b) => s + b.price, 0);

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//       {[
//         { label: 'Total Bookings', value: total, color: 'text-gray-800' },
//         {
//           label: 'Completed',
//           value: completed,
//           color: 'text-emerald-600',
//         },
//         { label: 'Upcoming', value: pending, color: 'text-blue-600' },
//         {
//           label: 'Total Spent',
//           value: `$${totalSpent.toFixed(2)}`,
//           color: 'text-green-700',
//         },
//       ].map((stat) => (
//         <div
//           key={stat.label}
//           className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col gap-0.5"
//         >
//           <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
//             {stat.label}
//           </span>
//           <span className={`text-xl font-bold ${stat.color}`}>
//             {stat.value}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

/* ─── Main Page ──────────────────────────────────────────────── */
const MyBookings = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  const { data, isLoading } = useGetBookingsByEmailQuery(email);
  const bookings: TBooking[] = data?.data ?? [];

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

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen mx-auto">
      <div className="container mx-auto my-10 px-4">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            My Bookings
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your appointments and payments
          </p>
        </div>

        {/* Stats */}
        {/* {bookings.length > 0 && <StatsBar bookings={bookings} />} */}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCheckout={handleCheckout}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
