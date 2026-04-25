'use client';

import Spinner from '@/components/shared/Spinner';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { TBooking } from '@/types/booking.type';
import Image from 'next/image';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { format, parseISO } from 'date-fns';
import {
  CheckCircle,
  ChevronDown,
  FolderSymlink,
  Search,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useGetAllBookingsByUserQuery,
  useUpdateBookingRequestApprovalMutation,
  useUpdateBookingStatusMutation,
} from '@/redux/features/booking/bookingApi';
import { Input } from '@/components/ui/input';
import MSWPagination from '@/components/ui/core/MSWPagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ✅ Booking status options
const statusOptions = [
  { label: 'Pending', key: 'pending' },
  { label: 'Confirmed', key: 'confirmed' },
  { label: 'Ongoing', key: 'ongoing' },
  { label: 'Completed', key: 'completed' },
  { label: 'Cancelled', key: 'cancelled' },
];

type PaymentBadgeProps = {
  isPaid: boolean;
  paidAmount?: number;
  totalAmount: number;
};

export const PaymentBadge = ({
  isPaid,
  paidAmount,
  totalAmount,
}: PaymentBadgeProps) => {
  const percentage =
    paidAmount !== undefined
      ? Math.min(100, Math.max(0, Math.round((paidAmount / totalAmount) * 100)))
      : 0;

  // ✅ Fully Paid
  if (isPaid) {
    return (
      <span className="text-xs px-2 py-1 rounded-full w-fit bg-green-100 text-green-700 border border-green-300">
        Paid (100%)
      </span>
    );
  }

  // ✅ Partial Payment
  if (paidAmount !== undefined && paidAmount > 0) {
    return (
      <span className="text-xs px-2 py-1 rounded-full w-fit bg-yellow-100 text-yellow-700 border border-yellow-300">
        {percentage}% Paid
      </span>
    );
  }

  // ❌ Unpaid
  return (
    <span className="text-xs px-2 py-1 rounded-full bg-red-100 w-fit text-red-600 border border-red-300">
      Unpaid
    </span>
  );
};

