'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useGetAppointmentsOverviewRateQuery } from '@/redux/features/dashboard/dashboardApi';

const AppointmentsOverviewRate = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: vendorData } = useGetVendorProfileQuery(user?.email ?? '');
  const vendorId = vendorData?.data?._id as string;

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );

  const { data, isLoading } = useGetAppointmentsOverviewRateQuery(
    { id: vendorId, month: selectedMonth },
    { skip: !vendorId },
  );

  const rate = data?.data?.completionRate ?? 0;
  const total = data?.data?.total ?? 0;
  const completed = data?.data?.completed ?? 0;

  // Month options
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

  return (
    <div className="lg:flex-2/5 mt-4 lg:mt-0">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center gap-2">
          <CardTitle className="text-md font-semibold text-center">
            Monthly Appointment Completion
          </CardTitle>

          {/* Month Selector */}
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

        <CardContent className="flex flex-col items-center justify-center gap-4">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={rate}
                  text={`${rate.toFixed(1)}%`}
                  styles={buildStyles({
                    textColor: '#111',
                    pathColor:
                      rate >= 70
                        ? '#0D3C6B'
                        : rate >= 40
                          ? '#facc15'
                          : '#ef4444',
                    trailColor: '#e5e7eb',
                  })}
                />
              </div>

              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">
                  Total Appointments: {total}
                </p>
                <p className="text-sm text-muted-foreground">
                  Completed: {completed}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsOverviewRate;
