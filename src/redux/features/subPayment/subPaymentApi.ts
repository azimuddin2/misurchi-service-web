import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TSubPayment } from '@/types/subPayment.type';

const subPaymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubPaymentByVendor: builder.query<
      TResponse<TSubPayment[]>,
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
          url: `/sub-payments/vendor?vendorId=${vendorId}&page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['SubPayment'],
    }),

    getActiveSubscriptionByVendor: builder.query<
      TResponse<TSubPayment>,
      string
    >({
      query: (id) => ({
        url: `/sub-payments/vendor/active/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['SubPayment'],
    }),

    cancelActiveSubscription: builder.mutation<
      TResponse<{ expiredAt: string; message: string }>,
      string
    >({
      query: (vendorId) => ({
        url: `/sub-payments/cancel-subscription/${vendorId}`,
        method: 'PATCH',
        credentials: 'include',
      }),
      invalidatesTags: ['SubPayment'],
    }),
  }),
});

export const {
  useGetSubPaymentByVendorQuery,
  useGetActiveSubscriptionByVendorQuery,
  useCancelActiveSubscriptionMutation,
} = subPaymentApi;
