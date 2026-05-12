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
import {
  Edit,
  MessageSquareMore,
  PlusCircle,
  Search,
  Trash2,
} from 'lucide-react';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { format, parseISO } from 'date-fns';
import { AppButton } from '@/components/shared/app-button';
import { Checkbox } from '@/components/ui/checkbox';
import DeleteConfirmationModal from '@/components/ui/core/MSWModal/DeleteConfirmationModal';
import { RxUpdate } from 'react-icons/rx';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/shared/Spinner';
import Link from 'next/link';
import { TNote, TTask } from '@/types/task.type';
import {
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useGetTasksByTeamMemberIdQuery,
  useUpdateTaskStatusMutation,
} from '@/redux/features/task/taskApi';
import DescriptionCell from '@/components/ui/core/description-cell';
import { TMember } from '@/types/member.type';
import Image from 'next/image';
import StatusUpdateModal from './status-update-modal';
import ViewNotesModal from './view-notes-modal';

const statusOptions = [
  { label: 'To-Do', key: 'To-Do' },
  { label: 'In Progress', key: 'In Progress' },
  { label: 'Needs Review', key: 'Needs Review' },
  { label: 'Blocked/Dependencies', key: 'Blocked/Dependencies' },
  { label: 'Done', key: 'Done' },
  { label: 'Obsolete', key: 'Obsolete' },
];

