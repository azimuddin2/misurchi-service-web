'use client';

import Spinner from '@/components/shared/Spinner';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import {
  useGetSupportByEmailQuery,
  useMarkHelpfulMutation,
} from '@/redux/features/support/supportApi';
import { useAppSelector } from '@/redux/hooks';
import { TSupport } from '@/types/support.type';
import { format, parseISO } from 'date-fns';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const statusColor: Record<string, string> = {
  Pending: 'text-yellow-500',
  Reviewed: 'text-blue-500',
  'In Progress': 'text-orange-500',
  Resolved: 'text-green-600',
};

const FeedbackHistory = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.vendorEmail as string;
  const currentEmail = user?.email as string;

  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );
  const initialDateParam = searchParams.get('createdAt');
  const initialDate = initialDateParam ? parseISO(initialDateParam) : undefined;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate,
  );

  // ── URL params → query ────────────────────────────────────────
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 6;
  const searchTerm = searchParams.get('searchTerm') || '';
  const createdAt = searchParams.get('createdAt') || '';

  // ── API call ────────────────────────────────────────────────
  const { data, isLoading, refetch } = useGetSupportByEmailQuery(
    {
      email: email || currentEmail,
      page,
      limit,
      query: { searchTerm, createdAt },
    },
    {
      skip: !email && !currentEmail,
    },
  );

  const [markHelpful] = useMarkHelpfulMutation();

  const tickets: TSupport[] = data?.data ?? [];
  const meta = data?.meta || { totalPage: 1 };

  // ── URL updater (same as CustomerSupport) ─────────────────────
  const updateSearchParams = useCallback(
    (newParams: Record<string, string | null | undefined>) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (!value) {
          currentParams.delete(key);
        } else {
          currentParams.set(key, value);
        }
      });
      router.push(`?${currentParams.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = () => {
    updateSearchParams({ searchTerm: search, page: '1' });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    updateSearchParams({
      createdAt: date ? format(date, 'yyyy-MM-dd') : null,
      page: '1',
    });
  };

  // ── sync local state when URL changes ────────────────────────
  useEffect(() => {
    setSearch(searchParams.get('searchTerm') || '');
    const dateParam = searchParams.get('createdAt');
    setSelectedDate(dateParam ? parseISO(dateParam) : undefined);
  }, [searchParams]);

  // ── helpful toggle ────────────────────────────────────────────
  const handleHelpful = async (id: string, value: boolean) => {
    const toastId = toast.loading('Updating...');
    try {
      const res = await markHelpful({ id, isHelpful: value }).unwrap();
      toast.success(res.message || 'Helpfulness updated');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Helpfulness update failed');
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className=" lg:p-5 min-h-fit">
        {/* Search + Date Filter — same structure as CustomerSupport */}
        <div className="flex flex-col lg:justify-between lg:flex-row gap-4 lg:mt-0 mt-5 mb-5">
          <div className="relative w-full lg:w-3/5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here...."
              className="border px-4 py-3 pr-12 rounded w-full text-sm text-gray-600 outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute top-1/2 right-0 -translate-y-1/2 px-2.5 py-2.5 bg-[#165940] text-white rounded cursor-pointer"
            >
              <Search />
            </button>
          </div>

          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
            onChange={(e) =>
              handleDateSelect(
                e.target.value ? new Date(e.target.value) : undefined,
              )
            }
            className="px-4 py-2 border rounded lg:w-2/5"
          />
        </div>

        {/* Tickets */}
        {tickets.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            <Image
              src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              alt="No results"
              width={100}
              height={100}
              className="mx-auto w-32 mt-10"
            />
            <span className="font-medium mt-2 text-gray-600 text-base capitalize">
              No feedback found.
            </span>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="py-4">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Feedback #{ticket._id?.slice(-3).padStart(3, '0')} |{' '}
                  {new Date(ticket.createdAt!).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Feedback: {ticket.message}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Response:{' '}
                  {ticket.messageReply ? (
                    ticket.messageReply
                  ) : (
                    <span className="text-gray-400">No Response Yet.</span>
                  )}
                </p>
                <p
                  className={`text-sm font-semibold mb-2 ${statusColor[ticket.status] ?? 'text-gray-500'}`}
                >
                  Status: {ticket.status}
                </p>
                <p className="text-sm text-yellow-500 mb-1">
                  Was this response helpful?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHelpful(ticket._id!, true)}
                    disabled={ticket.status === 'Pending'}
                    className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition cursor-pointer ${ticket.status === 'Pending'
                        ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
                        : ticket.isHelpful === true
                          ? 'border-green-500 text-green-600 bg-green-50'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    👍 Yes
                  </button>
                  <button
                    onClick={() => handleHelpful(ticket._id!, false)}
                    disabled={ticket.status === 'Pending'}
                    className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition cursor-pointer ${ticket.status === 'Pending'
                        ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
                        : ticket.isHelpful === false
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
      {tickets.length > 0 && <MSWPagination totalPage={meta?.totalPage} />}
    </div>
  );
};

export default FeedbackHistory;
