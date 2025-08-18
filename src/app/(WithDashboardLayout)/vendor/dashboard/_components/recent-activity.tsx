"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActivityItem {
    id: string;
    type: "appointment" | "order";
    title: string;
    time: string;
    with?: string;
    action?: string;
}

const RecentActivity = () => {
    const activities: ActivityItem[] = [
        {
            id: "1",
            type: "appointment",
            title: "You have a spa appointment with Lisa",
            time: "tomorrow at 10:00 AM",
            with: "Lisa",
        },
        {
            id: "2",
            type: "order",
            title: "Order #11258 for Herbal Hair Oil",
            time: "needs to be packed by 3:00 PM today",
            action: "Pack now",
        },
        {
            id: "3",
            type: "appointment",
            title: "You have a full-body massage session with James",
            time: "on Thursday at 2:00 PM",
            with: "James",
        },
    ];

    return (
        <div>
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm">
                        View All
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4">
                            <div className="flex-1">
                                <p className="text-sm font-medium">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.time}</p>
                            </div>
                            {activity.action && (
                                <Button variant="outline" size="sm">
                                    {activity.action}
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default RecentActivity;