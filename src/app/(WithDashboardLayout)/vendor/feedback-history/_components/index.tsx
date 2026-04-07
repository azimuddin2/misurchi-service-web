'use client';

import Spinner from '@/components/shared/Spinner';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import {
  useGetSupportByEmailQuery,
  useMarkHelpfulMutation,
} from '@/redux/features/support/supportApi';
import { useAppSelector } from '@/redux/hooks';
import { TSupport } from '@/types/support.type';
import { useState } from 'react';

const statusColor: Record<string, string> = {
  Pending: 'text-yellow-500',
  Reviewed: 'text-blue-500',
  'In Progress': 'text-orange-500',
  Resolved: 'text-green-600',
};

const FeedbackHistory = () => {
  const [search, setSearch] = useState('');
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  const { data, isLoading } = useGetSupportByEmailQuery({ email });
  const [markHelpful] = useMarkHelpfulMutation();

  const tickets: TSupport[] = data?.data ?? [];

  const filtered = tickets.filter(
    (t) =>
      t.message.toLowerCase().includes(search.toLowerCase()) ||
      (t.messageReply ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const handleHelpful = async (id: string, value: boolean) => {
    await markHelpful({ id, isHelpful: value });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-5">
      {/* Search */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 mb-4 bg-white">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search here...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-600"
        />
      </div>

      {/* Tickets */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          No feedback found.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filtered.map((ticket) => (
            <div key={ticket._id} className="py-4">
              {/* Header */}
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Feedback #{ticket._id?.slice(-3).padStart(3, '0')} |{' '}
                {new Date(ticket.createdAt!).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>

              {/* Message */}
              <p className="text-sm text-gray-600 mb-1">
                Feedback: {ticket.message}
              </p>

              {/* Reply */}
              <p className="text-sm text-gray-600 mb-1">
                Response:{' '}
                {ticket.messageReply ? (
                  ticket.messageReply
                ) : (
                  <span className="text-gray-400">No Response Yet.</span>
                )}
              </p>

              {/* Status */}
              <p
                className={`text-sm font-semibold mb-2 ${statusColor[ticket.status] ?? 'text-gray-500'}`}
              >
                Status: {ticket.status}
              </p>

              {/* Helpful */}
              <p className="text-sm text-yellow-500 mb-1">
                Was this response helpful?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleHelpful(ticket._id!, true)}
                  className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition cursor-pointer ${
                    ticket.isHelpful === true
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  👍 Yes
                </button>
                <button
                  onClick={() => handleHelpful(ticket._id!, false)}
                  className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition cursor-pointer ${
                    ticket.isHelpful === false
                      ? 'border-red-400 text-red-500 bg-red-50'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  👎 No
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackHistory;
