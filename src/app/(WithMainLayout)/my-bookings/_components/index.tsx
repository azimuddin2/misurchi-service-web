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
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const MyBookings = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  const { data, isLoading } = useGetBookingsByEmailQuery(email);
  const bookings = data?.data ?? [];

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
              <p className="truncate font-medium">{row.original.serviceName}</p>
              <p className="text-xs text-gray-500">
                Service ID: {service?.serviceId}
              </p>
              <p className="text-xs text-gray-500">
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
        <span className="truncate">{row.original.duration}</span>
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
          {row.original.isPaid === false ? (
            <Link href={`/booking/${row.original._id}`}>
              <Button className="text-gray-50 rounded border-gray-800 bg-gradient-to-t to-green-800 from-green-600/70 hover:bg-green-500/80 font-semibold cursor-pointer">
                Pay
              </Button>
            </Link>
          ) : (
            <div>
              <h2 className="text-green-500">Paid</h2>
              <p>Transaction ID: {row.original.trnId}</p>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto my-10 p-3">
      <h1 className="text-xl mb-3">My Bookings</h1>
      <MSWTable columns={columns} data={bookings || []} />
    </div>
  );
};

export default MyBookings;
