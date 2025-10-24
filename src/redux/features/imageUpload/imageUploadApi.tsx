import { baseApi } from '@/redux/api/baseApi';

export const imageUploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/upload/images', // ✅ backend route
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = imageUploadApi;
