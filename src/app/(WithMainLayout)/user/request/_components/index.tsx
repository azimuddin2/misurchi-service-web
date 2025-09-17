import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrdersRequest from './orders-request';
import BookingsRequest from './bookings-request';

const MyRequest = () => {
  return (
    <div>
      <Tabs defaultValue="orders">
        <TabsList
          style={{ background: 'none' }}
          className="flex rounded-md w-full py-5 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
        >
          {/* Orders Tab */}
          <TabsTrigger
            value="orders"
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
            Product Order Request
          </TabsTrigger>

          {/* Bookings Tab */}
          <TabsTrigger
            value="bookings"
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
            Service Booking Request
          </TabsTrigger>
        </TabsList>

        {/* Content Panels */}
        <TabsContent value="orders" className="mt-2">
          <OrdersRequest />
        </TabsContent>

        <TabsContent value="bookings" className="mt-2">
          <BookingsRequest />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyRequest;
