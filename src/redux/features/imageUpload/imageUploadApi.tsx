import { baseApi } from '@/redux/api/baseApi';

const imageUploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (data) => ({
        url: '/imageUpload/create-imageUpload',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = imageUploadApi;
