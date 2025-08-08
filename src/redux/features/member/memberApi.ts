import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TMember } from '@/types/member.type';

const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addMember: builder.mutation<TResponse<TMember>, FormData>({
      query: (formData) => ({
        url: '/team-members',
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
      invalidatesTags: ['Member'],
    }),

    getAllMembers: builder.query<
      TResponse<TMember[]>,
      {
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/team-members?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Member'],
    }),

    getMemberById: builder.query<TResponse<TMember>, string>({
      query: (id) => ({
        url: `/team-members/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Member'],
    }),

    updateProduct: builder.mutation<
      TResponse<TProduct>, // Response type
      { id: string; body: FormData } // Arg type
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation<TResponse<TProduct>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {} = memberApi;
