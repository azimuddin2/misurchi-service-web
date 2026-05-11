import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TSubscription } from '@/types/subscription.type';

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSubscription: builder.mutation<
      TResponse<TSubscription>,
      Partial<TSubscription>
    >({
      query: (data) => ({
        url: '/subscriptions/create-subscription',
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const { useAddSubscriptionMutation } = subscriptionApi;
