import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TReferralLink, TReferralStats } from '@/types/referral.type';

const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferralLink: builder.query<TResponse<TReferralLink>, void>({
      query: () => ({
        url: '/referral/referral-link',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Referral'],
    }),

    getReferralStats: builder.query<
      TResponse<TReferralStats>,
      { month?: string }
    >({
      query: ({ month } = {}) => {
        const params = new URLSearchParams();
        if (month) params.append('month', month);
        return {
          url: `/referral/stats?${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Referral'],
    }),

    emailReferralLink: builder.mutation<
      TResponse<null>,
      { recipientEmail: string }
    >({
      query: (data) => ({
        url: '/referral/email',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useGetReferralLinkQuery,
  useGetReferralStatsQuery,
  useEmailReferralLinkMutation,
} = referralApi;
