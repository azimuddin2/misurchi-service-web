import { baseApi } from '@/redux/api/baseApi';
import { TResponse } from '@/types';
import { TTerms } from '@/types/terms.type';

const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get single terms
    getTerms: builder.query<TResponse<TTerms>, void>({
      query: () => ({
        url: '/terms',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Terms'],
    }),
  }),
});

export const { useGetTermsQuery } = termsApi;
