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
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/shared/Spinner';
import Link from 'next/link';
import {
  useDeleteMemberMutation,
  useGetAllMembersQuery,
} from '@/redux/features/member/memberApi';
import { TMember } from '@/types/member.type';
import ViewMemberModal from './view-member-modal';

const ManageTeamMembers = () => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  const [selectedMember, setSelectedMember] = useState<TMember | null>(null);
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

  const vendorId = user?.vendorId as string;

  const { data, isLoading, refetch } = useGetAllMembersQuery({
    vendorId,
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const members = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const [deleteMember] = useDeleteMemberMutation();

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
  const handleDelete = (data: TMember) => {
    const fullName = `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim();

    setSelectedId(data?._id);
    setSelectedItem(fullName);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;

    const toastId = toast.loading('Deleting member...');

    try {
      const res = await deleteMember(selectedId).unwrap();
      toast.success(res.message || 'Member deleted successfully');
      setModalOpen(false);
      setSelectedId(null);
      setSelectedItem(null);
      refetch(); // Refresh Member list
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete member');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const columns: ColumnDef<TMember>[] = [
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
      accessorKey: 'firstName',
      header: 'Name',
      cell: ({ row }) => {
        const { image, firstName, lastName } = row.original;
        const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

        return (
          <div className="flex items-center gap-3">
            <Image
              src={image ?? '/placeholder.png'}
              alt={fullName || 'Team member'}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-gray-900 truncate">
                {fullName}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <span>{row.original.phone}</span>,
    },
    {
      accessorKey: 'specialty',
      header: 'Specialty',
      cell: ({ row }) => <span>{row.original.speciality}</span>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <span>{row.original.role}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Join Date',
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
                  onClick={() => {
                    setSelectedMember(row.original);
                    setViewModalOpen(true);
                  }}
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
                      `/vendor/team-members/update-member/${row.original._id}`,
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
      {/* Add Member Button */}
      <AppButton
        className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
        content={
          <Link
            href={`/vendor/team-members/add-member`}
            className="flex justify-center items-center space-x-1 font-semibold"
          >
            <PlusCircle size={24} />
            <span className="uppercase text-sm font-semibold">Add Member</span>
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
            placeholder="Search members..."
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
        <h2 className="text-xl font-medium">Manage Members</h2>
      </div>

      {/* Table & Pagination */}
      <MSWTable columns={columns} data={members || []} />
      <MSWPagination totalPage={meta?.totalPage} />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        name={selectedItem}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleDeleteConfirm}
      />

      {/* View Member Modal */}
      <ViewMemberModal
        selectedMember={selectedMember}
        isOpen={isViewModalOpen}
        onOpenChange={setViewModalOpen}
      />
    </div>
  );
};

export default ManageTeamMembers;
