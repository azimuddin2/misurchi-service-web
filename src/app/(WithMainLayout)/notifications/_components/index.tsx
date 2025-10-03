'use client';

import { Bell, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetAllNotificationsQuery } from '@/redux/features/notification/notificationApi';
import { format } from 'date-fns';
import Spinner from '@/components/shared/Spinner';

const Notifications = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 9;

  const { data, isLoading } = useGetAllNotificationsQuery({
    page,
    limit,
  });

  const notificationsData = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  console.log(notificationsData);

  // const notificationsData = [
  //     {
  //         id: 1,
  //         message:
  //             'Your cancellation request has been approved. Refund of $60.00 processed.',
  //         timestamp: 'Fri, 12:30pm',
  //         isActive: true,
  //     },
  //     {
  //         id: 2,
  //         message:
  //             '🎉 Special Offer: 20% off your next booking at Glow Salon! Book by May 30, 2025.',
  //         timestamp: 'Fri, 12:30pm',
  //         isActive: false,
  //     },
  //     {
  //         id: 3,
  //         message:
  //             '📅 Appointment Confirmed: Formal Updo at Glow Salon on May 6, 2025, 1:00 PM - 2:15 PM.',
  //         timestamp: 'Fri, 12:30pm',
  //         isActive: true,
  //     },
  //     {
  //         id: 4,
  //         message:
  //             'Your cancellation request has been approved. Refund of $60.00 processed.',
  //         timestamp: 'Fri, 12:30pm',
  //         isActive: false,
  //     },
  //     {
  //         id: 5,
  //         message:
  //             '🎉 Special Offer: 20% off your next booking at Glow Salon! Book by May 30, 2025.',
  //         timestamp: 'Fri, 12:30pm',
  //         isActive: true,
  //     },
  //     {
  //         id: 6,
  //         message:
  //             '📅 Appointment Confirmed: Formal Updo at Glow Salon on May 6, 2025, 1:00 PM - 2:15 PM.',
  //         timestamp: 'Fri, 12:30pm',
  //         isActive: false,
  //     },
  // ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="font-sora p-3 md:p-6 lg:w-4/5 mx-auto my-6">
        {/* Header */}
        <div className="mb-8">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 bg-transparent"
            >
              <Filter className="w-4 h-4 mr-2 text-[#165940]" />
              <span className="text-[#165940]">Filter All</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              Mark as Delete
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 bg-gray-50 h-screen p-8 rounded-lg">
          {notificationsData.map((notification) => (
            <Card
              key={notification._id}
              className={`p-4 shadow cursor-pointer transition 
      ${notification.read ? 'bg-gray-100' : 'bg-white'}`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg ${
                    notification.read
                      ? 'bg-gray-300 text-gray-600'
                      : 'bg-[#165940] text-white'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>

                {/* Message & Time */}
                <div className="flex-1">
                  <p
                    className={`text-sm leading-relaxed ${
                      notification.read
                        ? 'text-gray-500'
                        : 'text-gray-900 font-medium'
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {format(
                      new Date(notification.createdAt),
                      'dd MMM, yyyy hh:mm a',
                    )}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
