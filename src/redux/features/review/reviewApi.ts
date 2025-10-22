import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TReview } from '@/types/review.type';

type TCreateReviewDto = Pick<
  TReview,
  'user' | 'product' | 'service' | 'rating' | 'review'
>;

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addReview: builder.mutation<TResponse<TReview>, TCreateReviewDto>({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
        credentials: 'include',
      }),
      invalidatesTags: ['Review'], // if product stats depend on reviews
    }),

    getAllReviews: builder.query<
      TResponse<TReview[]>,
      {
        id: string; // productId or serviceId
        type: 'product' | 'service'; // specify which type
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ id, type, page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        // Add optional search or date filters
        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }
        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        // Add product or service query param dynamically
        params.append(type, id);

        return {
          url: `/reviews?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Review'],
    }),

    getAllReviewsCollection: builder.query<
      TResponse<TReview[]>,
      {
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        // Add optional search or date filters
        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }
        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/reviews?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Review'],
    }),
  }),
});

export const {
  useAddReviewMutation,
  useGetAllReviewsQuery,
  useGetAllReviewsCollectionQuery,
} = reviewApi;
