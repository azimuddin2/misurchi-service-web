import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TProduct } from '@/types/product.type';

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation<TResponse<TProduct>, FormData>({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
      invalidatesTags: ['Product'],
    }),

    getAllProducts: builder.query<
      TResponse<TProduct[]>,
      {
        userId: string;
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ userId, page = 1, limit = 10, query }) => {
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
          url: `/products?user=${userId}&page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Product'],
    }),

    getProductById: builder.query<TResponse<TProduct>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Product'],
    }),

    updateProduct: builder.mutation<
      TResponse<TProduct>, // Response type
      { id: string; body: FormData } // Arg type
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Product'],
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
      invalidatesTags: ['Product'],
    }),

    productHighlightStatus: builder.mutation<
      TResponse<TProduct>,
      { id: string; highlightStatus: { highlightStatus: string } }
    >({
      query: ({ id, highlightStatus }) => ({
        url: `/products/highlight-status/${id}`,
        method: 'PUT',
        body: highlightStatus,
        credentials: 'include',
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation<TResponse<TProduct>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useProductHighlightStatusMutation,
  useDeleteProductMutation,
} = productApi;
