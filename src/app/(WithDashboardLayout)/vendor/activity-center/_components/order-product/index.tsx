'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { RxUpdate } from 'react-icons/rx';
import { TOrderProduct } from '@/types/order.type';
import { format, parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { MSWTable } from '@/components/ui/core/MSWTable';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { useGetProductByIdQuery } from '@/redux/features/product/productApi';

// TODO: Backend data load
import ordersProductData from '@/../../public/data/activity-center.json';

const ManageOrderProducts = () => {
  const user = useAppSelector(selectCurrentUser);
  const userId = user?.userId as string;
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // const { data, isLoading, refetch } = useGetAllProductsQuery({
  //     userId,
  //     page,
  //     limit,
  //     query: {
  //         searchTerm,
  //         createdAt,
  //     },
  // });

  // const products = data?.data || [];
  const meta = { totalPage: 1 };

  const id = ordersProductData.orderProducts.map((o) => o.productId);
  const { data: productsData } = useGetProductByIdQuery(id);

  console.log(productsData);

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

  const columns: ColumnDef<TOrderProduct>[] = [
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
    // {
    //     accessorKey: 'name',
    //     header: 'Product Name',
    //     cell: ({ row }) => {
    //         const { images, name } = row.original;
    //         const imageUrl = images?.[0]?.url || '/placeholder.png';
    //         return (
    //             <div className="flex items-start space-x-3">
    //                 <Image
    //                     src={imageUrl}
    //                     alt={name}
    //                     width={100}
    //                     height={100}
    //                     className="w-14 h-14 rounded-sm object-cover border"
    //                 />
    //                 <span className="truncate">{name}</span>
    //             </div>
    //         );
    //     },
    // },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
    },
    // {
    //     accessorKey: 'status',
    //     header: 'Status',
    //     cell: ({ row }) => {
    //         const status = row.original.status;
    //         const statusTextColorMap: Record<string, string> = {
    //             Available: 'text-[#165940]',
    //             'Out of Stock': 'text-[#E12728]',
    //             TBC: 'text-[#0078BF]',
    //             Discontinued: 'text-[#6B5103]',
    //         };
    //         const statusColor = statusTextColorMap[status] || 'text-gray-700';
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger
    //                     className={`flex items-center gap-2 capitalize px-3 py-1 border rounded-sm bg-white ${statusColor}`}
    //                 >
    //                     <RxUpdate className="w-4 h-4" />
    //                     {status}
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent className="w-44">
    //                     {statusOptions.map((option) => (
    //                         <DropdownMenuItem
    //                             key={option.key}
    //                             onClick={() =>
    //                                 handleStatusUpdate(row.original._id, option.key)
    //                             }
    //                             className="capitalize px-3 py-2 hover:bg-gray-100"
    //                         >
    //                             {option.label}
    //                         </DropdownMenuItem>
    //                     ))}
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), 'dd MMM, yyyy'),
    },
  ];

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
        <h2 className="text-xl font-medium">Products</h2>
      </div>

      {/* Table & Pagination */}
      <MSWTable
        columns={columns}
        data={ordersProductData.orderProducts || []}
      />
      <MSWPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default ManageOrderProducts;
