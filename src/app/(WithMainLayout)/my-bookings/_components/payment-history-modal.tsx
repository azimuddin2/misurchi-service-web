'use client';

import { TBooking } from '@/types/booking.type';
import { X, CreditCard } from 'lucide-react';

const PaymentHistoryModal = ({
  booking,
  onClose,
}: {
  booking: TBooking;
  onClose: () => void;
}) => {
  const remaining = Math.max(0, booking.remainingAmount || 0);
  const paid = booking.paidAmount || 0;
  const total = booking.price || 0;
  const progressPercent = total > 0 ? Math.round((paid / total) * 100) : 0;

  const trnIds: string[] = booking.trnIds ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-medium">Payment History</h2>
            <p className="text-sm text-gray-500">{booking.serviceName}</p>
            <p className="text-xs text-gray-400 font-mono">
              Booking ID: {booking._id}
            </p>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="p-2 rounded-full bg-red-200 hover:bg-red-300 transition w-8 h-8 flex items-center justify-center text-red-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-gray-50 border">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-base font-semibold text-gray-800">
                ${total.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 border border-green-100">
              <p className="text-xs text-green-700 mb-1">Paid</p>
              <p className="text-base font-semibold text-green-600">
                ${paid.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
              <p className="text-xs text-orange-700 mb-1">Due</p>
              <p className="text-base font-semibold text-orange-600">
                ${remaining.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 rounded-xl p-3 border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Payment progress</span>
              <span className="text-xs font-semibold text-gray-700">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Transactions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-semibold text-gray-700">
                Transactions
              </p>
            </div>

            {trnIds.length ? (
              <div className="flex flex-col">
                {[...trnIds].reverse().map((trx, i) => {
                  const isLatest = trx === booking.trnId;
                  const paymentNumber = trnIds.length - i;
                  const isLast = i === trnIds.length - 1;

                  return (
                    <div key={trx} className="flex gap-3">
                      {/* Timeline dot & line */}
                      <div className="flex flex-col items-center pt-1">
                        <div
                          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            isLatest ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        {!isLast && (
                          <div className="w-px flex-1 bg-gray-200 my-1" />
                        )}
                      </div>

                      {/* Card */}
                      <div className={`flex-1 pb-3`}>
                        <div
                          className={`flex items-start justify-between p-3 rounded-xl border ${
                            isLatest
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-100'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs font-medium ${
                                  isLatest ? 'text-green-800' : 'text-gray-700'
                                }`}
                              >
                                Payment {paymentNumber}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full border ${
                                  isLatest
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : 'bg-gray-100 text-gray-500 border-gray-200'
                                }`}
                              >
                                {isLatest ? 'Latest' : 'Previous'}
                              </span>
                            </div>
                            <p
                              className={`text-xs font-mono mt-1 ${
                                isLatest ? 'text-green-600' : 'text-gray-400'
                              }`}
                            >
                              TXN ID: {trx}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;
