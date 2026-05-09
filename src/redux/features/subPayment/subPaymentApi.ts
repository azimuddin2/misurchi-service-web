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
  }),
});

export const { useGetSubPaymentByVendorQuery } = subPaymentApi;
