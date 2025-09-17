import { TResponse, TVendorUser } from '@/types';
import { baseApi } from '../../api/baseApi';

const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVendorUser: builder.query<
      TResponse<TVendorUser[]>,
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
          url: `/vendors?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Vendor'],
    }),

    getVendorProfile: builder.query<TResponse<TVendorUser>, string>({
      query: (email) => ({
        url: `/vendors/profile/${email}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Vendor'],
    }),

    getVendorUserById: builder.query<TResponse<TVendorUser>, string>({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Vendor'],
    }),

    updateVendorProfile: builder.mutation<
      TResponse<TVendorUser>,
      { email: string; body: FormData }
    >({
      query: ({ email, body }) => ({
        url: `/vendors/profile/${email}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Vendor'],
    }),
  }),
});

export const {
  useGetAllVendorUserQuery,
  useGetVendorProfileQuery,
  useGetVendorUserByIdQuery,
  useUpdateVendorProfileMutation,
} = vendorApi;
