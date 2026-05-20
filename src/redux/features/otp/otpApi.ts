import { baseApi } from '../../api/baseApi';

const otpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    resendOtp: builder.mutation({
      query: (email: string) => ({
        url: '/otp/resend-otp',
        method: 'POST',
        body: { email },
      }),
    }),
    verifyOtp: builder.mutation({
      query: (otpCode) => ({
        url: '/otp/verify-otp',
        method: 'POST',
        body: otpCode,
      }),
    }),
  }),
});

export const { useVerifyOtpMutation, useResendOtpMutation } = otpApi;
