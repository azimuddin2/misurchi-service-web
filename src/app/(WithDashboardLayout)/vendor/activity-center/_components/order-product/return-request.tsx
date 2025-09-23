'use client';

import Spinner from '@/components/shared/Spinner';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { Input } from '@/components/ui/input';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetAllOrdersByUserQuery } from '@/redux/features/order/orderApi';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useAppSelector } from '@/redux/hooks';
import { TOrder } from '@/types/order.type';
import { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { ArrowRightFromLine, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReturnRequest = () => {
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

  const { data, isLoading } = useGetAllOrdersByUserQuery({
    vendorId,
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
      requestType: 'return',
    },
  });

  const orders = data?.data || [];
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

  const columns: ColumnDef<TOrder>[] = [
    {
      accessorKey: 'products',
      header: 'Product Info',
      cell: ({ row }) => {
        const products = row.original.products || [];

        return (
          <div className="lg:flex flex-col gap-2 p-3">
            {products.map((p) => (
              <div key={p.product} className="flex gap-3">
                <Image
                  src={p.image || '/placeholder.png'}
                  alt={p.name}
                  width={100}
                  height={100}
                  className="lg:w-28 lg:h-28 object-cover rounded border"
                />
                <div>
                  <p>{}</p>
                  <p className="text-base font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {p.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Discount Price: ${p.discount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price: ${p.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      },
    },

    {
      accessorKey: 'buyer',
      header: 'Buyer Info',
      cell: ({ row }) => (
        <div>
          <p className="text-base text-gray-500">
            {row.original.buyer?.fullName}
          </p>
          <p className="text-sm text-gray-500">{row.original.buyer?.email}</p>
          <p className="text-sm text-gray-500">{row.original.buyer?.phone}</p>
        </div>
      ),
    },
    {
      accessorKey: 'totalPrice',
      header: 'Order Info',
      cell: ({ row }) => (
        <div>
          <p className="text-base text-gray-500">
            Order Date:{' '}
            {format(new Date(row.original.createdAt), 'dd MMM, yyyy')}
          </p>
          <p className="text-base text-gray-500">
            Total Amount: ${row.original.totalPrice.toFixed(2)}
          </p>
          <p className="text-base text-gray-500">
            Delivery Status: {row.original.status}
          </p>
        </div>
      ),
    },

    {
      accessorKey: 'request',
      header: 'Request',
      cell: ({ row }) => {
        const request = row.original.request || {};
        const vendorApproved = request.vendorApproved;
        const requestType = request.type ?? 'none';

        const user = useAppSelector(selectCurrentUser);
        const isBuyer = user?.role === 'buyer';

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
                Cancel date:{' '}
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
        <h2 className="text-xl font-medium my-2">Return Order Request</h2>

        <div>
          <Tabs className="w-full max-w-6xl mx-auto">
            <TabsList
              style={{ background: 'none' }}
              className="flex rounded-md w-full py-6 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
            >
              {/* Cancellation Tab */}
              <TabsTrigger
                value="cancellation"
                onClick={() =>
                  router.push(
                    `/${user?.role}/activity-center/order-cancellation`,
                  )
                }
                className="relative w-full cursor-pointer text-[#165940] text-base
    font-medium py-4 rounded px-4 transition bg-red-100 hover:bg-red-200"
              >
                Cancellation Request
                <ArrowRightFromLine />
              </TabsTrigger>

              {/* Services Tab */}
              <TabsTrigger
                value="return-request"
                onClick={() =>
                  router.push(`/${user?.role}/activity-center/order-return`)
                }
                className="relative w-full cursor-pointer text-[#165940] text-base
    font-medium py-4 rounded px-4 transition bg-green-100 hover:bg-green-200"
              >
                Return Request
                <ArrowRightFromLine />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Table & Pagination */}
      <MSWTable columns={columns} data={orders || []} />
      <MSWPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default ReturnRequest;
