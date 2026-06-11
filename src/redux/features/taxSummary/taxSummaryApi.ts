import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import {
  TSalesTaxSummary,
  TSalesTaxSummaryDetail,
  TSubscriptionTaxSummary,
} from '@/types/taxSummary.type';

const taxSummaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

    getSalesTaxSummaryDetail: builder.query<
      TResponse<TSalesTaxSummaryDetail>,
      { vendorId: string; year: number }
    >({
      query: ({ vendorId, year }) => ({
        url: `/tax-summary/sales/${year}?vendorId=${vendorId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Payment'],
    }),
  }),
});

export const {
  useGetSalesTaxSummaryQuery,
  useGetSubscriptionTaxSummaryQuery,
  useGetSalesTaxSummaryDetailQuery,
} = taxSummaryApi;
