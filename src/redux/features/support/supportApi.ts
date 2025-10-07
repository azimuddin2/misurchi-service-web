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
  }),
});

export const { useAddSupportMutation } = supportApi;
