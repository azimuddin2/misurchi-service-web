'use client';

import { useEffect, useState } from 'react';

const SuccessAnimation = () => {
  const [showTick, setShowTick] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTick(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center animate-pulse">
        {showTick && (
          <svg
            className="w-12 h-12 text-green-600 animate-scaleIn"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      <p className="mt-4 text-lg font-semibold text-green-700 animate-fadeIn">
        Payment Successful!
      </p>
    </div>
  );
};

export default SuccessAnimation;
