import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import {
  TPayment,
  TSalesTaxSummary,
  TSubscriptionTaxSummary,
} from '@/types/payment.type';

interface CheckoutPayload {
  user: string;
  vendor: string;
  modelType: string;
  reference: string;
  price: number | string;
}

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<TResponse<string>, CheckoutPayload>(
      {
        query: (payload) => ({
          url: '/payments/checkout',
          method: 'POST',
          body: payload,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        invalidatesTags: ['Payment'],
      },
    ),

    getAllPayment: builder.query<
      TResponse<TPayment[]>,
      {
        vendorId: string;
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ vendorId, page = 1, limit = 10, query }) => {
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
          url: `/payments?vendor=${vendorId}&page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Payment'],
    }),

    // ─── Sales Tax Summary ──────────────────────────────────────────────────
    getSalesTaxSummary: builder.query<
      TResponse<TSalesTaxSummary[]>,
      { vendorId: string }
    >({
      query: ({ vendorId }) => ({
        url: `/tax-summary/sales?vendorId=${vendorId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Payment'],
    }),

    // ─── Subscription Tax Summary ───────────────────────────────────────────
    getSubscriptionTaxSummary: builder.query<
      TResponse<TSubscriptionTaxSummary[]>,
      { vendorId: string }
    >({
      query: ({ vendorId }) => ({
        url: `/tax-summary/subscriptions?vendorId=${vendorId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Payment'],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetAllPaymentQuery,
  useGetSalesTaxSummaryQuery,
  useGetSubscriptionTaxSummaryQuery,
} = paymentApi;
