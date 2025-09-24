'use client';

import Spinner from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { MSWTable } from '@/components/ui/core/MSWTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import {
  useGetAllOrdersByUserQuery,
  useUpdateOrderRequestMutation,
  useUpdateOrderStatusMutation,
} from '@/redux/features/order/orderApi';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useAppSelector } from '@/redux/hooks';
import { TOrder } from '@/types/order.type';
import { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import {
  ArrowRightFromLine,
  CheckCircle,
  ChevronDown,
  Search,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusOptions = [
  { label: 'Pending', key: 'pending' },
  { label: 'Shipped', key: 'shipped' },
  { label: 'Delivered', key: 'delivered' },
];

const ManageOrderProducts = () => {
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

  const { data, isLoading, refetch } = useGetAllOrdersByUserQuery({
    vendorId,
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const orders = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updateOrderRequest] = useUpdateOrderRequestMutation();

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

  const handleStatusUpdate = async (orderId: string, status: string) => {
    const toastId = toast.loading('Updating status...');

    const updateStatus = { status };

    try {
      const res = await updateOrderStatus({
        id: orderId,
        status: updateStatus,
      }).unwrap();

      toast.success(res.message || 'Status updated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Status update failed');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleVendorApproval = async (orderId: string, approved: boolean) => {
    const toastId = toast.loading('Updating status...');

    try {
      const res = await updateOrderRequest({
        id: orderId,
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

  const columns: ColumnDef<TOrder>[] = [
    {
      accessorKey: 'products',
      header: 'Product',
      cell: ({ row }) => {
        const products = row.original.products || [];

        return (
          <div className="lg:flex flex-col gap-2 w-fit">
            {products.map((p) => (
              <div key={p.product} className="flex items-center gap-3">
                <Image
                  src={p.image || '/placeholder.png'}
                  alt={p.name}
                  width={64}
                  height={64}
                  className="lg:w-24 lg:h-24 object-cover rounded border"
                />
                <div>
                  <p>{}</p>
                  <p className="text-base font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {p.quantity}
                  </p>
                  <p className="text-sm text-gray-500">Price: ${p.price}</p>
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
          <p className="text-base font-medium">
            {row.original.buyer?.fullName}
          </p>
          <p className="text-sm text-gray-500">{row.original.buyer?.email}</p>
          <p className="text-sm text-gray-500">{row.original.buyer?.phone}</p>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-base">
          {format(new Date(row.original.createdAt), 'dd MMM, yyyy hh:mm a')}
        </span>
      ),
    },
    {
      accessorKey: 'totalPrice',
      header: 'Total Price',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-600">
          ${row.original.totalPrice.toFixed(2)}
        </span>
      ),
    },

    {
      accessorKey: 'status',
      header: 'Delivery Status',
      cell: ({ row }) => {
        const status = row.original.status;

        const statusTextColorMap: Record<string, string> = {
          pending: 'text-yellow-600 border-yellow-600',
          shipped: 'text-blue-600 border-blue-600',
          delivered: 'text-green-600 border-green-600',
        };

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
                  disabled={option.key === status} // ✅ disable if current status
                  onClick={() =>
                    option.key !== status && // ✅ only allow change if different
                    handleStatusUpdate(row.original._id, option.key)
                  }
                  className={`capitalize px-3 py-2 ${
                    option.key === status
                      ? 'opacity-50 cursor-not-allowed' // ✅ style for disabled
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

        // Current user
        const user = useAppSelector(selectCurrentUser);
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
                      disabled={vendorApproved === false}
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
              <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                <CheckCircle className="w-4 h-4" />
                Approved ({requestType})
              </span>
            )}

            {requestType !== 'none' && vendorApproved === false && (
              <span className="flex items-center gap-1 text-red-600 font-medium text-sm">
                <XCircle className="w-4 h-4" />
                Rejected ({requestType})
              </span>
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
        <h2 className="text-xl font-medium">Manage Order Products</h2>

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

export default ManageOrderProducts;
