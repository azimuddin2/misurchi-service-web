'use client';

import { Button } from '@/components/ui/button';
import { TBooking } from '@/types/booking.type';
import { BadgeCheck, CreditCard, MapPin } from 'lucide-react';

const PaymentAction = ({
  booking,
  onCheckout,
}: {
  booking: TBooking;
  onCheckout: (b: TBooking) => void;
}) => {
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
      className="text-gray-50 rounded border-gray-800 bg-gradient-to-t to-green-800 from-green-600/70 hover:bg-green-500/80 font-semibold cursor-pointer whitespace-nowrap cursro-pointer flex items-center gap-1"
    >
      <CreditCard size={12} className="mr-1" />
      <span> {paymentType === 'half' ? 'Pay 50%' : 'Pay Now'}</span>
    </Button>
  );
};

export default PaymentAction;
