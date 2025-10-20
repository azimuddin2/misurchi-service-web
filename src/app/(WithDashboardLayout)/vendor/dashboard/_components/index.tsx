'use client';

import { useAppSelector } from '@/redux/hooks';
import AppointmentsOverviewRate from './appointments-overview-rate';
import PendingOrders from './pending-orders';
import RecentActivity from './recent-activity';
import SalesOverviewChart from './sales-overview-chart';
import TodayAppointments from './today-appointments';
import TotalStats from './total-stats';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useGetVendorDashboardDataQuery } from '@/redux/features/dashboard/dashboardApi';
import {
  TPendingOrder,
  TRecentActivity,
  TTodayBooking,
} from '@/types/dashboard.type';

const Dashboard = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: vendorData } = useGetVendorProfileQuery(user?.email ?? '');
  const vendorId = vendorData?.data?._id as string;

  const { data } = useGetVendorDashboardDataQuery({ id: vendorId });
  const dashboardData = data?.data;

  const pendingOrders: TPendingOrder[] = dashboardData?.pendingOrders || [];
  const todayBookings: TTodayBooking[] = dashboardData?.todayBookings || [];
  const recentActivity: TRecentActivity[] = dashboardData?.recentActivity || [];

  return (
    <div>
      <TotalStats />
      <SalesOverviewChart />
      <div className="lg:flex items-center gap-4">
        <RecentActivity recentActivity={recentActivity} />
        <AppointmentsOverviewRate />
      </div>
      <PendingOrders pendingOrders={pendingOrders} />
      <TodayAppointments todayBookings={todayBookings} />
    </div>
  );
};

export default Dashboard;
