'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TRecentActivity } from '@/types/dashboard.type';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

type TRecentActivityProps = {
  recentActivity: TRecentActivity[];
};

const RecentActivity = ({ recentActivity }: TRecentActivityProps) => {
  return (
    <div className="lg:flex-3/4">
      <Card className="w-full h-[380px] ">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          <Link
            href="/vendor/activity-center"
            className="text-[#1E90FF] text-sm hover:underline"
          >
            View All
          </Link>
        </CardHeader>

        <CardContent className="space-y-2">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div
                key={activity._id || `${activity.type}-${activity.createdAt}`}
                className="flex items-start gap-4 bg-[#f2f8ff] p-4 border-l-4 border-[#b9ddff] rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {activity.type === 'order'
                      ? `Order placed by ${activity.name}`
                      : `Booking by ${activity.name} for ${activity.service}`}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {activity.type === 'order' && activity.amount
                      ? `Amount: $${activity.amount}`
                      : activity.date && activity.time
                        ? `Date: ${activity.date} | Time: ${activity.time}`
                        : ''}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4 ">
              <Image
                src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                alt="No results"
                width={100}
                height={100}
                className="mx-auto"
              />
              <p> No recent activity found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivity;
