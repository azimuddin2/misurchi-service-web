'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorDashboardStatsQuery } from '@/redux/features/dashboard/dashboardApi';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useAppSelector } from '@/redux/hooks';
import { ArrowDown, ArrowUp } from 'lucide-react';
import CountUp from 'react-countup';

const TotalStats = () => {
  const user = useAppSelector(selectCurrentUser);

  const { data: vendorData } = useGetVendorProfileQuery(user?.email as string);
  const vendorId = vendorData?.data?._id as string;

  const { data } = useGetVendorDashboardStatsQuery(vendorId, {
    pollingInterval: 1000,
  });
  const stats = data?.data;

  const totalTransactions = stats?.totalTransactions?.count || 0;
  const totalTransactionsPercent = stats?.totalTransactions?.changePercent || 0;

  const totalBookings = stats?.totalBookings?.count || 0;
  const totalBookingsPercent = stats?.totalBookings?.changePercent || 0;

  const pendingOrders = stats?.pendingOrders?.count || 0;
  const pendingOrdersPercent = stats?.pendingOrders?.changePercent || 0;

  const pendingBookings = stats?.pendingBookings?.count || 0;
  const pendingBookingsPercent = stats?.pendingBookings?.changePercent || 0;

  const PercentBadge = ({ percent }: { percent: number }) => {
    if (percent > 0) {
      return (
        <div className="flex items-center gap-0.5 text-[#165940]">
          <ArrowUp className="w-4 h-4" />
          {percent} %
        </div>
      );
    }
    if (percent < 0) {
      return (
        <div className="flex items-center gap-0.5 text-[#5F1011]">
          <ArrowDown className="w-4 h-4" />
          {Math.abs(percent)} %
        </div>
      );
    }
    return <div className="text-[#7F7F7F]">— 0 %</div>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sora">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
            Total Transactions
            <PercentBadge percent={totalTransactionsPercent} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-semibold text-ns-title">
            $
            <CountUp
              end={totalTransactions}
              duration={1.5}
              decimals={2}
              separator=","
              decimal="."
            />
          </h2>
          <p className="mt-2 text-base font-medium text-[#7F7F7F]">
            Last 30 days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
            Total Bookings
            <PercentBadge percent={totalBookingsPercent} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-semibold text-ns-title">
            <CountUp end={totalBookings} duration={1.5} separator="," />
          </h2>
          <p className="mt-2 text-base font-medium text-[#7F7F7F]">
            Last 30 days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
            Pending Orders
            <PercentBadge percent={pendingOrdersPercent} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-semibold text-ns-title">
            <CountUp end={pendingOrders} duration={1.5} separator="," />
          </h2>
          <p className="mt-2 text-base font-medium text-[#7F7F7F]">
            Last 30 days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
            Pending Bookings
            <PercentBadge percent={pendingBookingsPercent} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-semibold text-ns-title">
            <CountUp end={pendingBookings} duration={1.5} separator="," />
          </h2>
          <p className="mt-2 text-base font-medium text-[#7F7F7F]">
            Last 30 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalStats;
