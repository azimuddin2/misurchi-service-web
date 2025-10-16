'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SuccessAnimation = () => {
  const [showTick, setShowTick] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTick(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-b from-white to-green-50">
      {/* Subtle Pulse Glow */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        className="relative flex items-center justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-70"
        />

        <div className="w-24 h-24 rounded-full bg-white border-4 border-green-500 flex items-center justify-center shadow-2xl">
          <AnimatePresence>
            {showTick && (
              <motion.svg
                initial={{ scale: 0.2, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 250, damping: 16 }}
                className="w-12 h-12 text-green-600"
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
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Smart, Personal Message */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="mt-10"
      >
        <h2 className="text-3xl font-semibold text-green-700">
          You’re All Set 🎉
        </h2>
        <p className="text-gray-700 mt-3 text-base max-w-sm mx-auto leading-relaxed">
          Your payment was processed successfully. Thanks for trusting us —
          we’ll take care of the rest.
        </p>
        <p className="text-gray-500 text-sm mt-2 italic">
          Confirmation details have been sent to your email.
        </p>
      </motion.div>

      {/* Modern Continue Button */}
      <Link href={'/'}>
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-3 bg-green-600 text-white rounded-full font-medium shadow-md hover:shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
        >
          Continue
        </motion.button>
      </Link>

      {/* Gentle Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="mt-8 text-xs text-gray-400"
      >
        © {new Date().getFullYear()} Your Company — Secure & Seamless Payments
      </motion.p>
    </div>
  );
};

export default SuccessAnimation;
