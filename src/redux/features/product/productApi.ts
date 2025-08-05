import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TProduct } from '@/types/product.type';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation<TResponse<TProduct>, Partial<TProduct>>({
      query: (productInfo) => ({
        url: '/products',
        method: 'POST',
        body: productInfo,
        credentials: 'include',
      }),
    }),

    getAllProducts: builder.query<
      TResponse<TProduct[]>,
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
          url: `/products?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
    }),

    updateProductStatus: builder.mutation<
      TResponse<TProduct>,
      { id: string; status: { status: string } }
    >({
      query: ({ id, status }) => ({
        url: `/products/update-status/${id}`,
        method: 'PUT',
        body: status,
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useUpdateProductStatusMutation,
} = authApi;
