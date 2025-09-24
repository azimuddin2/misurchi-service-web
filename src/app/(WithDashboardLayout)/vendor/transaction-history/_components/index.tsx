'use client';

import { TProduct } from '@/types/product.type';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Eye, PlusCircle, Search, Trash2 } from 'lucide-react';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { AppButton } from '@/components/shared/app-button';
import { Checkbox } from '@/components/ui/checkbox';
import DeleteConfirmationModal from '@/components/ui/core/MSWModal/DeleteConfirmationModal';
import { RxUpdate } from 'react-icons/rx';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  useDeleteProductMutation,
  useGetAllProductsByUserQuery,
  useProductHighlightStatusMutation,
  useUpdateProductStatusMutation,
} from '@/redux/features/product/productApi';
import Spinner from '@/components/shared/Spinner';
import Link from 'next/link';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useGetAllPaymentQuery } from '@/redux/features/payment/paymentApi';

const TransactionHistory = () => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  //   const { data: vendorData } = useGetVendorProfileQuery(user?.email as string);
  //   const vendorId = vendorData?.data?._id as string;

  const { data, isLoading, refetch } = useGetAllPaymentQuery({
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const payments = data?.data || [];
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

  const columns: ColumnDef<any>[] = [
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
          onCheckedChange={(value) => {
            setSelectedIds((prev) =>
              value
                ? [...prev, row.original._id]
                : prev.filter((id) => id !== row.original._id),
            );
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }) => {
        const { images, name } = row.original;
        const imageUrl = images?.[0]?.url || '/placeholder.png';
        return (
          <div className="flex items-start space-x-3">
            <Image
              src={imageUrl}
              alt={name}
              width={100}
              height={100}
              className="w-14 h-14 rounded-sm object-cover border"
            />
            <span className="truncate">{name}</span>
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
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), 'dd MMM, yyyy'),
    },
  ];
  return (
    <div>
      <div>
        {/* Add Product Button */}
        <AppButton
          className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
          content={
            <Link
              href={`/${user?.role}/manage-offering/add-product`}
              className="flex justify-center items-center space-x-1 font-semibold"
            >
              <PlusCircle size={24} />
              <span className="uppercase text-sm font-semibold">
                Add Product
              </span>
            </Link>
          }
        />

        {/* Search + Date Filter Section */}
        <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mt-5">
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
        <div className="flex justify-between items-center mt-10 mb-2">
          <h2 className="text-xl font-medium">Manage Products</h2>
        </div>

        {/* Table & Pagination */}
        <MSWTable columns={columns} data={payments || []} />
        <MSWPagination totalPage={meta?.totalPage} />
      </div>
    </div>
  );
};

export default TransactionHistory;
