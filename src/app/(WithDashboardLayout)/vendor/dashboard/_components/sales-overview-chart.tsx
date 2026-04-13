'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useGetVendorSalesOverviewChartQuery } from '@/redux/features/dashboard/dashboardApi';

const SalesOverviewChart = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: vendorData } = useGetVendorProfileQuery(user?.email ?? '');
  const vendorId = vendorData?.data?._id;

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
  ];

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const { data: chartResponse, isLoading } =
    useGetVendorSalesOverviewChartQuery(
      {
        id: vendorId as string,
        year: selectedYear,
      },
      { skip: !vendorId },
    );

  const chartData = Array.isArray(chartResponse?.data?.chart)
    ? chartResponse.data.chart.map((item: any) => ({
        month: item.month,
        value: item.sales,
      }))
    : [];

  return (
    <div className="w-full space-y-6 my-5">
      <div className="rounded-lg border border-gray-200 bg-cc-card-bg p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Annual Overview
          </h3>
          <Select
            value={selectedYear.toString()}
            onValueChange={(val) => setSelectedYear(Number(val))}
          >
            <SelectTrigger className="w-[100px] rounded-md border border-gray-200 bg-cc-card-bg px-3 py-1.5 text-xs font-medium text-cc-bold-text hover:bg-gray-50">
              <SelectValue placeholder="Filter Year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center text-sm text-gray-500">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              />
              <Bar
                dataKey="value"
                fill="#0D3C6B"
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesOverviewChart;
