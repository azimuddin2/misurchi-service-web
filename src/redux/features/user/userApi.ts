import { TResponse, TVendorUser } from '@/types';
import { baseApi } from '../../api/baseApi';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendorProfile: builder.query<TResponse<TVendorUser>, string>({
      query: (email) => ({
        url: `/vendors/profile/${email}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    updateVendorProfile: builder.mutation<
      TResponse<TVendorUser>,
      { email: string; body: FormData }
    >({
      query: ({ email, body }) => ({
        url: `/vendors/profile/${email}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetVendorProfileQuery, useUpdateVendorProfileMutation } =
  userApi;
