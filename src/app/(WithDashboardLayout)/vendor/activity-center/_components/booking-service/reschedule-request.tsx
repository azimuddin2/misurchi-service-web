'use client';

import Spinner from '@/components/shared/Spinner';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { Input } from '@/components/ui/input';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { FolderSymlink, Search } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllBookingsByUserQuery } from '@/redux/features/booking/bookingApi';
import { TBooking } from '@/types/booking.type';
import { PaymentBadge } from './payment-badge';

const RescheduleRequest = () => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const pathname = usePathname();
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

  const { data, isLoading } = useGetAllBookingsByUserQuery({
    vendorId,
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
      requestType: 'reschedule',
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
          remainingAmount = 0,
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
      cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
    },
    {
      accessorKey: 'request',
      header: 'Request',
      cell: ({ row }) => {
        const request = row.original.request || {};
        const vendorApproved = request.vendorApproved;
        const requestType = request.type ?? 'none';

        const isBuyer = user?.role === 'user';

        // Status text and color
        let statusText = '';
        let statusColor = '';

        if (requestType === 'none') {
          statusText = 'No request submitted';
          statusColor = 'text-gray-400';
        } else if (vendorApproved === true) {
          statusText = `Status: Approved (${requestType})`;
          statusColor = 'text-green-600';
        } else if (vendorApproved === false) {
          statusText = `Status: Rejected (${requestType})`;
          statusColor = 'text-red-600';
        } else if (vendorApproved === undefined && isBuyer) {
          statusText = `Status: Pending (${requestType})`;
          statusColor = 'text-yellow-600';
        }

        return (
          <div className="flex flex-col gap-1 w-44">
            {request.updatedAt && (
              <p>
                Reschedule Date:{' '}
                {format(new Date(request.updatedAt), 'dd MMM, yyyy')}
              </p>
            )}

            <p className={`font-medium ${statusColor} text-base`}>
              {statusText}
            </p>

            {request.reason && (
              <p className="text-gray-500 break-words whitespace-normal text-sm">
                <span className="font-medium">Reason:</span> {request.reason}
              </p>
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
      <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mb-5">
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
        <h2 className="text-xl font-medium my-2">Reschedule Booking Request</h2>

        <div>
          <Tabs className="w-full max-w-6xl mx-auto">
            <TabsList
              style={{ background: 'none' }}
              className="flex rounded-md w-full py-6 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
            >
              {/* Cancel Request Tab */}
              <TabsTrigger
                value="cancel-request"
                onClick={() =>
                  router.push(`/vendor/activity-center/booking-cancel`)
                }
                className={`relative w-full cursor-pointer text-base font-medium py-4 rounded px-4 transition-all duration-200
          ${pathname === '/vendor/activity-center/booking-cancel'
                    ? 'bg-red-100 text-red-600 border-b-2 border-red-500'
                    : 'text-black bg-white shadow border border-gray-100'
                  }`}
              >
                Cancel Request
                <FolderSymlink />
              </TabsTrigger>

              {/* Reschedule Request Tab */}
              <TabsTrigger
                value="reschedule-request"
                onClick={() =>
                  router.push(`/vendor/activity-center/booking-reschedule`)
                }
                className={`relative w-full cursor-pointer text-[#165940] text-base font-medium py-4 rounded px-4 transition-all duration-200
          ${pathname === '/vendor/activity-center/booking-reschedule'
                    ? 'bg-green-100 text-green-700 border-b-2 border-green-600'
                    : 'text-black bg-white shadow border border-gray-100'
                  }`}
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
      {bookings?.length > 1 && <MSWPagination totalPage={meta?.totalPage} />}
    </div>
  );
};

export default RescheduleRequest;
