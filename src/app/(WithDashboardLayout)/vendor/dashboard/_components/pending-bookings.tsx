'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';
import { TPendingBooking } from '@/types/dashboard.type';

type TPendingBookingProps = {
  pendingBookings: TPendingBooking[];
};

const PendingBookings = ({ pendingBookings }: TPendingBookingProps) => {
  return (
    <Card className="w-full mt-5">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Pending Bookings
        </CardTitle>
        <Link
          href="/vendor/activity-center"
          className="text-[#1E90FF] text-sm hover:underline"
        >
          View All
        </Link>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3">
        {pendingBookings.length > 0 ? (
          pendingBookings.map((booking) => (
            <div
              key={booking._id}
              className="flex items-start justify-between bg-[#f9fefc] p-4 border-l-4 border-[#def7eb] rounded-lg hover:bg-[#f1fdf6] transition"
            >
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {`Booking by ${booking.name} for ${booking.serviceName}`}
                </p>

                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {booking.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              {/* <div className="bg-[#def7eb] text-sm py-2 px-4 rounded-sm text-[#1E90FF] capitalize">
                {booking.status}
              </div> */}
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4 h-[200px]">
            <Image
              src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              alt="No results"
              width={100}
              height={100}
              className="mx-auto"
            />
            <p>No appointments scheduled for today.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingBookings;
