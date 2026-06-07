'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FileText, Search } from 'lucide-react';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { format, parseISO } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useGetAllPaymentQuery } from '@/redux/features/payment/paymentApi';
import { TPayment } from '@/types/payment.type';
import Spinner from '@/components/shared/Spinner';
import Image from 'next/image';
import Link from 'next/link';

const SalesHistory = () => {
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

  const vendorId = user?.vendorId as string;

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

  console.log('Payments Data:', meta, payments);

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
    {
      accessorKey: 'reference',
      id: 'referenceDetails',
      header: 'Product / Service',
      cell: ({ row }) => {
        const ref = row.original.reference as any;
        const refId = ref?.bookingId || ref?.orderId || '-';
        const isBooking = row.original.modelType === 'Booking';

        if (isBooking) {
          // ✅ Booking — Service info
          return (
            <div className="flex flex-col gap-1">
              <p className="font-medium text-gray-900">{refId}</p>
              <p className="font-medium text-gray-900 text-sm">
                {ref?.serviceName || '-'}
              </p>
              <p className="text-gray-500 text-xs">
                Date:{' '}
                {ref?.date ? format(new Date(ref.date), 'dd MMM, yyyy') : '-'}
              </p>
              <p className="text-gray-500 text-xs">Time: {ref?.time || '-'}</p>
              <p className="text-gray-500 text-xs">
                Duration: {ref?.duration || '-'}
              </p>
            </div>
          );
        }

        // ✅ Order — Products list
        const products = ref?.products || [];
        return (
          <div className="flex flex-col gap-1">
            {products.length > 0 ? (
              <>
                {products.slice(0, 2).map((product: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Image
                      src={product?.image || '/placeholder.png'}
                      alt={product?.name}
                      width={100}
                      height={100}
                      className="w-14 h-14 rounded-sm object-cover border"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{refId}</p>
                      <p className="text-sm text-gray-900 font-medium leading-tight">
                        {product?.name || '-'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {product?.quantity} &middot; $
                        {product?.price?.toFixed(2) || '0.00'}
                      </p>
                      <div className="flex gap-2 flex-wrap my-1">
                        {product.size && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                            Size: {product.size}
                          </span>
                        )}

                        {product.color && (
                          <span className="px-2 py-1 text-xs bg-blue-50 text-gray-800 rounded flex items-center gap-1 font-medium">
                            Color:
                            <span
                              className="w-3 h-3 rounded-full border border-gray-300 ml-1"
                              style={{ backgroundColor: product.color }}
                            />
                            {product.color}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {products.length > 2 && (
                  <p className="text-xs text-gray-400">
                    +{products.length - 2} more
                  </p>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'user',
      header: 'Buyer Name & Email',
      cell: ({ row }) => {
        const user = row.original.user as any;

        return (
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-sm text-gray-900">
                {user?.fullName || 'Unknown'}
              </p>
              <p className="text-gray-500 text-sm">{user?.email || '-'}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'trnId',
      header: 'Transaction Details',
      cell: ({ row }) => {
        return (
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-gray-700 text-xs">
                TXN ID: {row.original.trnId}
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
    {
      accessorKey: 'price',
      header: 'Amount',
      cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
    },
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
            {isBooking ? 'Service' : 'Product'}
          </span>
        );
      },
    },
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
            placeholder="Search"
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
      <div className="flex justify-between items-center mt-10 mb-3">
        <h2 className="text-xl font-medium">Sales Transaction History</h2>
        <Link
          href="/vendor/transaction-history/tax-summary"
          className="flex items-center text-sm text-[#006400] hover:text-green-700 transition-colors"
        >
          <FileText size={18} />
          <span className="underline decoration-1 underline-offset-2">
            Tax Summary Report
          </span>
        </Link>
      </div>

      {/* Table */}
      <MSWTable columns={columns} data={payments} />

      {/* Pagination */}
      <MSWPagination totalPage={meta.totalPage} />
    </div>
  );
};

export default SalesHistory;
