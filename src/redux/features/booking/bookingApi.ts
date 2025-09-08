import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TBooking } from '@/types/booking.type';

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBooking: builder.mutation<TResponse<TBooking>, Partial<TBooking>>({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Booking'],
    }),

    getBookingsByEmail: builder.query<TResponse<TBooking>, string>({
      query: (email) => ({
        url: `/bookings?email=${email}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Booking'],
    }),

    deleteBooking: builder.mutation<TResponse<TBooking>, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useAddBookingMutation,
  useGetBookingsByEmailQuery,
  useDeleteBookingMutation,
} = bookingApi;
