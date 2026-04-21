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
import {
  AlertCircle,
  ChevronDown,
  Edit,
  ExternalLink,
  Eye,
  PlusCircle,
  Search,
  Trash2,
} from 'lucide-react';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { AppButton } from '@/components/shared/app-button';
import { Checkbox } from '@/components/ui/checkbox';
import DeleteConfirmationModal from '@/components/ui/core/MSWModal/DeleteConfirmationModal';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  useDeleteProductMutation,
  useGetAllProductsByUserQuery,
  useUpdateProductStatusMutation,
} from '@/redux/features/product/productApi';
import Spinner from '@/components/shared/Spinner';
import Link from 'next/link';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useGetUserProfileQuery } from '@/redux/features/user/userApi';

const statusOptions = [
  { label: 'Available', key: 'Available' },
  { label: 'Out of Stock', key: 'Out of Stock' },
  { label: 'TBC', key: 'TBC' },
  { label: 'Discontinued', key: 'Discontinued' },
];

const ManageProducts = () => {
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

  // Fetch user profile
  const { data: userData } = useGetUserProfileQuery(user?.email as string, {
    skip: !user?.email,
  });

  const stripeAccountId = userData?.data?.stripeAccountId;
  const stripeOnboardingComplete = userData?.data?.stripeOnboardingComplete;

  const { data: vendorData } = useGetVendorProfileQuery(user?.email as string);
  const vendorId = vendorData?.data?._id as string;

  const { data, isLoading, refetch } = useGetAllProductsByUserQuery({
    vendorId,
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const products = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const [updateProductStatus] = useUpdateProductStatusMutation();
  const [deleteProduct] = useDeleteProductMutation();

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

  // API call here backend
  const handleDelete = (data: TProduct) => {
    setSelectedId(data?._id);
    setSelectedItem(data?.name);
    setModalOpen(true);
  };

  const handleStatusUpdate = async (productId: string, status: string) => {
    const toastId = toast.loading('Updating status...');

    const updateStatus = { status };

    try {
      const res = await updateProductStatus({
        id: productId,
        status: updateStatus,
      }).unwrap();

      toast.success(res.message || 'Status updated');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Status update failed');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;

    const toastId = toast.loading('Deleting product...');

    try {
      const res = await deleteProduct(selectedId).unwrap();
      toast.success(res.message || 'Product deleted successfully');
      setModalOpen(false);
      setSelectedId(null);
      setSelectedItem(null);
      refetch(); // Refresh product list
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete product');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const columns: ColumnDef<TProduct>[] = [
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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusTextColorMap: Record<string, string> = {
          Available: 'text-[#165940] border-[#165940]',
          'Out of Stock': 'text-[#E12728] border-[#E12728]',
          TBC: 'text-[#0078BF] border-[#0078BF]',
          Discontinued: 'text-[#6B5103] border-[#6B5103]',
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
                  onClick={() =>
                    handleStatusUpdate(row.original._id, option.key)
                  }
                  className="capitalize px-3 py-2 hover:bg-gray-100"
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
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), 'dd MMM, yyyy'),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Eye
                  onClick={() =>
                    router.push(
                      `/${user?.role}/manage-offering/view-product/${row.original._id}`,
                    )
                  }
                  size={20}
                  className="text-blue-400 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Edit
                  onClick={() =>
                    router.push(
                      `/${user?.role}/manage-offering/update-product/${row.original._id}`,
                    )
                  }
                  size={20}
                  className="text-green-500 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Trash2
                  onClick={() => handleDelete(row.original)}
                  size={20}
                  className="text-red-500 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {(!stripeAccountId || !stripeOnboardingComplete) && (
        <div className="mt-2 flex items-start gap-3 text-yellow-800 bg-yellow-50 p-3 rounded border border-yellow-200 text-sm">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-yellow-600" />
          <div className="flex flex-col gap-1">
            <span className="font-medium">Stripe onboarding incomplete</span>
            <span className="text-yellow-700">
              Complete your bank account setup before adding products.
            </span>
            <Link
              href="/vendor/settings"
              className="mt-1 inline-flex items-center gap-1 font-medium text-yellow-900 underline underline-offset-2 hover:text-yellow-700 transition-colors"
            >
              Go to Settings → Continue Bank Account
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* Add Product Button */}
      <AppButton
        disabled={!stripeAccountId || !stripeOnboardingComplete}
        className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
        content={
          <Link
            href={`/${user?.role}/manage-offering/add-product`}
            className="flex justify-center items-center space-x-1 font-semibold"
          >
            <PlusCircle size={24} />
            <span className="uppercase text-sm font-semibold">Add Product</span>
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
      <MSWTable columns={columns} data={products || []} />
      {products?.length > 5 && <MSWPagination totalPage={meta?.totalPage} />}

      {/* Delete Modal */}
      <DeleteConfirmationModal
        name={selectedItem}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ManageProducts;
