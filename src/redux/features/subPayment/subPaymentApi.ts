import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TSubscription } from '@/types/subPayment.type';

const subPaymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSubPayment: builder.mutation<
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
      invalidatesTags: ['subPayment'],
    }),
  }),
});

export const { useAddSubPaymentMutation } = subPaymentApi;
