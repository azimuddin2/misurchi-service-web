import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TServiceType } from '@/types/service.type';

const serviceTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addServiceType: builder.mutation<
      TResponse<TServiceType>,
      Partial<TServiceType>
    >({
      query: (data) => ({
        url: '/service-type',
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['ServiceType'],
    }),

    getAllServiceType: builder.query<
      TResponse<TServiceType[]>,
      {
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/service-type?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['ServiceType'],
    }),

    getServiceTypeById: builder.query<TResponse<TServiceType>, string>({
      query: (id) => ({
        url: `/service-type/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['ServiceType'],
    }),

    updateServiceType: builder.mutation<
      TResponse<TServiceType>,
      { id: string; data: Partial<TServiceType> }
    >({
      query: ({ id, data }) => ({
        url: `/service-type/${id}`,
        method: 'PATCH',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['ServiceType'],
    }),

    deleteServiceType: builder.mutation<TResponse<TServiceType>, string>({
      query: (id) => ({
        url: `/service-type/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['ServiceType'],
    }),
  }),
});

export const {
  useAddServiceTypeMutation,
  useGetAllServiceTypeQuery,
  useGetServiceTypeByIdQuery,
  useUpdateServiceTypeMutation,
  useDeleteServiceTypeMutation,
} = serviceTypeApi;
