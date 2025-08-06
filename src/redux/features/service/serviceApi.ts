import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TService } from '@/types/service.type';

const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation<TResponse<TService>, Partial<TService>>({
      query: (serviceInfo) => ({
        url: '/services',
        method: 'POST',
        body: serviceInfo,
        credentials: 'include',
      }),
      invalidatesTags: ['Service'],
    }),

    getAllServices: builder.query<
      TResponse<TService[]>,
      {
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        if (query?.price) {
          params.append('minPrice', '0');
          params.append('maxPrice', query.price.toString());
        }

        if (query?.category) {
          params.append('category', query.category.toString());
        }

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/services?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Service'],
    }),

    updateServiceStatus: builder.mutation<
      TResponse<TService>,
      { id: string; status: { status: string } }
    >({
      query: ({ id, status }) => ({
        url: `/services/update-status/${id}`,
        method: 'PUT',
        body: status,
        credentials: 'include',
      }),
      invalidatesTags: ['Service'],
    }),

    serviceHighlightStatus: builder.mutation<
      TResponse<TService>,
      { id: string; highlightStatus: { highlightStatus: string } }
    >({
      query: ({ id, highlightStatus }) => ({
        url: `/services/highlight-status/${id}`,
        method: 'PUT',
        body: highlightStatus,
        credentials: 'include',
      }),
      invalidatesTags: ['Service'],
    }),

    deleteService: builder.mutation<TResponse<TService>, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Service'],
    }),
  }),
});

export const {
  useAddServiceMutation,
  useGetAllServicesQuery,
  useUpdateServiceStatusMutation,
  useServiceHighlightStatusMutation,
  useDeleteServiceMutation,
} = serviceApi;
