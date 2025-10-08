import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TProductType } from '@/types/product.type';

const productTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProductType: builder.mutation<
      TResponse<TProductType>,
      Partial<TProductType>
    >({
      query: (data) => ({
        url: '/product-type',
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['ProductType'],
    }),

    getAllProductType: builder.query<
      TResponse<TProductType[]>,
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
          url: `/product-type?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['ProductType'],
    }),

    getProductTypeById: builder.query<TResponse<TProductType>, string>({
      query: (id) => ({
        url: `/product-type/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['ProductType'],
    }),

    updateProductType: builder.mutation<
      TResponse<TProductType>,
      { id: string; data: Partial<TProductType> }
    >({
      query: ({ id, data }) => ({
        url: `/product-type/${id}`,
        method: 'PATCH',
        body: data, // send JSON
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['ProductType'],
    }),

    deleteProductType: builder.mutation<TResponse<TProductType>, string>({
      query: (id) => ({
        url: `/product-type/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['ProductType'],
    }),
  }),
});

export const {
  useAddProductTypeMutation,
  useGetAllProductTypeQuery,
  useGetProductTypeByIdQuery,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
} = productTypeApi;
