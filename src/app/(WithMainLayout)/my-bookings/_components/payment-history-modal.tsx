'use client';

import { TBooking } from '@/types/booking.type';
import { X, CreditCard, CheckCircle, Clock } from 'lucide-react';

const PaymentHistoryModal = ({
  booking,
  onClose,
}: {
  booking: TBooking;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      {/* Modal Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between p-5 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-medium">Payment History</h2>
            <p className="text-sm text-gray-500">
              Service Name: {booking.serviceName}
            </p>
            <p className="text-sm text-gray-500">
              Booking ID: {booking.serviceId}
            </p>
          </div>

          <button
            title="close"
            onClick={onClose}
            className="p-2 rounded-full bg-red-200 hover:bg-red-300 transition w-8 h-8 flex items-center justify-center text-red-600 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border">
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-lg font-bold">${booking.price}</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border">
              <p className="text-xs text-gray-500">Paid</p>
              <p className="text-lg font-bold text-green-600">
                ${booking.paidAmount || 0}
              </p>
            </div>
          </div>

          {/* Remaining */}
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 flex justify-between items-center">
            <span className="text-sm text-orange-600 font-medium">
              Remaining Amount
            </span>
            <span className="font-bold text-orange-700">
              ${booking.remainingAmount || 0}
            </span>
          </div>

          {/* Transactions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-semibold">Transaction Timeline</p>
            </div>

            {booking.trnIds?.length ? (
              <div className="space-y-3 border-l pl-4">
                {booking.trnIds.map((trx, i) => {
                  const isLatest = trx === booking.trnId;

                  return (
                    <div key={i} className="relative">
                      {/* dot */}
                      <div className="absolute -left-6 top-2 w-3 h-3 rounded-full bg-gray-300"></div>

                      <div className="flex items-center justify-between p-3 rounded-xl border bg-white hover:shadow-sm transition">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400">
                            Transaction ID
                          </span>
                          <span className="text-sm font-mono text-gray-700">
                            {trx}
                          </span>
                        </div>

                        {isLatest ? (
                          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Latest
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                            <Clock className="w-3 h-3" />
                            Old
                          </span>
                        )}
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
