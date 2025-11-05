import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TNotification } from '@/types/notification.type';

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get all notifications
    getAllNotifications: builder.query<
      TResponse<TNotification[]>,
      {
        receiver: string;
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ page = 1, limit = 10, receiver }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        if (receiver) {
          params.append('receiver', receiver); // pass userId in query
        }

        return {
          url: `/notifications?${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Notification'],
    }),

    getNotificationById: builder.query<TResponse<TNotification>, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
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
  useGetNotificationByIdQuery,
  useMarkAsDoneMutation,
  useDeleteNotificationsMutation,
} = notificationApi;
