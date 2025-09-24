import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';

interface CheckoutPayload {
  user: string;
  vendor: string;
  modelType: string;
  reference: string;
  price: number | string;
}

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<
      TResponse<string>, // backend returns checkout URL as string in data
      CheckoutPayload // payload type
    >({
      query: (payload) => ({
        url: '/payments/checkout',
        method: 'POST',
        body: payload, // send JSON instead of FormData
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Payment'],
    }),

    getAllPayment: builder.query<
      TResponse<any[]>,
      {
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        if (query?.price) {
          params.append('minPrice', '0');
          params.append('maxPrice', query.price.toString());
        }

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/payments?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Payment'],
    }),
  }),
});

export const { useCreateCheckoutSessionMutation, useGetAllPaymentQuery } =
  paymentApi;
