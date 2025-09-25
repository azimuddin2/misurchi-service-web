'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { TBooking } from '@/types/booking.type';
import { useGetBookingAppointmentsQuery } from '@/redux/features/booking/bookingApi';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Spinner from '@/components/shared/Spinner';

const SharedCalendar = () => {
  const user = useAppSelector(selectCurrentUser);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Format date as 'YYYY-MM-DD' for backend
  const formattedDate = selectedDate?.toLocaleDateString('en-CA') || '';

  const { data: vendorData } = useGetVendorProfileQuery(user?.email as string);
  const vendorId = vendorData?.data?._id as string;

  // Fetch bookings for selected date
  const { data, isLoading, isError, refetch } = useGetBookingAppointmentsQuery({
    vendorId,
    query: { date: formattedDate },
  });

  // Safe bookings array
  const bookings: TBooking[] = data?.data ?? [];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Calendar Card */}
      <div className="bg-white shadow rounded-lg p-4 lg:p-6">
        <h2 className="text-lg font-medium mb-4">Select a Date</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            refetch();
          }}
          initialFocus
          showOutsideDays
          className="w-full"
          classNames={{
            months:
              'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
            month: 'space-y-4 w-full h-full flex flex-col',
            table: 'w-full h-full border-collapse space-y-1',
            head_row: 'flex w-full',
            row: 'flex w-full mt-2 h-14 text-xl',
            day: `
              flex-1 h-9 lg:h-12 
              rounded p-0 font-normal text-2xl 
              flex items-center justify-center 
              transition-all duration-200
            `,
            caption:
              'relative w-full px-3 py-2 flex items-center justify-center',
            caption_label: 'text-base font-semibold',
            nav: 'absolute top-2 right-2 flex items-center gap-2',
            nav_button: `
              h-9 w-9 rounded-md flex items-center justify-center
              bg-gray-100 hover:bg-gray-200 
              transition-colors duration-150
            `,
          }}
        />
      </div>

      {/* Bookings List Card */}
      <div className="">
        <h2 className="text-xl font-medium mb-4">
          Bookings for {formattedDate || 'Selected Date'}
        </h2>

        {isLoading && (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        )}

        {isError && (
          <p className="text-red-500 text-center py-6">
            Failed to load bookings.
          </p>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <p className="text-gray-500 text-center py-6">
            No bookings for this date.
          </p>
        )}

        {!isLoading && !isError && bookings.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking: TBooking) => (
              <li
                key={booking._id}
                className="border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-150"
              >
                <div className="mb-3">
                  <p className="font-semibold text-lg">{booking.serviceName}</p>
                  <p className="text-gray-600 text-sm">{booking.name}</p>
                  <p className="text-gray-500 text-sm">{booking.email}</p>
                  <p className="text-gray-500 text-sm">{booking.phone}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-gray-600 text-sm">
                    <p>Time: {booking.time}</p>
                    <p>Date: {booking.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                      booking.status === 'pending'
                        ? 'bg-yellow-500'
                        : booking.status === 'confirmed'
                          ? 'bg-green-500'
                          : booking.status === 'cancelled'
                            ? 'bg-red-500'
                            : booking.status === 'ongoing'
                              ? 'bg-blue-500'
                              : 'bg-gray-500'
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SharedCalendar;
