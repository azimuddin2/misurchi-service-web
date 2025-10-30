import { baseApi } from '../../api/baseApi';
import { TResponse } from '@/types';

export const stripeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Stripe account creation
    createVendorAccount: builder.mutation<TResponse<any>, { vendorId: string }>(
      {
        query: ({ vendorId }) => ({
          url: `/stripe/vendor/create-account`,
          method: 'POST',
          body: { vendorId },
          credentials: 'include',
        }),
      },
    ),

    // Stripe account status (POST body)
    getVendorAccountStatus: builder.mutation<
      TResponse<any>,
      { vendorId: string }
    >({
      query: ({ vendorId }) => ({
        url: `/stripe/vendor/account-status`,
        method: 'POST',
        body: { vendorId },
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useCreateVendorAccountMutation,
  useGetVendorAccountStatusMutation,
} = stripeApi;
