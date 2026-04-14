import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TCancellationPolicy } from '@/types/cancellationPolicy.type';

const returnPolicyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create or update (upsert) cancellation policy
    addReturnPolicy: builder.mutation<
      TResponse<TCancellationPolicy>,
      Partial<TCancellationPolicy>
    >({
      query: (data) => ({
        url: '/return-policy',
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['ReturnPolicy'],
    }),

    // Get single cancellation policy
    getReturnPolicy: builder.query<TResponse<TCancellationPolicy>, string>({
      query: (vendorId) => ({
        url: `/return-policy/${vendorId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['ReturnPolicy'],
    }),
  }),
});

export const { useAddReturnPolicyMutation, useGetReturnPolicyQuery } =
  returnPolicyApi;
