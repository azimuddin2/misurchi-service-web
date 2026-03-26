import { baseApi } from '../../api/baseApi';
import { TResponse } from '@/types';

type TStripeConnectResponse = {
  object: string;
  url: string;
  expires_at: number;
  accountId: string;
};

export const stripeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStripeConnectAccount: builder.mutation<
      TResponse<TStripeConnectResponse>,
      void
    >({
      query: () => ({
        url: '/stripe/connect-account',
        method: 'PATCH',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useCreateStripeConnectAccountMutation } = stripeApi;
