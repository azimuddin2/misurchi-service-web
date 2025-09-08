'use client';

import Spinner from '@/components/shared/Spinner';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetBookingsByEmailQuery } from '@/redux/features/booking/bookingApi';
import { useAppSelector } from '@/redux/hooks';
import { TBooking } from '@/types/booking.type';

const MyBookings = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  const { data, isLoading } = useGetBookingsByEmailQuery(email);

  const bookings = data?.data;

  console.log(bookings);

  if (isLoading) {
    return <Spinner />;
  }

  return <div>{/* <h1>My Bookings: {bookings}</h1> */}</div>;
};

export default MyBookings;
