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
