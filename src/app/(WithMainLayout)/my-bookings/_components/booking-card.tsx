'use client';

import { TBooking } from '@/types/booking.type';
import { CalendarDays, Clock, Timer, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import PaymentAction from './payment-action';
import InfoItem from './info-item';
import { Button } from '@/components/ui/button';

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

const BookingCard = ({
  booking,
  onCheckout,
  onSelect,
}: {
  booking: TBooking;
  onCheckout: (b: TBooking) => void;
  onSelect: (b: TBooking) => void;
}) => {
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(booking)}
            >
              Payment History
            </Button>

            {/* Action */}
            <PaymentAction booking={booking} onCheckout={onCheckout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
