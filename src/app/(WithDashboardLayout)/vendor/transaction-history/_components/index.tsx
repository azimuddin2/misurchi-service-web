'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { format, parseISO } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useGetAllPaymentQuery } from '@/redux/features/payment/paymentApi';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { TPayment } from '@/types/payment.type';
import Spinner from '@/components/shared/Spinner';

const TransactionHistory = () => {
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

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const searchTerm = searchParams.get('searchTerm') || '';
  const createdAt = searchParams.get('createdAt') || '';

  const { data: vendorData } = useGetVendorProfileQuery(user?.email as string);
  const vendorId = vendorData?.data?._id as string;

  const { data, isLoading } = useGetAllPaymentQuery({
    vendorId,
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const payments: TPayment[] = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search & date filtering
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

  if (isLoading) {
    return <Spinner />;
  }

  const columns: ColumnDef<TPayment>[] = [
    // Select checkbox
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },

    // Reference & Buyer Column with optional thumbnail
    {
      accessorKey: 'reference',
      header: 'Reference & Buyer',
      cell: ({ row }) => {
        const ref = row.original.reference as any;
        const refId = ref?.bookingId || ref?.orderId || '-';
        const user = row.original.user as any;

        const imageUrl = ref?.images?.[0]?.url || '/placeholder.png';

        return (
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-gray-900">{refId}</p>
              <p className="text-gray-700 text-sm">Trx: {row.original.trnId}</p>
              <p className="font-medium text-sm text-gray-900">
                Buyer: {user?.fullName || 'Unknown'}
              </p>
              <p className="text-gray-500 text-sm">
                Email: {user?.email || '-'}
              </p>
              <p className="text-gray-500 text-sm">
                Platform Fee: ${row.original.adminAmount.toFixed(2)}
              </p>
              <p className="text-gray-500 text-sm">
                Net Payout: ${row.original.vendorAmount.toFixed(2)}
              </p>
            </div>
          </div>
        );
      },
    },

    // Price
    {
      accessorKey: 'price',
      header: 'Amount',
      cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
    },

    // Type Column (Booking / Order)
    {
      accessorKey: 'modelType',
      header: 'Type',
      cell: ({ row }) => {
        const isBooking = row.original.modelType === 'Booking';
        return (
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              isBooking
                ? 'bg-blue-50 text-blue-700'
                : 'bg-purple-50 text-purple-700 rounded-sm'
            }`}
          >
            {isBooking ? 'Booking' : 'Order'}
          </span>
        );
      },
    },

    // Payment Status Column
    {
      accessorKey: 'status',
      header: 'Payment Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`capitalize font-medium ${
              status === 'paid'
                ? 'text-green-600'
                : status === 'pending'
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}
          >
            {status === 'paid' ? 'Completed' : status}
          </span>
        );
      },
    },

    // Date Column
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return (
          <span className="text-gray-600">
            {date ? format(new Date(date), 'dd MMM, yyyy') : '-'}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {/* Search & Date Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mt-5">
        <div className="relative w-full lg:w-3/5">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="border px-4 py-5 pr-12 rounded w-full"
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
      <div className="flex justify-between items-center mt-10 mb-2">
        <h2 className="text-xl font-medium">Transaction History</h2>
      </div>

      {/* Table */}
      <MSWTable columns={columns} data={payments} />

      {/* Pagination */}
      <MSWPagination totalPage={meta.totalPage} />
    </div>
  );
};

export default TransactionHistory;
