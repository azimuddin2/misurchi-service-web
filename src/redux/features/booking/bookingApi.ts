import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TBooking } from '@/types/booking.type';

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBooking: builder.mutation<TResponse<TBooking>, Partial<any>>({
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

    getAllBookingsByUser: builder.query<
      TResponse<TBooking[]>,
      {
        vendorId: string;
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ vendorId, page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        if (query?.requestType) {
          params.append('requestType', query.requestType.toString());
        }

        return {
          url: `/bookings?vendor=${vendorId}&page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Booking'],
    }),

    getBookingAppointments: builder.query<
      TResponse<TBooking[]>,
      {
        vendorId: string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ vendorId, query }) => {
        const params = new URLSearchParams();

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        // Add date filter
        if (query?.date) {
          // Ensure the date is in 'YYYY-MM-DD' format
          params.append('date', query.date.toString().slice(0, 10));
        }

        return {
          url: `/bookings/appointments?vendor=${vendorId}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Booking'],
    }),

    getBookingsByEmail: builder.query<TResponse<TBooking[]>, string>({
      query: (email) => ({
        url: `/bookings/user?email=${email}`,
        method: 'GET',
        credentials: 'include',
      }),
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

    updateBookingRequest: builder.mutation<
      TResponse<TBooking>,
      { id: string; data: Partial<TBooking> }
    >({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: 'PATCH',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Booking'],
    }),

    // ✅ Update booking request vendor approval
    updateBookingRequestApproval: builder.mutation<
      TResponse<TBooking>,
      { id: string; vendorApproved: boolean }
    >({
      query: ({ id, vendorApproved }) => ({
        url: `/bookings/update-request/${id}`,
        method: 'PUT',
        body: { vendorApproved }, // ensure Boolean
        credentials: 'include',
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
  useGetAllBookingsByUserQuery,
  useGetBookingsByEmailQuery,
  useGetBookingByIdQuery,
  useDeleteBookingMutation,
  useUpdateBookingRequestMutation,
  useUpdateBookingRequestApprovalMutation,
  useGetBookingAppointmentsQuery,
} = bookingApi;
