'use client';

import { useAppSelector } from '@/redux/hooks';
import AppointmentsOverviewRate from './appointments-overview-rate';
import PendingOrders from './pending-orders';
import RecentActivity from './recent-activity';
import SalesOverviewChart from './sales-overview-chart';
import TotalStats from './total-stats';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorDashboardDataQuery } from '@/redux/features/dashboard/dashboardApi';
import {
  TPendingBooking,
  TPendingOrder,
  TRecentActivity,
} from '@/types/dashboard.type';
import PendingBookings from './pending-bookings';

const Dashboard = () => {
  const user = useAppSelector(selectCurrentUser);
  const vendorId = user?.vendorId as string;

  const { data } = useGetVendorDashboardDataQuery(
    { id: vendorId },
    {
      pollingInterval: 1000,
    },
  );
  const dashboardData = data?.data;

  const pendingOrders: TPendingOrder[] = dashboardData?.pendingOrders || [];
  const pendingBookings: TPendingBooking[] =
    dashboardData?.pendingBookings || [];
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
      <PendingBookings pendingBookings={pendingBookings} />
    </div>
  );
};

export default Dashboard;
