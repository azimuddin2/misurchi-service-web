'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TPendingOrder } from '@/types/dashboard.type';
import { Dot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type TPendingOrdersProps = {
  pendingOrders: TPendingOrder[];
};

const PendingOrders = ({ pendingOrders }: TPendingOrdersProps) => {
  return (
    <Card className="w-full mt-5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Pending Orders</CardTitle>
        <Link
          href={'/vendor/activity-center'}
          className="text-[#1E90FF] text-sm hover:underline"
        >
          View All
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        {pendingOrders && pendingOrders.length > 0 ? (
          pendingOrders.map((order) => (
            <div
              key={order._id}
              className="flex items-start gap-4 bg-[#fffefb] p-4 border-l-4 border-[#fff9e6] rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{order.orderId}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground flex">
                    <span>{order.customerName}</span>
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Dot size={20} />{' '}
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </p>
                </div>
              </div>
              <div className="bg-[#fff9e6] text-sm py-2 px-4 rounded-sm text-[#6B5103] capitalize">
                {order.status}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-center text-muted-foreground py-4 h-[200px]">
            <Image
              src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              alt="No results"
              width={100}
              height={100}
              className="mx-auto"
            />
            <p>No Pending Orders Available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingOrders;
