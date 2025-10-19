'use client';

import AppointmentsOverviewRate from './appointments-overview-rate';
import PendingOrders from './pending-orders';
import RecentActivity from './recent-activity';
import SalesOverviewChart from './sales-overview-chart';
import TotalStats from './total-stats';

const Dashboard = () => {
  return (
    <div>
      <TotalStats />
      <SalesOverviewChart />
      <div className="lg:flex gap-4">
        <RecentActivity />

        <AppointmentsOverviewRate />
      </div>
      <PendingOrders />
    </div>
  );
};

export default Dashboard;
