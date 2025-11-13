'use client';

import { Bell, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import {
  useDeleteNotificationsMutation,
  useGetAllNotificationsQuery,
} from '@/redux/features/notification/notificationApi';
import { format } from 'date-fns';
import Spinner from '@/components/shared/Spinner';
import Image from 'next/image';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { toast } from 'sonner';

const Notifications = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 9;

  const user = useAppSelector(selectCurrentUser);
  const userId = user?.userId as string;

  // Get vendor profile if the user is a vendor
  const { data: vendorData } = useGetVendorProfileQuery(user?.email || '');
  const vendorId = vendorData?.data?._id as string;

  // Determine receiverId dynamically
  const receiver = user?.role === 'vendor' ? vendorId : userId;

  // Fetch notifications
  const { data, isLoading } = useGetAllNotificationsQuery({
    page,
    limit,
    receiver,
  });

  const notificationsData = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const [deleteNotification] = useDeleteNotificationsMutation();

  const handleDeleteAllNotifications = async () => {
    try {
      const confirmed = window.confirm(
        'Are you sure you want to delete all notifications? This action cannot be undone.',
      );
      if (!confirmed) return;

      const res = await deleteNotification().unwrap();

      if (res?.success) {
        toast.success('All notifications deleted successfully!');
      } else {
        toast.error('Failed to delete notifications.');
      }
    } catch (error) {
      console.error('Delete notifications error:', error);
      toast.error('Something went wrong while deleting notifications.');
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="font-sora p-3 md:p-6 lg:w-4/5 mx-auto my-6">
      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <Button
          variant="outline"
          size="sm"
          className="text-gray-600 bg-transparent"
        >
          <Filter className="w-4 h-4 mr-2 text-[#165940]" />
          <span className="text-[#165940]">Filter All</span>
        </Button>
        <Button
          onClick={handleDeleteAllNotifications}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
        >
          Mark as Delete
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 bg-gray-50 h-screen p-8 rounded-lg overflow-y-auto">
        {notificationsData.length === 0 && (
          <div className="my-28">
            <Image
              src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              alt="No results"
              width={100}
              height={100}
              className="mx-auto"
            />
            <p className="text-gray-500 text-center">No notifications found.</p>
          </div>
        )}

        {notificationsData.map((notification) => (
          <Card
            onClick={() => router.push(`/notifications/${notification._id}`)}
            key={notification._id}
            className={`p-4 shadow cursor-pointer transition ${notification.read ? 'bg-gray-100' : 'bg-white'}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`p-2 rounded-lg ${notification.read ? 'bg-gray-300 text-gray-600' : 'bg-[#165940] text-white'}`}
              >
                <Bell className="w-5 h-5" />
              </div>

              {/* Message & Time */}
              <div className="flex-1">
                <p
                  className={`text-sm leading-relaxed ${notification.read ? 'text-gray-500' : 'text-gray-900 font-medium'}`}
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
      <MSWPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default Notifications;