const ManageTaskHub = () => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<{
    taskId: string;
    status: string;
  } | null>(null);
  const [note, setNote] = useState('');

  const [isNotesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<TNote[]>([]);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState('');

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
  const isTeamMember = user?.teamRole === 'team_member';

  const { data, isLoading, refetch } = useGetAllTasksQuery({
    vendorId,
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const tasks = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const { data: teamMemberTasks, isLoading: isTeamMemberTasksLoading } =
    useGetTasksByTeamMemberIdQuery(
      {
        userId: user?.userId as string,
        page,
        limit,
        query: {
          searchTerm,
          createdAt,
        },
      },
      {
        skip: !isTeamMember || !user?.userId,
      },
    );

  const teamMemberTasksData = teamMemberTasks?.data || [];
  const teamMemberTasksMeta = teamMemberTasks?.meta || { totalPage: 1 };

  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();

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
  const handleDelete = (data: TTask) => {
    setSelectedId(data?._id);
    setSelectedItem(data?.title);
    setModalOpen(true);
  };

  // dropdown click এ modal open করবে
  const handleStatusClick = (taskId: string, status: string) => {
    setPendingStatus({ taskId, status });
    setStatusModalOpen(true);
    setNote('');
  };

  // modal confirm এ actual API call
  const handleStatusUpdate = async () => {
    if (!pendingStatus) return;

    const toastId = toast.loading('Updating status...');
    try {
      const res = await updateTaskStatus({
        id: pendingStatus.taskId,
        status: {
          status: pendingStatus.status,
          note: note.trim() || undefined,
        },
      }).unwrap();

      toast.success(res.message || 'Status updated');
      setStatusModalOpen(false);
      setPendingStatus(null);
      setNote('');
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
      const res = await deleteTask(selectedId).unwrap();
      toast.success(res.message || 'Product deleted successfully');
      setModalOpen(false);
      setSelectedId(null);
      setSelectedItem(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete product');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleNotesClick = (notes: TNote[], title: string) => {
    setSelectedNotes(notes);
    setSelectedTaskTitle(title);
    setNotesModalOpen(true);
  };

  const columns: ColumnDef<TTask>[] = [
    {
      accessorKey: 'assignTeamMember',
      header: 'Assigned Team Member',
      cell: ({ row }) => {
        const member = row?.original?.assignTeamMember;
        if (typeof member === 'object' && member !== null) {
          const { firstName, lastName, image, email } = member as TMember;
          const imageUrl = image || '/placeholder.png';
          return (
            <div className="flex items-center space-x-3">
              <Image
                src={imageUrl}
                alt={`${firstName} ${lastName}`}
                width={50}
                height={50}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <span className="truncate">
                  {firstName} {lastName}
                </span>
                <p className="text-gray-500 text-xs">{email}</p>
              </div>
            </div>
          );
        }
        return <span className="text-gray-400 text-sm">N/A</span>;
      },
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const title = row.original.title;
        const isLong = title.length > 18;
        const displayTitle = isLong ? title.slice(0, 18) + '...' : title;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default">{displayTitle}</span>
              </TooltipTrigger>
              {isLong && (
                <TooltipContent>
                  <p className="max-w-[200px] break-words">{title}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'estimatedCompletion',
      header: 'Estimated Completion Date/Time',
      cell: ({ row }) => (
        <div>
          <p>{format(new Date(row.original.date), 'dd MMM, yyyy')}</p>
          <p>{row.original.time}</p>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <DescriptionCell text={row.original.description || ''} />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusStyleMap: Record<
          string,
          { text: string; bg: string; dot: string; border: string }
        > = {
          'To-Do': {
            text: 'text-amber-700',
            bg: 'bg-amber-50',
            dot: 'bg-amber-400',
            border: 'border-amber-200',
          },
          'In Progress': {
            text: 'text-blue-700',
            bg: 'bg-blue-50',
            dot: 'bg-blue-500',
            border: 'border-blue-200',
          },
          'Needs Review': {
            text: 'text-rose-700',
            bg: 'bg-rose-50',
            dot: 'bg-rose-500',
            border: 'border-rose-200',
          },
          'Blocked/Dependencies': {
            text: 'text-orange-800',
            bg: 'bg-orange-50',
            dot: 'bg-orange-500',
            border: 'border-orange-200',
          },
          Done: {
            text: 'text-emerald-700',
            bg: 'bg-emerald-50',
            dot: 'bg-emerald-500',
            border: 'border-emerald-200',
          },
          Obsolete: {
            text: 'text-slate-500',
            bg: 'bg-slate-100',
            dot: 'bg-slate-400',
            border: 'border-slate-200',
          },
        };
        const style = statusStyleMap[status] || {
          text: 'text-gray-600',
          bg: 'bg-gray-100',
          dot: 'bg-gray-400',
          border: 'border-gray-200',
        };
        return (
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${style.text} ${style.bg} ${style.border}`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }) => {
        const notes = row.original.notes || [];
        if (notes.length === 0)
          return <span className="text-gray-400 text-xs">No Notes</span>;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleNotesClick(notes, row.original.title)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <MessageSquareMore className="w-3 h-3" />
                  {notes.length} note{notes.length > 1 ? 's' : ''}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Click to view notes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
                <Edit
                  onClick={() =>
                    router.push(
                      `/vendor/task-hub/update-task/${row.original._id}`,
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

  const teamMemberTasksColumns: ColumnDef<TTask>[] = [
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
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <span>{row.original.title}</span>,
    },
    {
      accessorKey: 'estimatedCompletion',
      header: 'Estimated Completion Date/Time',
      cell: ({ row }) => (
        <div>
          <p>{format(new Date(row.original.date), 'dd MMM, yyyy')}</p>
          <p>{row.original.time}</p>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <DescriptionCell text={row.original.description || ''} />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusTextColorMap: Record<string, string> = {
          'To-Do': 'text-[#165940]',
          'In Progress': 'text-[#0078BF]',
          'Needs Review': 'text-[#E12728]',
          'Blocked/Dependencies': 'text-[#6B5103]',
          Done: 'text-[#165940]',
          Obsolete: 'text-[#6B5103]',
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
                    handleStatusClick(row.original._id, option.key)
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
  ];

  if (isLoading || isTeamMemberTasksLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {user?.teamRole === 'team_member' ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-medium">My Tasks</h2>
          </div>

          {/* Table & Pagination */}
          <MSWTable
            columns={teamMemberTasksColumns}
            data={teamMemberTasksData || []}
          />
          <MSWPagination totalPage={teamMemberTasksMeta?.totalPage} />

          <StatusUpdateModal
            isOpen={isStatusModalOpen}
            onOpenChange={setStatusModalOpen}
            pendingStatus={pendingStatus}
            note={note}
            onNoteChange={setNote}
            onConfirm={handleStatusUpdate}
          />
        </div>
      ) : (
        <div>
          {/* Add Product Button */}
          <AppButton
            className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
            content={
              <Link
                href={`/vendor/task-hub/add-task`}
                className="flex justify-center items-center space-x-1 font-semibold"
              >
                <PlusCircle size={24} />
                <span className="uppercase text-sm font-semibold">
                  Add Task
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
                placeholder="Search task..."
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
            <h2 className="text-xl font-medium">Manage Tasks</h2>
          </div>

          {/* Table & Pagination */}
          <MSWTable columns={columns} data={tasks || []} />
          <MSWPagination totalPage={meta?.totalPage} />

          {/* Delete Modal */}
          <DeleteConfirmationModal
            name={selectedItem}
            isOpen={isModalOpen}
            onOpenChange={setModalOpen}
            onConfirm={handleDeleteConfirm}
          />

          <ViewNotesModal
            isOpen={isNotesModalOpen}
            onOpenChange={setNotesModalOpen}
            notes={selectedNotes}
            taskTitle={selectedTaskTitle}
          />
        </div>
      )}
    </div>
  );
};

export default ManageTaskHub;
