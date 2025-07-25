import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userSignup: builder.mutation({
      query: (userInfo) => ({
        url: '/users/buyer/signup',
        method: 'POST',
        body: userInfo,
      }),
    }),
    vendorSignup: builder.mutation({
      query: (userInfo) => ({
        url: '/users/vendor/signup',
        method: 'POST',
        body: userInfo,
      }),
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/login',
        method: 'POST',
        body: userInfo,
      }),
    }),
  }),
});

export const {
  useUserSignupMutation,
  useVendorSignupMutation,
  useLoginMutation,
} = authApi;
