'use client';

import { Package } from 'lucide-react';

const EmptyState = () => {
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
};

export default EmptyState;
