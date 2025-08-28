'use client';

import AllProducts from '@/components/modules/products';
import AllServices from '@/components/modules/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const AllProductsServices = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial tab from params (first load only)
  const initialTab = searchParams.get('tab') || 'products';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Remove the tab param from the URL after reading it
  useEffect(() => {
    if (searchParams.get('tab')) {
      router.replace('/all-products-services'); // clean URL
    }
  }, [searchParams, router]);

  return (
    <div className="container lg:mx-auto my-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          style={{ background: 'none' }}
          className="flex rounded-md w-full py-5 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
        >
          {/* Products Tab */}
          <TabsTrigger
            value="products"
            className="relative w-full cursor-pointer text-[#165940] bg-gray-100 text-lg 
    rounded-md font-medium py-6 transition
    data-[state=active]:text-[#165940] 
    data-[state=active]:shadow
    data-[state=active]:bg-gradient-to-b 
    data-[state=active]:from-[#cadfe7] 
    data-[state=active]:to-[#d9ebe8]
    data-[state=active]:before:absolute
    data-[state=active]:before:inset-0
    data-[state=active]:before:rounded-md
    data-[state=active]:before:bg-gradient-to-t
    data-[state=active]:before:from-[#cadfe7]
    data-[state=active]:before:to-transparent
    data-[state=active]:before:opacity-40
    data-[state=active]:before:content-['']"
          >
            Products
          </TabsTrigger>

          {/* Services Tab */}
          <TabsTrigger
            value="services"
            className="relative w-full cursor-pointer text-[#165940] bg-gray-100 text-lg 
    rounded-md font-medium py-6 transition
    data-[state=active]:text-[#165940] 
    data-[state=active]:shadow
    data-[state=active]:bg-gradient-to-b 
    data-[state=active]:from-[#cadfe7] 
    data-[state=active]:to-[#d9ebe8]
    data-[state=active]:before:absolute
    data-[state=active]:before:inset-0
    data-[state=active]:before:rounded-md
    data-[state=active]:before:bg-gradient-to-t
    data-[state=active]:before:from-[#cadfe7]
    data-[state=active]:before:to-transparent
    data-[state=active]:before:opacity-40
    data-[state=active]:before:content-['']"
          >
            Services
          </TabsTrigger>
        </TabsList>

        {/* Content Panels */}
        <TabsContent value="products" className="mt-2">
          <AllProducts />
        </TabsContent>

        <TabsContent value="services" className="mt-2">
          <AllServices />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllProductsServices;
