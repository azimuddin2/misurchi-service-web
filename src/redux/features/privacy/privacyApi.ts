import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TPrivacy } from '@/types/privacy.type';

const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get single privacy
    getPrivacy: builder.query<TResponse<TPrivacy>, void>({
      query: () => ({
        url: '/privacy',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Privacy'],
    }),
  }),
});

export const { useGetPrivacyQuery } = privacyApi;
