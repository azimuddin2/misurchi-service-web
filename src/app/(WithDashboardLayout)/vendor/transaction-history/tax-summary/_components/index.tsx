'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Spinner from '@/components/shared/Spinner';
import EmptyState from './empty-state';
import SalesSummaryCard from './sales-summary-Card';
import SubscriptionSummaryCard from './subscription-summary-card';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { TVendorUser } from '@/types';
import {
  TSalesTaxSummary,
  TSubscriptionTaxSummary,
} from '@/types/taxSummary.type';
import {
  useGetSalesTaxSummaryQuery,
  useGetSubscriptionTaxSummaryQuery,
} from '@/redux/features/taxSummary/taxSummaryApi';

const TaxSummaryReport = () => {
  const user = useAppSelector(selectCurrentUser);
  const vendorId = user?.vendorId as string;

  const { data } = useGetVendorProfileQuery(user?.vendorEmail as string);
  const vendorUser: TVendorUser | undefined = data?.data;

  const vendorName = vendorUser?.businessName || 'Vendor';

  const { data: salesData, isLoading: salesLoading } =
    useGetSalesTaxSummaryQuery({ vendorId });

  const { data: subData, isLoading: subLoading } =
    useGetSubscriptionTaxSummaryQuery({ vendorId });

  const salesSummaries: TSalesTaxSummary[] = salesData?.data || [];
  const subSummaries: TSubscriptionTaxSummary[] = subData?.data || [];

  if (salesLoading || subLoading) return <Spinner />;

  return (
    <Tabs defaultValue="sales" className="w-full max-w-6xl mx-auto">
      {/* Tabs */}
      <TabsList
        style={{ background: 'none' }}
        className="flex rounded-md w-full py-5 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
      >
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

        <TabsTrigger
          value="subscription"
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
          Subscription
        </TabsTrigger>
      </TabsList>

      {/* Header */}
      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-xl font-medium">Tax Summary Report</h2>
      </div>

      {/* Sales Tab Content */}
      <TabsContent value="sales" className="mt-2">
        <div className="flex flex-col gap-4">
          {salesSummaries.length === 0 ? (
            <EmptyState message="No sales tax summary found." />
          ) : (
            salesSummaries.map((summary) => (
              <SalesSummaryCard
                key={summary.year}
                summary={summary}
                vendorName={vendorName}
              />
            ))
          )}
        </div>
      </TabsContent>

      {/* Subscription Tab Content */}
      <TabsContent value="subscription" className="mt-2">
        <div className="flex flex-col gap-4">
          {subSummaries.length === 0 ? (
            <EmptyState message="No subscription summary found." />
          ) : (
            subSummaries.map((summary) => (
              <SubscriptionSummaryCard key={summary._id} summary={summary} />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TaxSummaryReport;
