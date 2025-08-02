import ManageProducts from '@/components/modules/dashboard/vendor/manage-offering/products';
import ManageServices from '@/components/modules/dashboard/vendor/manage-offering/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ManageOfferingPage = () => {
  return (
    <div>
      <Tabs defaultValue="products" className="w-full max-w-5xl mx-auto mt-6">
        <TabsList className="flex rounded-md shadow-md w-full">
          {/* Products Tab */}
          <TabsTrigger
            value="products"
            className="w-full text-[#165940] text-lg rounded-md font-medium py-5 transition 
            data-[state=active]:bg-gradient-to-t 
            data-[state=active]:from-green-500/70 
            data-[state=active]:to-green-800 
            data-[state=active]:text-white 
            data-[state=active]:shadow"
          >
            Products
          </TabsTrigger>

          {/* Services Tab */}
          <TabsTrigger
            value="services"
            className="w-full cursor-pointer text-[#165940] text-lg rounded-md font-medium py-5 transition 
            data-[state=active]:bg-gradient-to-t 
            data-[state=active]:from-green-500/70 
            data-[state=active]:to-green-800 
            data-[state=active]:text-white 
            data-[state=active]:shadow"
          >
            Services
          </TabsTrigger>
        </TabsList>

        {/* Content Panels */}
        <TabsContent value="products" className="mt-4">
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
