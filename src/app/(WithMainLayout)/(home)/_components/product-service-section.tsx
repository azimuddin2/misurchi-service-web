'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Products from './products';
import Services from './services';

const ProductServiceSection = () => {
  return (
    <div className="container lg:mx-auto">
      <h1 className="text-[#000000] text-4xl font-semibold text-center">
        Our Top Rated Services & Products
      </h1>
      <p className="text-center text-[#212529] mb-8 mt-3">
        Count on us as your trusted partner for exceptional solutions that meet
        all your needs. Whether <br /> you’re looking for products to enhance
        your lifestyle or services that help you thrive.
      </p>
      <Tabs defaultValue="products">
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
          <Products />
        </TabsContent>

        <TabsContent value="services" className="mt-2">
          <Services />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductServiceSection;
