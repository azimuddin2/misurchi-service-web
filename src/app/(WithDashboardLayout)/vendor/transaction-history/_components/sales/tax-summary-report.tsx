'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import {
  useGetSalesTaxSummaryQuery,
  useGetSubscriptionTaxSummaryQuery,
} from '@/redux/features/payment/paymentApi';
import Spinner from '@/components/shared/Spinner';
import { format } from 'date-fns';
import {
  TSalesTaxSummary,
  TSubscriptionTaxSummary,
} from '@/types/payment.type';

const TaxSummaryReport = () => {
  const user = useAppSelector(selectCurrentUser);
  const vendorId = user?.vendorId as string;
  const vendorName = user?.name || 'Studio';

  const [activeTab, setActiveTab] = useState<'Sales' | 'Subscription'>('Sales');

  const { data: salesData, isLoading: salesLoading } =
    useGetSalesTaxSummaryQuery({ vendorId });

  const { data: subData, isLoading: subLoading } =
    useGetSubscriptionTaxSummaryQuery({ vendorId });

  const salesSummaries: TSalesTaxSummary[] = salesData?.data || [];
  const subSummaries: TSubscriptionTaxSummary[] = subData?.data || [];

  const isLoading = activeTab === 'Sales' ? salesLoading : subLoading;

  if (isLoading) return <Spinner />;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mt-5">
        <button
          onClick={() => setActiveTab('Sales')}
          className={`px-8 py-2 rounded font-medium text-sm transition-colors ${
            activeTab === 'Sales'
              ? 'bg-[#003250] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Sales
        </button>
        <button
          onClick={() => setActiveTab('Subscription')}
          className={`px-8 py-2 rounded font-medium text-sm transition-colors ${
            activeTab === 'Subscription'
              ? 'bg-[#003250] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Subscription
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mt-10 mb-6">
        <h2 className="text-xl font-medium">Tax Summary Report</h2>
      </div>

      {/* Sales Tab */}
      {activeTab === 'Sales' && (
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
      )}

      {/* Subscription Tab */}
      {activeTab === 'Subscription' && (
        <div className="flex flex-col gap-4">
          {subSummaries.length === 0 ? (
            <EmptyState message="No subscription summary found." />
          ) : (
            subSummaries.map((summary) => (
              <SubscriptionSummaryCard
                key={summary._id}
                summary={summary}
                vendorName={vendorName}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Sales Summary Card
const SalesSummaryCard = ({
  summary,
  vendorName,
}: {
  summary: TSalesTaxSummary;
  vendorName: string;
}) => (
  <div className="border rounded-lg p-6 bg-white">
    <p className="text-gray-600 text-sm mb-4">
      Dear <span className="font-medium text-gray-900">{vendorName}</span>, Your
      Tax Summary Report for the year{' '}
      <span className="font-medium text-gray-900">{summary.year}</span> is now
      available.
    </p>
    <div className="flex flex-col gap-1">
      <Row
        label="Total Sales Revenue:"
        value={`$${summary.totalSalesRevenue.toLocaleString()}`}
      />
      <Row
        label="Platform Fees:"
        value={`$${summary.platformFees.toLocaleString()}`}
      />
      <Row
        label="Net Payouts:"
        value={`$${summary.netPayouts.toLocaleString()}`}
      />
      <Row
        label="Subscription Fees Paid:"
        value={`$${summary.subscriptionFeesPaid.toFixed(2)}`}
      />
      <Row
        label="Refund issue:"
        value={`$${summary.refundIssue.toLocaleString()}`}
        isRed
      />
      <Row
        label="Payout dates and methods:"
        value={summary.payoutDatesAndMethods}
      />
    </div>
    <Link
      href={`/dashboard/transaction-history/tax-summary/sales/${summary.year}`}
      className="inline-flex items-center gap-1 text-blue-600 text-sm hover:underline mt-4"
    >
      <FileText className="w-3.5 h-3.5" />
      Click to View Details for Download
    </Link>
  </div>
);

// Subscription Summary Card
const SubscriptionSummaryCard = ({
  summary,
  vendorName,
}: {
  summary: TSubscriptionTaxSummary;
  vendorName: string;
}) => {
  const isActive = summary.planStatus === 'active';
  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-medium text-gray-900">{summary.planName}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {summary.startDate
              ? format(new Date(summary.startDate), 'dd MMM, yyyy')
              : '-'}{' '}
            →{' '}
            {summary.expirationDate
              ? format(new Date(summary.expirationDate), 'dd MMM, yyyy')
              : '-'}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded text-xs font-medium ${
            isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {isActive ? 'Active' : 'Expired'}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <Row
          label="Plan Amount:"
          value={`$${summary.amount.toFixed(2)} / ${summary.durationType === 'monthly' ? 'Month' : 'Year'}`}
        />
        <Row
          label="Trial:"
          value={summary.durationType === 'monthly' ? 'Monthly' : 'Yearly'}
        />
        <Row
          label="Total Paid This Period:"
          value={`$${summary.amount.toFixed(2)}`}
        />
        <Row
          label="Refund issue:"
          value={`$${summary.refundIssue.toFixed(2)}`}
          isRed
        />
        <Row
          label="Payout dates and methods:"
          value={summary.payoutDatesAndMethods}
        />
      </div>
      <Link
        href={`/dashboard/transaction-history/tax-summary/subscription/${summary._id}`}
        className="inline-flex items-center gap-1 text-blue-600 text-sm hover:underline mt-4"
      >
        <FileText className="w-3.5 h-3.5" />
        Click to View Details for Download
      </Link>
    </div>
  );
};

// Reusable Row
const Row = ({
  label,
  value,
  suffix,
  isRed,
}: {
  label: string;
  value: string;
  suffix?: string;
  isRed?: boolean;
}) => (
  <div className="flex gap-2 items-baseline text-sm py-0.5">
    <span className="text-gray-500 min-w-[200px]">{label}</span>
    <span className={`font-medium ${isRed ? 'text-red-500' : 'text-gray-900'}`}>
      {value}
    </span>
    {suffix && <span className="text-gray-400 font-normal">{suffix}</span>}
  </div>
);

// Empty State
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
    <FileText className="w-12 h-12 mb-3 opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);

export default TaxSummaryReport;
