import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManageProducts from './_components/products';
import ManageServices from './_components/services';

const ManageOfferingPage = async () => {
  return (
    <div>
      <Tabs defaultValue="products" className="w-full max-w-6xl mx-auto">
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
          <ManageProducts />
        </TabsContent>

        <TabsContent value="services" className="mt-2">
          <ManageServices />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageOfferingPage;
