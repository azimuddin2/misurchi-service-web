'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { TBooking } from '@/types/booking.type';
import { useGetBookingAppointmentsQuery } from '@/redux/features/booking/bookingApi';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Spinner from '@/components/shared/Spinner';
import { Edit3, User2, UserPlus } from 'lucide-react';
import Image from 'next/image';
import EditAssignModal from './edit-assign-modal';
import AddAssignModal from './add-assign-modal';

const SharedCalendar = () => {
  const user = useAppSelector(selectCurrentUser);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // ✅ Separate states
  const [isAddAssignModalOpen, setAddAssignModalOpen] = useState(false);
  const [isEditAssignModalOpen, setEditAssignModalOpen] = useState(false);

  const [bookingData, setBookingData] = useState<TBooking | null>(null);

  // Format date as 'YYYY-MM-DD' for backend
  const formattedDate = selectedDate?.toLocaleDateString('en-CA') || '';

  const vendorId = user?.vendorId as string;

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
      <div className="bg-white shadow rounded-xl p-4 lg:p-6 border">
        <h2 className="text-xl font-medium mb-4">Select a Date</h2>
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
              rounded-lg p-0 font-medium text-base
              flex items-center justify-center 
              transition-all duration-200
              hover:bg-gray-100
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

      {/* Bookings List */}
      <div className="bg-white">
        <h2 className="text-xl font-medium mb-6">
          Bookings for {formattedDate || 'Selected Date'}
        </h2>

        {isLoading && (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        )}

        {isError && (
          <p className="text-red-500 text-center py-6">
            ❌ Failed to load bookings.
          </p>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <div>
            <Image
              src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              alt="No results"
              width={100}
              height={100}
              className="mx-auto"
            />
            <p className="text-gray-500 text-center py-6">
              No bookings found for this date.
            </p>
          </div>
        )}

        {!isLoading && !isError && bookings.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking: TBooking) => (
              <li
                key={booking._id}
                className="border rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-150"
              >
                {/* Booking Details */}
                <div className="mb-4">
                  <p className="font-semibold text-base">
                    {booking.serviceName}
                  </p>
                  <p className="text-gray-700 text-sm flex items-center gap-1">
                    <User2 size={16} /> {booking.name}
                  </p>
                  <p className="text-gray-500 text-sm">{booking.email}</p>
                  <p className="text-gray-500 text-sm">{booking.phone}</p>
                </div>

                {/* Date + Status */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>🕒 {booking.time}</p>
                    <p>📆 {booking.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-medium tracking-wide ${
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

                {/* Assign Section */}
                <div className="flex justify-between items-center text-sm mt-auto border-t pt-3">
                  <div>
                    {booking?.assignedTo ? (
                      <p>Assigned To: {booking.assignedTo}</p>
                    ) : (
                      <p>Unassigned</p>
                    )}
                  </div>

                  {booking.assignedTo ? (
                    // If already assigned → show Edit button
                    <button
                      className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors bg-green-100 rounded p-2 cursor-pointer"
                      onClick={() => {
                        setBookingData(booking); // save selected row data
                        setEditAssignModalOpen(true); // open update modal
                      }}
                    >
                      <Edit3 size={18} />
                      <span className="text-sm">Edit</span>
                    </button>
                  ) : (
                    // If not assigned → show Assign button
                    <button
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors bg-blue-100 rounded p-2 cursor-pointer"
                      onClick={() => {
                        setBookingData(booking); // save selected row data
                        setAddAssignModalOpen(true); // open update modal
                      }}
                    >
                      <UserPlus size={18} />
                      <span className="text-sm">Assign</span>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Assign Modal  */}
      <EditAssignModal
        isOpen={isEditAssignModalOpen}
        onOpenChange={setEditAssignModalOpen}
        refetch={refetch}
        bookingData={bookingData}
      />

      {/* Add Assign Modal  */}
      <AddAssignModal
        isOpen={isAddAssignModalOpen}
        onOpenChange={setAddAssignModalOpen}
        refetch={refetch}
        bookingData={bookingData}
      />
    </div>
  );
};

export default SharedCalendar;
