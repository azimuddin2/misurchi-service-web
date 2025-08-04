'use client';

import { TMeta } from '@/types';
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
  Edit,
  Eye,
  PlusCircle,
  Trash2,
  CalendarIcon,
  CircleX,
  Delete,
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
import { RxUpdate } from 'react-icons/rx';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const statusOptions = [
  { label: 'Available', key: 'Available' },
  { label: 'Out of Stock', key: 'Out of Stock' },
  { label: 'TBC', key: 'TBC' },
  { label: 'Discontinued', key: 'Discontinued' },
];

const highlightStatusOptions = [
  { label: 'Highlight', key: 'Highlight' },
  { label: 'Highlighted', key: 'Highlighted' },
];

type TProductsProps = {
  products: TProduct[];
  meta: TMeta;
};

const ManageProducts = ({ products, meta }: TProductsProps) => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Sync state with URL
  useEffect(() => {
    const searchTerm = searchParams.get('searchTerm') || '';
    const selectedDateStr = searchParams.get('createdAt');
    const parsedDate = selectedDateStr ? new Date(selectedDateStr) : undefined;

    setSearchInputValue(searchTerm);
    setSelectedDate(parsedDate);
  }, [searchParams]);

  const updateSearchParams = useCallback(
    (newParams: Record<string, string | null | undefined>) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (!value) currentParams.delete(key);
        else currentParams.set(key, value);
      });
      router.push(`?${currentParams.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = () => {
    updateSearchParams({ searchTerm: searchInputValue, page: '1' });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    updateSearchParams({
      createdAt: date ? date.toISOString() : null,
      page: '1',
    });
  };

  const handleDelete = (data: TProduct) => {
    setSelectedId(data._id);
    setSelectedItem(data.name);
    setModalOpen(true);
  };

  const handleStatusUpdate = async (productId: string, status: string) => {
    const toastId = toast.loading('Updating Status...');
    try {
      // TODO: API call
      toast.success('Status updated');
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleHighlightStatusUpdate = async (
    productId: string,
    highlightStatus: string,
  ) => {
    const toastId = toast.loading('Updating Highlight Status...');
    try {
      // TODO: API call
      toast.success('Highlight status updated');
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // TODO: API call to delete
      toast.success('Deleted successfully');
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const columns: ColumnDef<TProduct>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
          <div className="flex items-center space-x-3">
            <Image
              src={imageUrl}
              alt={name}
              width={60}
              height={60}
              className="rounded object-cover border"
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
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 capitalize border px-3 py-1 rounded-sm bg-white">
              <RxUpdate className="w-4 h-4" />
              {status}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.key}
                  onClick={() => handleStatusUpdate(row.original._id, opt.key)}
                >
                  {opt.label}
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
      accessorKey: 'highlightStatus',
      header: 'Highlight',
      cell: ({ row }) => {
        const status = row.original.highlightStatus;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 capitalize border px-3 py-1 rounded-sm bg-white">
              <RxUpdate className="w-4 h-4" />
              {status}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {highlightStatusOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.key}
                  onClick={() =>
                    handleHighlightStatusUpdate(row.original._id, opt.key)
                  }
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Eye
                  onClick={() =>
                    router.push(
                      `/${user?.role}/listings/view-listing/${row.original._id}`,
                    )
                  }
                  className="text-blue-500 cursor-pointer"
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
                      `/${user?.role}/listings/update-listing/${row.original._id}`,
                    )
                  }
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

  return (
    <div>
      <AppButton
        className="w-full bg-white text-black border"
        content={
          <div className="flex items-center justify-center gap-2 font-semibold">
            <PlusCircle size={20} />
            <span>Add Product</span>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
        <div className="relative w-full">
          <Input
            placeholder="Search here"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchInputValue && (
            <button
              onClick={() => {
                setSearchInputValue('');
                updateSearchParams({ searchTerm: null, page: '1' });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
            >
              <CircleX />
            </button>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate
                ? format(selectedDate, 'MMMM dd, yyyy')
                : 'Select Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              captionLayout="dropdown"
              fromYear={2020}
              toYear={2030}
            />
            {selectedDate && (
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => handleDateSelect(undefined)}
              >
                Clear Date <Delete className="ml-1" />
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-6">
        <MSWTable columns={columns} data={products || []} />
        <MSWPagination totalPage={meta?.totalPage} />
      </div>

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
