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
  useOrderApprovedRequestMutation,
  useUpdateOrderStatusMutation,
} from '@/redux/features/order/orderApi';
import { useAppSelector } from '@/redux/hooks';
import { TOrder } from '@/types/order.type';
import { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import {
  CheckCircle,
  ChevronDown,
  FolderSymlink,
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
import PaymentBadge from './payment-badge';

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

  const vendorId = user?.vendorId as string;

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
  const [orderApprovedRequest] = useOrderApprovedRequestMutation();

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
      const res = await orderApprovedRequest({
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
        const products = row.original.products ?? [];
        return (
          <div className="flex flex-col gap-2 w-fit">
            {products.map((p) => (
              <div key={p.product} className="flex items-center gap-3">
                <Image
                  src={p.image || '/placeholder.png'}
                  alt={p.name}
                  width={100}
                  height={100}
                  className="lg:w-20 lg:h-20 object-cover rounded border shrink-0"
                />
                <div className="min-w-[140px]">
                  <p className="text-base font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {p.quantity}
                  </p>
                  <p className="text-sm text-gray-500">Price: ${p.price}</p>
                  <div className="flex gap-2 flex-wrap my-1">
                    {p.size && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                        Size: {p.size}
                      </span>
                    )}

                    {p.color && (
                      <span className="px-2 py-1 text-xs bg-blue-50 text-gray-800 rounded flex items-center gap-1 font-medium">
                        Color:
                        <span
                          className="w-3 h-3 rounded-full border border-gray-300 ml-1"
                          style={{ backgroundColor: p.color }}
                        />
                        {p.color}
                      </span>
                    )}
                  </div>
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
      header: 'Date & Time',
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
      accessorKey: 'isPaid',
      header: 'Payment Status',
      cell: ({ row }) => {
        const { isPaid, trnId } = row.original;
        return (
          <div className="flex flex-col gap-1">
            <PaymentBadge isPaid={isPaid} />
            {trnId && (
              <span className="text-xs text-gray-500 font-mono break-all">
                TXN ID: {trnId}
              </span>
            )}
          </div>
        );
      },
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
                  disabled={option.key === status}
                  onClick={() =>
                    option.key !== status &&
                    handleStatusUpdate(row.original._id, option.key)
                  }
                  className={`capitalize px-3 py-2 ${option.key === status
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
        const isTeamMember = user?.role === 'team_member';
        const isBuyer = user?.role === 'user';

        const canApprove = isVendor || isTeamMember;
        const hasRequest = requestType !== 'none';
        const isPending = vendorApproved === null;
        const isApproved = vendorApproved === true;
        const isRejected = vendorApproved === false;

        const requestLabel =
          requestType === 'cancelled' ? 'Cancellation' : 'Return';

        return (
          <div className="flex flex-col gap-2">
            {/* No request */}
            {!hasRequest && (
              <span className="text-gray-400 text-sm italic">
                No request submitted
              </span>
            )}

            {/* Approve / Reject — pending */}
            {hasRequest && canApprove && isPending && (
              <div className="flex flex-col gap-2">
                <span className="text-yellow-600 text-sm font-medium flex items-center gap-1">
                  ⏳ Pending — Buyer requested a <strong>{requestLabel}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-gray-50 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 hover:text-white py-3 rounded cursor-pointer"
                      >
                        ✓ Approve
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60">
                      <p className="text-sm font-medium mb-1">
                        Approve {requestLabel}?
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        This will confirm the buyer&apos;s{' '}
                        {requestLabel.toLowerCase()} request.
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
                        className="text-gray-50 bg-gradient-to-t to-red-700 from-red-500/70 hover:bg-red-500/80 hover:text-white py-3 rounded cursor-pointer"
                      >
                        ✕ Reject
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60">
                      <p className="text-sm font-medium mb-1">
                        Reject {requestLabel}?
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        The buyer&apos;s {requestLabel.toLowerCase()} request
                        will be declined.
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
              </div>
            )}

            {/* Approved */}
            {hasRequest && isApproved && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                  <CheckCircle className="w-4 h-4" /> {requestLabel} Approved
                </span>
                <span className="text-sm text-gray-500">
                  Buyer&apos;s {requestLabel.toLowerCase()} request has been
                  approved.
                </span>
              </div>
            )}

            {/* Rejected */}
            {hasRequest && isRejected && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-red-600 font-medium text-sm">
                  <XCircle className="w-4 h-4" /> {requestLabel} Rejected
                </span>
                <span className="text-sm text-gray-500">
                  Buyer&apos;s {requestLabel.toLowerCase()} request has been
                  declined.
                </span>
              </div>
            )}

            {/* Buyer — pending */}
            {hasRequest && isBuyer && isPending && (
              <div className="flex flex-col gap-1">
                <span className="text-yellow-600 font-medium text-sm flex items-center gap-1">
                  ⏳ Awaiting Vendor Response
                </span>
                <span className="text-sm text-gray-500">
                  Your {requestLabel.toLowerCase()} request is under review.
                </span>
              </div>
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
                  router.push(`/vendor/activity-center/order-cancellation`)
                }
                className="relative w-full cursor-pointer text-[#165940] border[#165940] text-base font-medium py-4 rounded px-4 transition bg-red-100 hover:bg-red-200 underline"
              >
                Cancellation Request
                <FolderSymlink />
              </TabsTrigger>

              {/* Services Tab */}
              <TabsTrigger
                value="return-request"
                onClick={() =>
                  router.push(`/vendor/activity-center/order-return`)
                }
                className="relative w-full cursor-pointer text-[#165940] text-base font-medium py-4 rounded px-4 transition bg-green-100 hover:bg-green-200 underline"
              >
                Return Request
                <FolderSymlink />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Table & Pagination */}
      <MSWTable columns={columns} data={orders || []} />
      {orders?.length > 1 && <MSWPagination totalPage={meta?.totalPage} />}
    </div>
  );
};

export default ManageOrderProducts;
