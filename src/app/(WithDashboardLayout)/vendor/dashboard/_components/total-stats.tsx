'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

const TotalStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sora">
      <Card className="border-none shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
            Total Sales
            <div className=" flex items-center gap-0.5 text-[#165940]">
              <ArrowUp className=" w-4 h-4" />
              12 %
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-semibold text-ns-title">$1250.00</h2>
          <p className="mt-2 text-base font-medium text-[#7F7F7F] text-sc-clarity-ice">
            Last 30 days
          </p>
        </CardContent>
      </Card>
      <Card className="border-none shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
            Total Schedule
            <div className="text-lg flex items-center gap-0.5 text-[#5F1011]">
              <ArrowDown className=" w-4 h-4" />
              12 %
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-semibold text-ns-title">$1250.00</h2>
          <p className="mt-2 text-base font-medium text-[#7F7F7F] text-sc-clarity-ice">
            Last 30 days
          </p>
        </CardContent>
      </Card>
      <Card className="border-none shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
            Pending Orders
            <div className="text-lg flex items-center gap-0.5 text-[#5F1011]">
              <ArrowDown className=" w-4 h-4" />
              12 %
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-semibold text-ns-title">200</h2>
          <p className="mt-2 text-base font-medium text-[#7F7F7F] text-sc-clarity-ice">
            Last 30 days
          </p>
        </CardContent>
      </Card>
      <Card className="border-none shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
            Pending Schedule
            <div className=" flex items-center gap-0.5 text-[#165940]">
              <ArrowUp className=" w-4 h-4" />
              12 %
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-semibold text-ns-title">18</h2>
          <p className="mt-2 text-base font-medium text-[#7F7F7F] text-sc-clarity-ice">
            Last 30 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalStats;
