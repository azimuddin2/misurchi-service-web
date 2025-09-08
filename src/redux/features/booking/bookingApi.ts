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

    getAllBooking: builder.query<
      TResponse<TBooking[]>,
      {
        userId: string;
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ userId, page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/bookings?user=${userId}&page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Booking'],
    }),

    getBookingById: builder.query<TResponse<TBooking>, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Booking'],
    }),

    updateBooking: builder.mutation<
      TResponse<TBooking>,
      { id: string; body: Partial<TBooking> }
    >({
      query: ({ id, body }) => ({
        url: `/bookings/${id}`,
        method: 'PATCH',
        body, // send JSON
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Booking'],
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
  useGetAllBookingQuery,
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingApi;
