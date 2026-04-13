'use client';

import { Bell, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import {
  useDeleteNotificationsMutation,
  useGetAllNotificationsQuery,
} from '@/redux/features/notification/notificationApi';
import { formatDistanceToNow } from 'date-fns';
import Spinner from '@/components/shared/Spinner';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { toast } from 'sonner';

const Notifications = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;

  const user = useAppSelector(selectCurrentUser);
  const userId = user?.userId as string;

  const { data: vendorData } = useGetVendorProfileQuery(user?.email || '');
  const vendorId = vendorData?.data?._id as string;
  const receiver = user?.role === 'vendor' ? vendorId : userId;

  const { data, isLoading } = useGetAllNotificationsQuery(
    { page, limit, receiver },
    { pollingInterval: 1000 },
  );

  const notificationsData = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };
  const unreadCount = notificationsData.filter((n) => !n.read).length;

  const [deleteNotification] = useDeleteNotificationsMutation();

  const handleDeleteAllNotifications = async () => {
    try {
      const confirmed = window.confirm(
        'Are you sure you want to delete all notifications?',
      );
      if (!confirmed) return;
      const res = await deleteNotification().unwrap();
      if (res?.success)
        toast.success('All notifications deleted successfully!');
      else toast.error('Failed to delete notifications.');
    } catch {
      toast.error('Something went wrong while deleting notifications.');
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="font-sora min-h-screen bg-[#f7f8f5] px-4 py-10 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-[#165940] font-medium mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {notificationsData.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleDeleteAllNotifications}
                className="flex items-center gap-2 
               rounded-xl px-3 py-2 text-sm font-medium
               text-red-500 hover:text-red-600 hover:bg-red-100 bg-red-50
               transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Delete All</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div>
          {notificationsData.length > 0 ? (
            <div className="flex flex-col gap-2">
              {notificationsData.map((notification, index) => (
                <div
                  key={notification._id}
                  onClick={() =>
                    router.push(`/notifications/${notification._id}`)
                  }
                  className={`
                group relative flex items-start gap-4 px-5 py-4 rounded-2xl cursor-pointer
                transition-all duration-200
                ${
                  notification.read
                    ? 'bg-white border border-gray-100 hover:border-gray-200'
                    : 'bg-white border border-[#165940]/20 hover:border-[#165940]/40 shadow-sm shadow-[#165940]/5'
                }
              `}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* unread dot */}
                  {!notification.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#165940]" />
                  )}

                  {/* icon */}
                  <div
                    className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      notification.read
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-[#165940]/10 text-[#165940]'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>

                  {/* content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <p
                      className={`text-sm leading-relaxed line-clamp-2 ${
                        notification.read
                          ? 'text-gray-400 font-normal'
                          : 'text-gray-800 font-medium'
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center">
                <Bell size={30} className="text-gray-400" />
              </div>
              <p className="text-gray-400 text-base capitalize font-medium">
                No notifications yet
              </p>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {notificationsData.length > 0 && (
          <div className="mt-8 mb-0">
            <MSWPagination totalPage={meta?.totalPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
