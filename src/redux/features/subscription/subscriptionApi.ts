import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TSubscription } from '@/types/subscription.type';

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSubscription: builder.mutation<
      TResponse<TSubscription>,
      Partial<TSubscription>
    >({
      query: (taskData) => ({
        url: '/subscriptions/create-subscription',
        method: 'POST',
        body: taskData,
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
