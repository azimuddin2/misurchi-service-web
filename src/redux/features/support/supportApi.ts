import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TSupport } from '@/types/support.type';

const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSupport: builder.mutation<TResponse<TSupport>, Partial<TSupport>>({
      query: (supportData) => ({
        url: '/supports',
        method: 'POST',
        body: supportData,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Support'],
    }),

    getSupportByEmail: builder.query<
      TResponse<TSupport[]>,
      { email: string; query?: Record<string, unknown> }
    >({
      query: ({ email, query }) => ({
        url: `/supports/${email}`,
        method: 'GET',
        params: query,
        credentials: 'include',
      }),
      providesTags: ['Support'],
    }),

    markHelpful: builder.mutation<
      TResponse<TSupport>,
      { id: string; isHelpful: boolean }
    >({
      query: ({ id, isHelpful }) => ({
        url: `/supports/${id}/helpful`,
        method: 'PATCH',
        body: { isHelpful },
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Support'],
    }),
  }),
});

export const {
  useAddSupportMutation,
  useGetSupportByEmailQuery,
  useMarkHelpfulMutation,
} = supportApi;
