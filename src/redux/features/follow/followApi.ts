import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TFollow, TVendorFollowersResponse } from '@/types/follow.type';

export const followApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🟢 Follow Vendor
    followVendor: builder.mutation<TResponse<TFollow>, string>({
      query: (vendorId) => ({
        url: `/follow/${vendorId}/follow`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['Follow'],
    }),

    // 🔴 Unfollow Vendor
    unfollowVendor: builder.mutation<TResponse<TFollow>, string>({
      query: (vendorId) => ({
        url: `/follow/${vendorId}/unfollow`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Follow'],
    }),

    // 🔍 Get Vendor Followers Count
    getVendorFollowers: builder.query<
      TResponse<TVendorFollowersResponse>,
      string
    >({
      query: (vendorId) => ({
        url: `/follow/${vendorId}/followers`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Follow'],
    }),
  }),
});

export const {
  useFollowVendorMutation,
  useUnfollowVendorMutation,
  useGetVendorFollowersQuery,
} = followApi;
