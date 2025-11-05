'use client';

import Spinner from '@/components/shared/Spinner';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { TBooking } from '@/types/booking.type';
import Image from 'next/image';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { format, parseISO } from 'date-fns';
import { CheckCircle, FolderSymlink, Search, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import {
  useGetAllBookingsByUserQuery,
  useUpdateBookingRequestApprovalMutation,
} from '@/redux/features/booking/bookingApi';
import { Input } from '@/components/ui/input';
import MSWPagination from '@/components/ui/core/MSWPagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  const { data: vendorData } = useGetVendorProfileQuery(user?.email as string);
  const vendorId = vendorData?.data?._id as string;

  const { data, isLoading, refetch } = useGetAllBookingsByUserQuery({
    vendorId,
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const bookings = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  // search & createdAt date filtering part
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
      createdAt: date ? format(date, 'yyyy-MM-dd') : null, // Only send 'YYYY-MM-DD'
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

  const columns: ColumnDef<TBooking>[] = [
    {
      accessorKey: 'service',
      header: 'Service',
      cell: ({ row }) => {
        const service = row.original.service;
        console.log(service);
        const imageUrl = service?.images?.[0]?.url || '/placeholder.png';
        return (
          <div className="flex items-start space-x-3">
            <Image
              src={imageUrl}
              alt={service?.name || 'Service'}
              width={100}
              height={100}
              className="w-24 h-28 rounded-sm object-cover border"
            />
            <div>
              <p className="truncate">{row.original.serviceName}</p>
              <p className="truncate">ServiceId: {row.original.serviceId}</p>
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
          <p className="truncate">{row.original.time}</p>
        </div>
      ),
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => (
        <span className="truncate">{row.original.duration}s</span>
      ),
    },
    {
      accessorKey: 'paymentType',
      header: 'Payment Type',
      cell: ({ row }) => (
        <span className="capitalize">Pay {row.original.paymentType}</span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
    },
    {
      accessorKey: 'request',
      header: 'Request Action',
      cell: ({ row }) => {
        const request = row.original.request || {};
        const vendorApproved = request.vendorApproved;
        const requestType = request.type ?? 'none';

        // Current user
        const isVendor = user?.role === 'vendor';
        const isBuyer = user?.role === 'buyer';

        return (
          <div className="flex flex-col gap-2">
            {/* Case 1: No request submitted */}
            {requestType === 'none' && (
              <span className="text-gray-400 text-sm italic">
                No request submitted
              </span>
            )}

            {/* Case 2: Vendor must act */}
            {requestType !== 'none' && isVendor && (
              <div className="flex items-center gap-2">
                {/* Approve button with Popover */}
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

                {/* Reject button with Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-50 bg-gradient-to-t to-red-700 from-red-500/70 hover:bg-red-500/80 hover:text-white py-3 rounded"
                      // disabled={vendorApproved === false}
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

            {/* Case 3: Vendor already acted */}
            {requestType !== 'none' && vendorApproved === true && (
              <>
                <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                  Vendor <CheckCircle className="w-4 h-4" />
                  Approved ({requestType})
                </span>
                <span className="text-sm">Buyer Request ({requestType})</span>
              </>
            )}

            {requestType !== 'none' && vendorApproved === false && (
              <>
                <span className="flex items-center gap-1 text-red-600 font-medium text-sm">
                  Vendor <XCircle className="w-4 h-4" />
                  Rejected ({requestType})
                </span>
                <span className="text-sm">Buyer Request ({requestType})</span>
              </>
            )}

            {/* Case 4: Buyer sees pending */}
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Search + Date Filter Section */}
      <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mt-5">
        <div className="relative w-full lg:w-3/5">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="border px-4 p-5 pr-12 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="absolute top-1/2 right-0 -translate-y-1/2 px-3 py-2 bg-[#003250] text-white rounded cursor-pointer"
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

      {/* Header */}
      <div className="lg:flex justify-between items-center mt-6 mb-2">
        <h2 className="text-xl font-medium">Manage Booking Service</h2>

        <div>
          <Tabs className="w-full max-w-6xl mx-auto">
            <TabsList
              style={{ background: 'none' }}
              className="flex rounded-md w-full py-6 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
            >
              {/* Cancellation Tab */}
              <TabsTrigger
                value="cancel-request"
                onClick={() =>
                  router.push(`/${user?.role}/activity-center/booking-cancel`)
                }
                className="relative w-full cursor-pointer text-[#165940] text-base
    font-medium py-4 rounded px-4 transition bg-red-100 hover:bg-red-200"
              >
                Cancel Request
                <FolderSymlink />
              </TabsTrigger>

              {/* Services Tab */}
              <TabsTrigger
                value="reschedule-request"
                onClick={() =>
                  router.push(
                    `/${user?.role}/activity-center/booking-reschedule`,
                  )
                }
                className="relative w-full cursor-pointer text-[#165940] text-base
    font-medium py-4 rounded px-4 transition bg-green-100 hover:bg-green-200"
              >
                Reschedule Request
                <FolderSymlink />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Table & Pagination */}
      <MSWTable columns={columns} data={bookings || []} />
      <MSWPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default ManageBookingServices;
