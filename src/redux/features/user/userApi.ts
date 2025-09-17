import { IUser, TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<TResponse<IUser>, string>({
      query: (email) => ({
        url: `/users/profile/${email}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation<
      TResponse<IUser>,
      { email: string; body: FormData }
    >({
      query: ({ email, body }) => ({
        url: `/users/profile/${email}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;
