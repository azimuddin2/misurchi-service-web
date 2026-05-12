import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TTask } from '@/types/task.type';

const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTask: builder.mutation<TResponse<TTask>, Partial<TTask>>({
      query: (taskData) => ({
        url: '/tasks',
        method: 'POST',
        body: taskData,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Task'],
    }),

    getAllTasks: builder.query<
      TResponse<TTask[]>,
      {
        vendorId: string;
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ vendorId, page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/tasks?vendor=${vendorId}&page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Task'],
    }),

    getTasksByTeamMemberId: builder.query<
      TResponse<TTask[]>,
      {
        userId: string;
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ userId, page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/tasks/member/${userId}?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Task'],
    }),

    getTaskById: builder.query<TResponse<TTask>, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Task'],
    }),

    updateTask: builder.mutation<
      TResponse<TTask>,
      { id: string; body: Partial<TTask> }
    >({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body, // send JSON
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Task'],
    }),

    updateTaskStatus: builder.mutation<
      TResponse<TTask>,
      { id: string; status: { status: string; note?: string } }
    >({
      query: ({ id, status }) => ({
        url: `/tasks/update-status/${id}`,
        method: 'PUT',
        body: status,
        credentials: 'include',
      }),
      invalidatesTags: ['Task'],
    }),

    deleteTask: builder.mutation<TResponse<TTask>, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useAddTaskMutation,
  useGetAllTasksQuery,
  useGetTasksByTeamMemberIdQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = taskApi;
