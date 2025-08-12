'use client';

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
import { TService } from '@/types/service.type';
import {
  useDeleteServiceMutation,
  useGetAllServicesQuery,
  useServiceHighlightStatusMutation,
  useUpdateServiceStatusMutation,
} from '@/redux/features/service/serviceApi';
import Spinner from '@/components/shared/Spinner';
import Link from 'next/link';

const statusOptions = [
  { label: 'available', key: 'available' },
  { label: 'unavailable', key: 'unavailable' },
];

const highlightstatusOptions = [
  { label: 'Highlight', key: 'Highlight' },
  { label: 'Highlighted', key: 'Highlighted' },
];

const ManageServices = () => {
  const user = useAppSelector(selectCurrentUser);
  const userId = user?.userId as string;
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

  const { data, isLoading, refetch } = useGetAllServicesQuery({
    userId,
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const services = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const [updateServiceStatus] = useUpdateServiceStatusMutation();
  const [serviceHighlightStatus] = useServiceHighlightStatusMutation();
  const [deleteService] = useDeleteServiceMutation();

  // searchTeam & createdAt date filtering
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
  const handleDelete = (data: TService) => {
    setSelectedId(data?._id);
    setSelectedItem(data?.name);
    setModalOpen(true);
  };

  const handleStatusUpdate = async (serviceId: string, status: string) => {
    const toastId = toast.loading('Updating status...');

    const updateStatus = { status };

    try {
      const res = await updateServiceStatus({
        id: serviceId,
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

  const handleHighlightStatusUpdate = async (
    serviceId: string,
    highlightStatus: string,
  ) => {
    const toastId = toast.loading('Updating highlight status...');

    const updateHighlightStatus = { highlightStatus };

    try {
      const res = await serviceHighlightStatus({
        id: serviceId,
        highlightStatus: updateHighlightStatus,
      }).unwrap();

      toast.success(res.message || 'Highlight status updated');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Highlight status update failed');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;

    const toastId = toast.loading('Deleting Service...');

    try {
      const res = await deleteService(selectedId).unwrap();
      toast.success(res.message || 'Service deleted successfully');
      setModalOpen(false);
      setSelectedId(null);
      setSelectedItem(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete service');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const columns: ColumnDef<TService>[] = [
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
      header: 'Service Name',
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
          available: 'text-[#165940]',
          unavailable: 'text-[#E12728]',
        };
        const statusColor = statusTextColorMap[status] || 'text-gray-700';
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-2 capitalize px-3 py-1 border rounded-sm bg-white ${statusColor}`}
            >
              <RxUpdate className="w-4 h-4" />
              {status}
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
      accessorKey: 'highlightStatus',
      header: 'Highlight Status',
      cell: ({ row }) => {
        const status = row.original.highlightStatus;
        const statusTextColorMap: Record<string, string> = {
          Highlight: 'text-[#1D4ED8]',
          Highlighted: 'text-[#165940]',
        };
        const statusColor = statusTextColorMap[status] || 'text-gray-700';
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-2 capitalize px-3 py-1 border rounded-sm bg-white ${statusColor}`}
            >
              <RxUpdate className="w-4 h-4" />
              {status}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
              {highlightstatusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.key}
                  onClick={() =>
                    handleHighlightStatusUpdate(row.original._id, option.key)
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
                      `/${user?.role}/listings/view-listing/${row.original._id}`,
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
                      `/${user?.role}/listings/update-listing/${row.original._id}`,
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
      {/* Add Service Button */}
      <AppButton
        className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
        content={
          <Link
            href={`/${user?.role}/manage-offering/add-service`}
            className="flex justify-center items-center space-x-1 font-semibold"
          >
            <PlusCircle size={24} />
            <span className="uppercase text-sm font-semibold">Add Service</span>
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
            placeholder="Search service..."
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
        <h2 className="text-xl font-medium">Manage Services</h2>
      </div>

      {/* Table & Pagination */}
      <MSWTable columns={columns} data={services || []} />
      <MSWPagination totalPage={meta?.totalPage} />

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

export default ManageServices;
