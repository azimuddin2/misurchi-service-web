'use client';

import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { TSubscriptionTaxSummary } from '@/types/payment.type';
import { Row } from './row';
import { handleDownloadPDF, handleExportCSV } from '@/lib/tax-summary-export';

const SubscriptionSummaryCard = ({
  summary,
}: {
  summary: TSubscriptionTaxSummary;
}) => {
  const isActive = summary.planStatus === 'active';

  const startDate = summary.startDate
    ? format(new Date(summary.startDate), 'dd MMM, yyyy')
    : 'N/A';

  const expirationDate = summary.expirationDate
    ? format(new Date(summary.expirationDate), 'dd MMM, yyyy')
    : 'N/A';

  return (
    <div className="border rounded-lg p-6 bg-white">
      {/* Plan header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-medium text-gray-900">{summary.planName}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {startDate} → {expirationDate}
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

      {/* Details */}
      <div className="flex flex-col gap-1">
        <Row
          label="Plan Amount:"
          value={`$${summary.amount.toFixed(2)} / ${
            summary.durationType === 'monthly' ? 'Month' : 'Year'
          }`}
        />
        <Row
          label="Trial:"
          value={summary.durationType === 'monthly' ? 'Monthly' : 'Yearly'}
        />
        <Row label="Start Date:" value={startDate} />
        <Row label="Expiration Date:" value={expirationDate} />
        <Row
          label="Total Paid This Period:"
          value={`$${summary.amount.toFixed(2)}`}
        />
        <Row
          label="Refund issue:"
          value={`$${summary.refundIssue.toFixed(2)}`}
          isRed
        />
      </div>

      {/* Divider */}
      <div className="border-t my-4" />

      {/* Download buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => handleDownloadPDF('subscription', summary)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#003250] text-white text-sm font-medium rounded hover:bg-[#004a78] transition-colors"
        >
          <FileText className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={() => handleExportCSV('subscription', summary)}
          className="inline-flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default SubscriptionSummaryCard;
