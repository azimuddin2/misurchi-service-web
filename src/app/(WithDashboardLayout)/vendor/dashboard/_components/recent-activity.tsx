'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'appointment' | 'order';
  title: string;
  time: string;
  with?: string;
  action?: string;
}

const RecentActivity = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'appointment',
      title: 'You have a spa appointment with Lisa',
      time: 'tomorrow at 10:00 AM',
      with: 'Lisa',
    },
    {
      id: '2',
      type: 'order',
      title: 'Order #11258 for Herbal Hair Oil',
      time: 'needs to be packed by 3:00 PM today',
    },
    {
      id: '3',
      type: 'appointment',
      title: 'You have a full-body massage session with James',
      time: 'on Thursday at 2:00 PM',
      with: 'James',
    },
  ];

  return (
    <div className="lg:flex-3/4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          <Link
            href={'/vendor/activity-center'}
            className="text-[#1E90FF] text-sm"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 bg-[#f2f8ff] p-4 border-l-4 border-[#1E90FF] rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivity;
