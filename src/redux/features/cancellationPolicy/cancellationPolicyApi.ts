import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TCancellationPolicy } from '@/types/cancellationPolicy.type';

const cancellationPolicyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create or update (upsert) cancellation policy
    addCancellationPolicy: builder.mutation<
      TResponse<TCancellationPolicy>,
      Partial<TCancellationPolicy>
    >({
      query: (data) => ({
        url: '/cancellation-policy',
        method: 'PATCH',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['CancellationPolicy'],
    }),

    // Get single cancellation policy
    getCancellationPolicy: builder.query<
      TResponse<TCancellationPolicy>,
      string
    >({
      query: (vendorId) => ({
        url: `/cancellation-policy/${vendorId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['CancellationPolicy'],
    }),
  }),
});

export const {
  useAddCancellationPolicyMutation,
  useGetCancellationPolicyQuery,
} = cancellationPolicyApi;
