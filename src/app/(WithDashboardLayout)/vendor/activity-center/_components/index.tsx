'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManageOrderProducts from './order-product';
import ManageBookingServices from './booking-service';

const ActivityCenter = () => {
  return (
    <Tabs defaultValue="products" className="w-full max-w-6xl mx-auto">
      <TabsList
        style={{ background: 'none' }}
        className="flex rounded-md w-full py-5 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
      >
        {/* Products Tab */}
        <TabsTrigger
          value="products"
          className="w-full cursor-pointer text-[#165940] bg-gray-100 text-lg rounded-md font-medium py-6 transition 
            data-[state=active]:bg-gradient-to-t 
            data-[state=active]:from-[#cadfe7] 
            data-[state=active]:to-[#d9ebe8] 
            data-[state=active]:text-[#165940] 
            data-[state=active]:shadow"
        >
          Products
        </TabsTrigger>

        {/* Services Tab */}
        <TabsTrigger
          value="services"
          className="w-full cursor-pointer text-[#165940] bg-gray-100 text-lg rounded-md font-medium py-6 transition 
            data-[state=active]:bg-gradient-to-t 
            data-[state=active]:from-[#cadfe7] 
            data-[state=active]:to-[#d9ebe8] 
            data-[state=active]:text-[#165940] 
            data-[state=active]:shadow"
        >
          Services
        </TabsTrigger>
      </TabsList>

      {/* Content Panels */}
      <TabsContent value="products" className="mt-2">
        <ManageOrderProducts />
      </TabsContent>

      <TabsContent value="services" className="mt-2">
        <ManageBookingServices />
      </TabsContent>
    </Tabs>
  );
};

export default ActivityCenter;
