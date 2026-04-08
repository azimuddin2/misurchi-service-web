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
      {
        email: string;
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ email, page = 1, limit = 6, query }) => {
        const params = new URLSearchParams();

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/supports/${email}?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
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
