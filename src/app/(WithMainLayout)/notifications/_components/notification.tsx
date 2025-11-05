'use client';

import Spinner from '@/components/shared/Spinner';
import { useGetNotificationByIdQuery } from '@/redux/features/notification/notificationApi';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

type Props = {
  notificationId: string;
};

const Notification = ({ notificationId }: Props) => {
  const { data, isLoading } = useGetNotificationByIdQuery(notificationId);
  const notification = data?.data;

  if (isLoading) return <Spinner />;

  if (!notification) {
    return (
      <div className="text-center text-gray-500 py-10">
        Notification not found.
      </div>
    );
  }

  return (
    <div className="font-sora px-4 py-8 sm:px-6 lg:px-8 max-w-3xl mx-auto mt-6">
      <Card className="p-6 md:p-8 shadow-sm bg-white rounded-2xl border border-gray-100">
        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-full ${
                notification.read
                  ? 'bg-gray-200 text-gray-600'
                  : 'bg-[#165940] text-white'
              }`}
            >
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
              {notification.message}
            </h2>
          </div>

          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm rounded-full ${
              notification.read
                ? 'text-green-700 border-green-300 bg-green-50'
                : 'text-red-700 border-red-300 bg-red-50'
            }`}
          >
            {notification.read ? 'Read' : 'Unread'}
          </Badge>
        </div>

        {/* --- Description --- */}
        <div className="mt-5 text-gray-700 leading-relaxed text-sm sm:text-base">
          {notification.description || 'No additional details available.'}
        </div>

        {/* --- Info Grid --- */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <InfoRow
            label="Type"
            value={notification.model_type || 'General'}
            badge
          />
          <InfoRow label="Receiver ID" value={notification.receiver} />
          <InfoRow label="Reference ID" value={notification.reference || '—'} />
          <InfoRow
            label="Created"
            value={format(
              new Date(notification.createdAt),
              'dd MMM, yyyy hh:mm a',
            )}
          />
        </div>
      </Card>
    </div>
  );
};

// ✅ Reusable Info Row Component
const InfoRow = ({
  label,
  value,
  badge = false,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) => (
  <div>
    <span className="block text-gray-500 text-xs font-medium uppercase tracking-wide">
      {label}
    </span>
    {badge ? (
      <Badge
        variant="secondary"
        className="mt-1 capitalize bg-gray-100 text-gray-700 px-2 py-0.5"
      >
        {value}
      </Badge>
    ) : (
      <p className="mt-1 text-gray-800 font-medium break-words">{value}</p>
    )}
  </div>
);

export default Notification;
