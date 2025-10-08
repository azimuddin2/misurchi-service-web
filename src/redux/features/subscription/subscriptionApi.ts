import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TSubscriptionPlan } from '@/types/subscription.type';

const subscriptionPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptionPlans: builder.query<TResponse<TSubscriptionPlan[]>, any>({
      query: () => ({
        url: `/plans`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['SubscriptionPlan'],
    }),

    getSubscriptionPlanById: builder.query<
      TResponse<TSubscriptionPlan>,
      string
    >({
      query: (id) => ({
        url: `/plans/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['SubscriptionPlan'],
    }),
  }),
});

export const {
  useGetAllSubscriptionPlansQuery,
  useGetSubscriptionPlanByIdQuery,
} = subscriptionPlanApi;
