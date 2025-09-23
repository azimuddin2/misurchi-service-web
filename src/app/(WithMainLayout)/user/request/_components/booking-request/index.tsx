'use client';

import Spinner from '@/components/shared/Spinner';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetBookingsByEmailQuery } from '@/redux/features/booking/bookingApi';
import { useAppSelector } from '@/redux/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { TBooking } from '@/types/booking.type';
import Image from 'next/image';
import { MSWTable } from '@/components/ui/core/MSWTable';
import { format } from 'date-fns';
import { CalendarClock, CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import CancelModal from './cancel-modal';

const BookingsRequest = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  const [selectedCancelBooking, setSelectedCancelBooking] =
    useState<TBooking | null>(null);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);

  const { data, isLoading } = useGetBookingsByEmailQuery(email);
  const bookings = data?.data ?? [];

  const handleConfirmCancel = () => {
    if (!selectedCancelBooking) return;
    console.log('Order cancelled:', selectedCancelBooking._id);
    setCancelModalOpen(false);
    setSelectedCancelBooking(null);
  };

  const columns: ColumnDef<TBooking>[] = [
    {
      accessorKey: 'service',
      header: 'Service',
      cell: ({ row }) => {
        const service = row.original.service;
        const imageUrl = service?.images?.[0]?.url || '/placeholder.png';
        return (
          <div className="flex items-start space-x-3">
            <Image
              src={imageUrl}
              alt={service?.name || 'Service'}
              width={100}
              height={100}
              className="w-24 h-28 rounded-sm object-cover border"
            />
            <div>
              <p className="truncate">
                Service Name: {row.original.serviceName}
              </p>
              <p className="truncate">ServiceId: {service?.serviceId}</p>
              <p className="truncate">
                Provider: {row?.original?.vendor?.businessName}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.date), 'dd MMM, yyyy'),
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: ({ row }) => <span className="truncate">{row.original.time}</span>,
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => (
        <span className="truncate">{row.original.duration}s</span>
      ),
    },
    {
      accessorKey: 'paymentType',
      header: 'Payment Type',
      cell: ({ row }) => (
        <span className="capitalize">Pay {row.original.paymentType}</span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  className="text-green-500 capitalize hover:text-green-600 rounded-full bg-green-100 hover:bg-green-200 h-10 w-10 cursor-pointer"
                  onClick={() => {
                    // setSelectedCancelOrder(row.original);
                    // setCancelModalOpen(true);
                  }}
                >
                  <CalendarClock className="text-green-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="uppercase">Reschedule</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  className="text-red-500 capitalize hover:text-red-600 rounded-full bg-red-100 hover:bg-red-200 h-10 w-10 cursor-pointer"
                  onClick={() => {
                    setSelectedCancelBooking(row.original);
                    setCancelModalOpen(true);
                  }}
                >
                  <CalendarX className="text-red-500 text-lg" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="uppercase">Cancel</TooltipContent>
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
    <div className="container mx-auto my-5 p-3">
      <h1 className="text-xl mb-3">My Bookings</h1>
      <MSWTable columns={columns} data={bookings || []} />

      {/* Single Cancel Modal */}
      <CancelModal
        selectedBooking={selectedCancelBooking}
        isOpen={isCancelModalOpen}
        onOpenChange={setCancelModalOpen}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default BookingsRequest;
