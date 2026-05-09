import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SalesHistory from './_components/sales';
import SubscriptionHistory from './_components/subscription';

const TransactionHistoryPage = () => {
  return (
    <div>
      <Tabs defaultValue="sales" className="w-full max-w-6xl mx-auto">
        <TabsList
          style={{ background: 'none' }}
          className="flex rounded-md w-full py-5 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
        >
          {/* Products Tab */}
          <TabsTrigger
            value="sales"
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
            Sales
          </TabsTrigger>

          {/* Services Tab */}
          <TabsTrigger
            value="subscriptions"
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
            Subscriptions
          </TabsTrigger>
        </TabsList>

        {/* Content Panels */}
        <TabsContent value="sales" className="mt-2">
          <SalesHistory />
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-2">
          <SubscriptionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionHistoryPage;
