'use client';

import { TMeta } from '@/types';
import { TProduct } from '@/types/product.type';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Edit, Eye, PlusCircle, Trash2 } from 'lucide-react';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Image from 'next/image';
import { format } from 'date-fns';
import { AppButton } from '@/components/shared/app-button';
import { Checkbox } from '@/components/ui/checkbox';
import DeleteConfirmationModal from '@/components/ui/core/MSWModal/DeleteConfirmationModal';

type TProductsProps = {
  products: TProduct[];
  meta: TMeta;
};

const ManageProducts = ({ products, meta }: TProductsProps) => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[] | []>([]);

  const handleDelete = (data: TProduct) => {
    setSelectedId(data?._id);
    setSelectedItem(data?.name);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // if (selectedId) {
      //   const res = await deleteListing(selectedId);
      //   if (res.success) {
      //     toast.success(res.message);
      //     setModalOpen(false);
      //   } else {
      //     toast.error(res.message);
      //   }
      // }
    } catch (err: any) {
      console.error(err?.message);
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
            if (value) {
              setSelectedIds((prev) => [...prev, row.original._id]);
            } else {
              setSelectedIds(
                selectedIds.filter((id) => id !== row.original._id),
              );
            }

            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
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
      cell: ({ row }) => <span>{row.original.status}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const formattedDate = format(date, 'dd MMM, yyyy'); // e.g., 24 Feb, 2025
        return <span>{formattedDate}</span>;
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center space-x-4">
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

  return (
    <div>
      <AppButton
        className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
        content={
          <div className="flex justify-center items-center space-x-1 font-semibold">
            <PlusCircle size={24} />
            <span className="uppercase text-sm font-semibold">Add Product</span>
          </div>
        }
      />

      <div className="flex justify-between items-center mt-10 mb-2">
        <h2 className="text-xl font-medium">Manage Products</h2>
      </div>

      <MSWTable columns={columns} data={products || []} />
      <MSWPagination totalPage={meta?.totalPage} />
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
