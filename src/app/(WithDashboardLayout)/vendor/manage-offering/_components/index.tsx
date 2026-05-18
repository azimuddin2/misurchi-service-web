'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import ManageProducts from './products';
import ManageServices from './services';

const ManageOffering = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data } = useGetVendorProfileQuery(user?.email as string);
  const chooseOffer = data?.data?.chooseOffer;

  const defaultTab = chooseOffer === 'services' ? 'services' : 'products';

  return (
    <div>
      <Tabs
        key={chooseOffer}
        defaultValue={defaultTab}
        className="w-full max-w-6xl mx-auto"
      >
        <TabsList
          style={{ background: 'none' }}
          className="flex rounded-md w-full py-5 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
        >
          {chooseOffer !== 'services' && (
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
          )}

          {chooseOffer !== 'products' && (
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
          )}
        </TabsList>

        {chooseOffer !== 'services' && (
          <TabsContent value="products" className="mt-2">
            <ManageProducts />
          </TabsContent>
        )}

        {chooseOffer !== 'products' && (
          <TabsContent value="services" className="mt-2">
            <ManageServices />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ManageOffering;
