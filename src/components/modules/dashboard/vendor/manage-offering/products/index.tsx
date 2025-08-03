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
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Image from 'next/image';
import { format } from 'date-fns';

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

  const handleDelete = (data: TProduct) => {
    setSelectedId(data?._id);
    setSelectedItem(data?.name);
    setModalOpen(true);
  };

  // const handleDeleteConfirm = async () => {
  //   try {
  //     if (selectedId) {
  //       const res = await deleteListing(selectedId);
  //       if (res.success) {
  //         toast.success(res.message);
  //         setModalOpen(false);
  //       } else {
  //         toast.error(res.message);
  //       }
  //     }
  //   } catch (err: any) {
  //     console.error(err?.message);
  //   }
  // };

  const columns: ColumnDef<TProduct>[] = [
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
              className="w-10 h-10 rounded object-cover border"
            />
            <span className="truncate">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span>$ {row.original.price.toFixed(2)}</span>,
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
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-medium">Manage Products</h2>

        <button
          onClick={() => router.push(`/user/listings/add-listing`)}
          className="cursor-pointer"
        >
          <Plus /> Add Product
        </button>
      </div>

      <MSWTable columns={columns} data={products || []} />
      <MSWPagination totalPage={meta?.totalPage} />
      {/* <DeleteConfirmationModal
        name={selectedItem}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleDeleteConfirm}
      /> */}
    </div>
  );
};

export default ManageProducts;
