import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TPolicy } from '@/types/policy.type';

const policyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get single policy
    getPolicy: builder.query<TResponse<TPolicy>, void>({
      query: () => ({
        url: '/policy',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Policy'],
    }),
  }),
});

export const { useGetPolicyQuery } = policyApi;
