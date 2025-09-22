import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TOrder } from '@/types/order.type';

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addOrder: builder.mutation<TResponse<TOrder>, Partial<any>>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Order'],
    }),

    getAllOrdersByUser: builder.query<
      TResponse<TOrder[]>,
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

        return {
          url: `/orders?vendor=${vendorId}&page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Order'],
    }),

    getOrdersByEmail: builder.query<TResponse<TOrder[]>, string>({
      query: (email) => ({
        url: `/orders/user?email=${email}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Order'],
    }),

    getOrderById: builder.query<TResponse<TOrder>, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Order'],
    }),

    requestOrder: builder.mutation<
      TResponse<TOrder>, // Response type
      { id: string; body: FormData } // Arg type
    >({
      query: ({ id, body }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation<
      TResponse<TOrder>,
      { id: string; status: { status: string } }
    >({
      query: ({ id, status }) => ({
        url: `/orders/update-status/${id}`,
        method: 'PUT',
        body: status,
        credentials: 'include',
      }),
      invalidatesTags: ['Order'],
    }),

    deleteOrder: builder.mutation<TResponse<TOrder>, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useAddOrderMutation,
  useGetAllOrdersByUserQuery,
  useGetOrdersByEmailQuery,
  useGetOrderByIdQuery,
  useRequestOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;
