import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Row } from './row';
import { TSalesTaxSummary } from '@/types/taxSummary.type';

const SalesSummaryCard = ({
  summary,
  vendorName,
}: {
  summary: TSalesTaxSummary;
  vendorName: string;
}) => (
  <div className="border rounded-lg p-6 bg-white">
    <p className="text-gray-600 text-sm mb-4">
      Dear <span className="font-semibold text-gray-900">{vendorName}</span>,
      Your Tax Summary Report for the year{' '}
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
        suffix={`(${summary?.planName})`}
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
      href={`/vendor/transaction-history/tax-summary/sales/${summary.year}`}
      className="inline-flex items-center gap-1 text-blue-600 text-sm hover:underline mt-4"
    >
      <FileText className="w-3.5 h-3.5" />
      Click to View Details for Download
    </Link>
  </div>
);

export default SalesSummaryCard;
