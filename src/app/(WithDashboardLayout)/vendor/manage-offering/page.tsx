import ManageProducts from '@/components/modules/dashboard/vendor/manage-offering/products';
import ManageServices from '@/components/modules/dashboard/vendor/manage-offering/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllServices } from '@/services/Packages';
import { getAllProducts } from '@/services/Product';

const ManageOfferingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    searchTerm?: string;
    createdAt?: string;
  }>;
}) => {
  const query = await searchParams;
  const { page } = query;
  const limit = 10;

  const { data: productData, meta: productMeta } = await getAllProducts(
    page,
    limit,
    query,
  );
  const { data: serviceData, meta: serviceMeta } = await getAllServices(
    page,
    limit,
    query,
  );

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
          <ManageProducts products={productData} meta={productMeta} />
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <ManageServices services={serviceData} meta={serviceMeta} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageOfferingPage;