const ManageBookingServices = () => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );
  const initialDateParam = searchParams.get('createdAt');
  const initialDate = initialDateParam ? parseISO(initialDateParam) : undefined;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate,
  );

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;
  const searchTerm = searchParams.get('searchTerm') || '';
  const createdAt = searchParams.get('createdAt') || '';

  const vendorId = user?.vendorId as string;

  const { data, isLoading, refetch } = useGetAllBookingsByUserQuery({
    vendorId,
    page,
    limit,
    query: { searchTerm, createdAt },
  });

  const bookings = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

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

  useEffect(() => {
    setSearch(searchParams.get('searchTerm') || '');
    const dateParam = searchParams.get('createdAt');
    if (dateParam) {
      setSelectedDate(parseISO(dateParam));
    } else {
      setSelectedDate(undefined);
    }
  }, [searchParams]);

  const [updateBookingRequestApproval] =
    useUpdateBookingRequestApprovalMutation();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  // ✅ New status update handler
  const handleStatusUpdate = async (bookingId: string, status: string) => {
    const toastId = toast.loading('Updating status...');
    try {
      const res = await updateBookingStatus({
        id: bookingId,
        status: { status },
      }).unwrap();
      toast.success(res.message || 'Status updated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Status update failed');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleVendorApproval = async (bookingId: string, approved: boolean) => {
    const toastId = toast.loading('Updating status...');
    try {
      const res = await updateBookingRequestApproval({
        id: bookingId,
        vendorApproved: approved,
      }).unwrap();
      toast.success(res.message || 'Status updated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Status update failed');
    } finally {
      toast.dismiss(toastId);
    }
  };

  // ✅ Status color map — booking status
  const statusTextColorMap: Record<string, string> = {
    pending: 'text-yellow-600 border-yellow-600',
    confirmed: 'text-blue-600 border-blue-600',
    ongoing: 'text-orange-500 border-orange-500',
    completed: 'text-green-600 border-green-600',
    cancelled: 'text-red-600 border-red-600',
  };

  const columns: ColumnDef<TBooking>[] = [
    {
      accessorKey: 'service',
      header: 'Service',
      cell: ({ row }) => {
        const service = row.original.service;
        const imageUrl = service?.images?.[0]?.url || '/placeholder.png';
        return (
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <Image
              src={imageUrl}
              alt={service?.name || 'Service'}
              width={100}
              height={100}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm object-cover border"
            />

            <div className="min-w-0">
              <p className="truncate text-sm sm:text-base">
                {row.original.serviceName}
              </p>
              <p className="truncate text-xs text-gray-400">
                ID: {row.original.serviceId}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Buyer Info',
      cell: ({ row }) => (
        <div>
          <p className="text-base font-medium">{row.original.name}</p>
          <p className="text-sm text-gray-500">{row.original.email}</p>
          <p className="text-sm text-gray-500">{row.original.phone}</p>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date & Time',
      cell: ({ row }) => (
        <div>
          <p>{format(new Date(row.original.date), 'dd MMM, yyyy')}</p>
          <p className="truncate text-sm text-gray-500">{row.original.time}</p>
          <p className="truncate text-gray-500 text-sm">
            Duration - {row.original.duration}s
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'payment',
      header: 'Payment',
      cell: ({ row }) => {
        const {
          paymentType,
          isPaid,
          paidAmount,
          remainingAmount = 0, // ✅ default value fixes TS error
          price,
          trnId,
        } = row.original;

        return (
          <div className="flex flex-col gap-1 text-sm min-w-[140px]">
            {/* Payment Type */}
            <span className="capitalize">{paymentType} payment</span>

            {/* Badge */}
            <PaymentBadge
              isPaid={isPaid}
              paidAmount={paidAmount}
              totalAmount={price}
            />

            {/* Paid Amount */}
            {paidAmount !== undefined && (
              <span className="text-xs text-gray-500">Paid: ${paidAmount}</span>
            )}

            {/* Remaining Amount */}
            {remainingAmount > 0 ? (
              <span className="text-xs text-red-500">
                Due: ${remainingAmount}
              </span>
            ) : (
              <span className="text-xs text-green-600">No due</span>
            )}

            {/* Transaction ID */}
            {trnId && (
              <span className="text-xs text-gray-400 break-all">
                TXN: {trnId}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-600">
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },

    // ✅ Booking Status column
    {
      accessorKey: 'status',
      header: 'Booking Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusColor = statusTextColorMap[status] || 'text-gray-700';

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-2 capitalize px-3 py-1 border rounded-sm bg-white ${statusColor}`}
            >
              {status}
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.key}
                  disabled={option.key === status}
                  onClick={() =>
                    option.key !== status &&
                    handleStatusUpdate(row.original._id, option.key)
                  }
                  className={`capitalize px-3 py-2 ${
                    option.key === status
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },

    {
      accessorKey: 'request',
      header: 'Request Action',
      cell: ({ row }) => {
        const request = row.original.request || {};
        const vendorApproved = request.vendorApproved;
        const requestType = request.type ?? 'none';

        const isVendor = user?.role === 'vendor';
        const isBuyer = user?.role === 'user';

        return (
          <div className="flex flex-col gap-2">
            {requestType === 'none' && (
              <span className="text-gray-400 text-sm italic">
                No request submitted
              </span>
            )}

            {requestType !== 'none' && isVendor && (
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-50 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 hover:text-white py-3 rounded"
                      disabled={vendorApproved === true}
                    >
                      Approve
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <p className="text-sm font-medium mb-2">
                      Confirm approval for this request?
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 rounded text-green-600 cursor-pointer hover:bg-white hover:text-green-700"
                        onClick={() =>
                          handleVendorApproval(row.original._id, true)
                        }
                      >
                        Yes, Approve
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-50 bg-gradient-to-t to-red-700 from-red-500/70 hover:bg-red-500/80 hover:text-white py-3 rounded"
                    >
                      Reject
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <p className="text-sm font-medium mb-2">
                      Confirm rejection for this request?
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 rounded text-red-500 cursor-pointer bg-white hover:bg-white hover:text-red-700"
                        onClick={() =>
                          handleVendorApproval(row.original._id, false)
                        }
                      >
                        Yes, Reject
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {requestType !== 'none' && vendorApproved === true && (
              <>
                <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                  Vendor <CheckCircle className="w-4 h-4" /> Approved (
                  {requestType})
                </span>
                <span className="text-sm">Buyer Request ({requestType})</span>
              </>
            )}

            {requestType !== 'none' && vendorApproved === false && (
              <>
                <span className="flex items-center gap-1 text-red-600 font-medium text-sm">
                  Vendor <XCircle className="w-4 h-4" /> Rejected ({requestType}
                  )
                </span>
                <span className="text-sm">Buyer Request ({requestType})</span>
              </>
            )}

            {requestType !== 'none' &&
              isBuyer &&
              vendorApproved === undefined && (
                <span className="text-yellow-600 font-medium text-sm">
                  Pending Vendor Approval
                </span>
              )}
          </div>
        );
      },
    },
  ];

  if (isLoading) return <Spinner />;

  return (
    <div>
      {/* Search + Date Filter */}
      <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mt-5">
        <div className="relative w-full lg:w-3/5">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="border px-4 p-5 pr-12 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="absolute top-1/2 right-0 -translate-y-1/2 px-3 py-2 bg-[#003250] text-white rounded cursor-pointer"
          >
            <Search />
          </button>
        </div>

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

      {/* Header */}
      <div className="lg:flex justify-between items-center mt-6 mb-2">
        <h2 className="text-xl font-medium">Manage Booking Service</h2>
        <div>
          <Tabs className="w-full max-w-6xl mx-auto">
            <TabsList
              style={{ background: 'none' }}
              className="flex rounded-md w-full py-6 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
            >
              <TabsTrigger
                value="cancel-request"
                onClick={() =>
                  router.push(`/vendor/activity-center/booking-cancel`)
                }
                className="relative w-full cursor-pointer text-[#165940] border[#165940] text-base font-medium py-4 rounded px-4 transition bg-red-100 hover:bg-red-200 underline"
              >
                Cancel Request
                <FolderSymlink />
              </TabsTrigger>
              <TabsTrigger
                value="reschedule-request"
                onClick={() =>
                  router.push(`/vendor/activity-center/booking-reschedule`)
                }
                className="relative w-full cursor-pointer text-[#165940] text-base font-medium py-4 rounded px-4 transition bg-green-100 hover:bg-green-200 underline"
              >
                Reschedule Request
                <FolderSymlink />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <MSWTable columns={columns} data={bookings || []} />
      <MSWPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default ManageBookingServices;
