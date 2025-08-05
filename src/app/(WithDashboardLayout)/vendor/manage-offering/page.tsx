import ManageProducts from '@/components/modules/dashboard/vendor/manage-offering/products';
import ManageServices from '@/components/modules/dashboard/vendor/manage-offering/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ManageOfferingPage = async () => {
  return (
    <div>
      <Tabs defaultValue="products" className="w-full max-w-6xl mx-auto">
        <TabsList className="flex rounded-md shadow-md w-full py-6">
          {/* Products Tab */}
          <TabsTrigger
            value="products"
            className="w-full cursor-pointer text-[#165940] text-lg rounded-md font-medium py-6 transition 
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
            className="w-full cursor-pointer text-[#165940] text-lg rounded-md font-medium py-6 transition 
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
          <ManageProducts />
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <ManageServices />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageOfferingPage;
