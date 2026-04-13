'use client';

import Spinner from '@/components/shared/Spinner';
import { useGetNotificationByIdQuery } from '@/redux/features/notification/notificationApi';
import { format } from 'date-fns';
import { Bell, CheckCircle2, Clock, Hash, User, Layers } from 'lucide-react';

type Props = {
  notificationId: string;
};

const Notification = ({ notificationId }: Props) => {
  const { data, isLoading } = useGetNotificationByIdQuery(notificationId);
  const notification = data?.data;

  if (isLoading) return <Spinner />;

  if (!notification) {
    return (
      <div className="font-sora flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Bell className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm text-gray-400 font-medium">
          Notification not found.
        </p>
      </div>
    );
  }

  const isRead = notification.read;

  const receiverId =
    typeof notification.receiver === 'object'
      ? notification.receiver
      : notification.receiver;

  const referenceId =
    typeof notification.reference === 'object'
      ? notification.reference
      : notification.reference;

  return (
    <div className="font-sora min-h-screen bg-[#f7f8f5] px-4 py-10 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* ── breadcrumb label ── */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#165940]">
            Notification detail
          </span>
          <span className="flex-1 h-px bg-[#165940]/20" />
        </div>

        {/* ── card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* top accent bar */}
          <div
            className={`h-1 w-full ${isRead ? 'bg-gray-200' : 'bg-[#165940]'}`}
          />

          <div className="p-6 sm:p-8">
            {/* ── icon + status ── */}
            <div className="flex items-center justify-between mb-6">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  isRead
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-[#165940]/10 text-[#165940]'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>

              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                  isRead
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-500'
                }`}
              >
                {isRead ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
                {isRead ? 'Read' : 'Unread'}
              </span>
            </div>

            {/* ── message ── */}
            <h1 className="text-xl sm:text-2xl font-medium text-gray-900 leading-snug mb-4">
              {notification.message}
            </h1>

            {/* ── description ── */}
            <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-[#165940]/25 pl-4">
              {notification.description || 'No additional details available.'}
            </p>

            {/* ── divider ── */}
            <div className="my-6 border-t border-dashed border-gray-100" />

            {/* ── meta grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MetaItem
                icon={<Layers className="w-4 h-4" />}
                label="Type"
                value={notification.model_type || 'General'}
                highlight
              />
              <MetaItem
                icon={<Clock className="w-4 h-4" />}
                label="Created"
                value={format(
                  new Date(notification.createdAt),
                  'dd MMM yyyy, hh:mm a',
                )}
              />
              <MetaItem
                icon={<User className="w-4 h-4" />}
                label="Receiver"
                value={receiverId || '—'}
                mono
              />
              <MetaItem
                icon={<Hash className="w-4 h-4" />}
                label="Reference"
                value={referenceId || '—'}
                mono
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── reusable meta item ────────────────────────────────────────────────────────

const MetaItem = ({
  icon,
  label,
  value,
  highlight = false,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) => (
  <div className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3.5">
    <span className="mt-0.5 text-[#165940]/50 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </p>
      {highlight ? (
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#165940]/10 text-[#165940] capitalize">
          {value}
        </span>
      ) : (
        <p
          className={`text-sm font-medium text-gray-800 break-all leading-snug ${mono ? 'font-mono text-xs text-gray-500' : ''}`}
        >
          {value}
        </p>
      )}
    </div>
  </div>
);

export default Notification;
