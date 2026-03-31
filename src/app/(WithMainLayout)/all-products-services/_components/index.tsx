'use client';

import AllProducts from '@/components/modules/products';
import AllServices from '@/components/modules/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const BASE_PATH = '/all-products-services';

const TAB_CLASS = `
  relative w-full cursor-pointer text-[#165940] bg-gray-100 text-lg 
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
  data-[state=active]:before:content-['']
`.trim();

const TABS = [
  { value: 'products', label: 'Products', content: <AllProducts /> },
  { value: 'services', label: 'Services', content: <AllServices /> },
] as const;

type TabValue = (typeof TABS)[number]['value'];

const AllProductsServices = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabValue>(
    (searchParams.get('tab') as TabValue) || 'products',
  );

  // ✅ First load: clean ?tab= from URL
  useEffect(() => {
    if (searchParams.get('tab')) {
      router.replace(BASE_PATH);
    }
  }, [searchParams, router]);

  // ✅ Tab change: clear ALL params
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
    router.push(BASE_PATH);
  };

  return (
    <div className="container lg:mx-auto my-10">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList
          style={{ background: 'none' }}
          className="flex rounded-md w-full py-5 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
        >
          {TABS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className={TAB_CLASS}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(({ value, content }) => (
          <TabsContent key={value} value={value} className="mt-2">
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AllProductsServices;
