import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrdersRequest from './order-request';
import BookingsRequest from './booking-request';

const MyRequest = () => {
  return (
    <div className="px-3 lg:px-0">
      <Tabs defaultValue="orders">
        {/* ✅ Always flex (even on mobile), full width, compact padding */}
        <TabsList
          style={{ background: 'none' }}
          className="flex rounded-md w-full max-w-6xl gap-2 mx-auto shadow-none p-0 h-auto"
        >
          {/* Orders Tab */}
          <TabsTrigger
            value="orders"
            className="
              relative flex-1 cursor-pointer text-[#165940] bg-gray-100
              text-sm sm:text-base lg:text-lg
              rounded-md font-medium
              py-3 sm:py-4 lg:py-3
              transition-all duration-200
              data-[state=active]:text-[#165940]
              data-[state=active]:shadow
              data-[state=active]:bg-gradient-to-b
              data-[state=active]:from-[#cadfe7]
              data-[state=active]:to-[#d9ebe8]
            "
          >
            {/* ✅ Two-line on mobile, one-line on desktop */}
            <span className="block sm:hidden text-center leading-tight">
              Product Order
              <br />
              Request
            </span>
            <span className="hidden sm:block">Product Order Request</span>
          </TabsTrigger>

          {/* Bookings Tab */}
          <TabsTrigger
            value="bookings"
            className="
              relative flex-1 cursor-pointer text-[#165940] bg-gray-100
              text-sm sm:text-base lg:text-lg
              rounded-md font-medium
              py-3 sm:py-4 lg:py-3
              transition-all duration-200
              data-[state=active]:text-[#165940]
              data-[state=active]:shadow
              data-[state=active]:bg-gradient-to-b
              data-[state=active]:from-[#cadfe7]
              data-[state=active]:to-[#d9ebe8]
            "
          >
            <span className="block sm:hidden text-center leading-tight">
              Service Booking
              <br />
              Request
            </span>
            <span className="hidden sm:block">Service Booking Request</span>
          </TabsTrigger>
        </TabsList>

        {/* Content Panels */}
        <TabsContent value="orders" className="mt-3">
          <OrdersRequest />
        </TabsContent>

        <TabsContent value="bookings" className="mt-3">
          <BookingsRequest />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyRequest;
