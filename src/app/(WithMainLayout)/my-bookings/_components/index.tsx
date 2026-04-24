'use client';

import Spinner from '@/components/shared/Spinner';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetBookingsByEmailQuery } from '@/redux/features/booking/bookingApi';
import { useAppSelector } from '@/redux/hooks';
import { TBooking } from '@/types/booking.type';
import { useCreateCheckoutSessionMutation } from '@/redux/features/payment/paymentApi';
import { toast } from 'sonner';
import EmptyState from './empty-state';
import BookingCard from './booking-card';
import { useState } from 'react';
import PaymentHistoryModal from './payment-history-modal';

const MyBookings = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  const [selectedBooking, setSelectedBooking] = useState<TBooking | null>(null);

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
      const errorMessage = error?.data?.message || '';
      if (
        errorMessage.includes('transfers') ||
        errorMessage.includes('capabilities') ||
        errorMessage.includes('destination')
      ) {
        toast.warning(
          'This vendor has not completed their payment setup yet. Please try again later or contact support.',
        );
      } else {
        toast.error('Something went wrong. Please try again.');
      }
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
                onSelect={setSelectedBooking}
              />
            ))}
          </div>
        )}
      </div>
      {selectedBooking && (
        <PaymentHistoryModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default MyBookings;
