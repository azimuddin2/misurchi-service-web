'use client';

import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useGetAppointmentsOverviewRateQuery } from '@/redux/features/dashboard/dashboardApi';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getPathColor = (rate: number) => {
  if (rate >= 70) return '#0D3C6B';
  if (rate >= 40) return '#facc15';
  return '#ef4444';
};

const AppointmentsOverviewRate = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: vendorData } = useGetVendorProfileQuery(user?.email ?? '');
  const vendorId = vendorData?.data?._id as string;

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );

  const { data, isLoading } = useGetAppointmentsOverviewRateQuery(
    { id: vendorId, month: selectedMonth },
    { pollingInterval: 1000, skip: !vendorId },
  );

  const bookings = data?.data?.bookings ?? {
    total: 0,
    completed: 0,
    completionRate: 0,
  };
  const orders = data?.data?.orders ?? {
    total: 0,
    completed: 0,
    completionRate: 0,
  };

  return (
    <div className="lg:flex-2/5 mt-4 lg:mt-0">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center gap-2">
          <CardTitle className="text-lg font-semibold text-center">
            Monthly Overview
          </CardTitle>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(Number(value))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="flex justify-center gap-8">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              {/* Bookings */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Bookings
                </p>
                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={bookings.completionRate}
                    text={`${bookings.completionRate.toFixed(1)}%`}
                    styles={buildStyles({
                      textColor: '#111',
                      pathColor: getPathColor(bookings.completionRate),
                      trailColor: '#e5e7eb',
                      textSize: '18px',
                    })}
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Total: {bookings.total}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Completed: {bookings.completed}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px bg-border self-stretch" />

              {/* Orders */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Orders
                </p>
                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={orders.completionRate}
                    text={`${orders.completionRate.toFixed(1)}%`}
                    styles={buildStyles({
                      textColor: '#111',
                      pathColor: getPathColor(orders.completionRate),
                      trailColor: '#e5e7eb',
                      textSize: '18px',
                    })}
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Total: {orders.total}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Delivered: {orders.completed}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsOverviewRate;
