import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TVendorDashboardStats } from '@/types/dashboard.type';

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendorDashboardStats: builder.query<
      TResponse<TVendorDashboardStats>,
      string
    >({
      query: (id) => ({
        url: `/dashboard/vendor-stats/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Dashboard'],
    }),

    getVendorSalesOverviewChart: builder.query<
      TResponse<any>,
      { id: string; year?: number }
    >({
      query: ({ id, year }) => ({
        url: `/dashboard/vendor-sales-overview/${id}?year=${year}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Dashboard'],
    }),

    getAppointmentsOverviewRate: builder.query<
      TResponse<any>,
      { id: string; month?: number }
    >({
      query: ({ id, month }) => ({
        url: `/dashboard/appointments-overview/${id}?month=${month}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetVendorDashboardStatsQuery,
  useGetVendorSalesOverviewChartQuery,
  useGetAppointmentsOverviewRateQuery,
} = dashboardApi;
