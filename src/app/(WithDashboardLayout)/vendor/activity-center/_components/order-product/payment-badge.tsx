'use client';

const PAYMENT_BADGE_CONFIG = {
  paid: {
    label: 'Paid',
    className: 'bg-green-100 text-green-700 border-green-300',
  },
  unpaid: {
    label: 'Unpaid',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  },
} as const;

const PaymentBadge = ({ isPaid }: { isPaid: boolean }) => {
  const config = isPaid
    ? PAYMENT_BADGE_CONFIG.paid
    : PAYMENT_BADGE_CONFIG.unpaid;
  return (
    <span
      className={`inline-flex items-center w-fit rounded-full border px-2 py-1 text-sm font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default PaymentBadge;
