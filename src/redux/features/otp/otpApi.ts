import { baseApi } from '../../api/baseApi';

const otpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyOtp: builder.mutation({
      query: (otpCode) => ({
        url: '/otp/verify-otp',
        method: 'POST',
        body: otpCode,
      }),
    }),
  }),
});

export const { useVerifyOtpMutation } = otpApi;
