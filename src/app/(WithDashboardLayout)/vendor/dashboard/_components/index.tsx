'use client';

import RecentActivity from './recent-activity';
import SalesOverviewChart from './sales-overview-chart';
import TotalStats from './total-stats';

const Dashboard = () => {
  return (
    <div>
      <TotalStats />
      <SalesOverviewChart />
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
