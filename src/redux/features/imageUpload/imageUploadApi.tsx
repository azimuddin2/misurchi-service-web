import { baseApi } from '@/redux/api/baseApi';

const imageUploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/upload-images',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = imageUploadApi;
