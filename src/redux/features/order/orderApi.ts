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

    getOrdersByEmail: builder.query<TResponse<TOrder[]>, string>({
      query: (email) => ({
        url: `/orders?email=${email}`,
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
  useGetOrdersByEmailQuery,
  useGetOrderByIdQuery,
  useRequestOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
