import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TNotification } from '@/types/notification.type';

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get all notifications
    getAllNotifications: builder.query<
      TResponse<TNotification[]>,
      {
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/notifications?page=${page}&limit=${limit}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Notification'],
    }),

    // 🔹 Mark notifications as read
    markAsDone: builder.mutation<TResponse<any>, void>({
      query: () => ({
        url: `/notifications`,
        method: 'PATCH',
        credentials: 'include',
      }),
      invalidatesTags: ['Notification'],
    }),

    // 🔹 Delete all notifications
    deleteNotifications: builder.mutation<TResponse<any>, void>({
      query: () => ({
        url: `/notifications`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useMarkAsDoneMutation,
  useDeleteNotificationsMutation,
} = notificationApi;
