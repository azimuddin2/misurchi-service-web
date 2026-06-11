'use client';

import { useParams } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetSalesTaxSummaryDetailQuery } from '@/redux/features/taxSummary/taxSummaryApi';
import Spinner from '@/components/shared/Spinner';
import { format } from 'date-fns';
import { FileText, Download } from 'lucide-react';

const ViewTaxSummaryDetail = () => {
  const { year } = useParams();
  const user = useAppSelector(selectCurrentUser);
  const vendorId = user?.vendorId as string;

  const { data, isLoading } = useGetSalesTaxSummaryDetailQuery({
    vendorId,
    year: Number(year),
  });

  const detail = data?.data;

  if (isLoading) return <Spinner />;
  if (!detail) return <p className="text-gray-500 text-sm">No data found.</p>;

  // ─── PDF Download ───────────────────────────────────────────────────────────
  const handleDownloadPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Tax Summary Report — ${detail.year}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; font-size: 14px; color: #111; }
            h2 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
            p { color: #555; font-size: 13px; margin-bottom: 20px; }
            .stats { display: flex; gap: 16px; margin-bottom: 20px; }
            .stat-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; flex: 1; }
            .stat-box span { font-size: 11px; color: #888; display: block; margin-bottom: 4px; }
            .stat-box strong { font-size: 18px; }
            .red { color: #E24B4A; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { background: #003250; color: white; padding: 10px 12px; text-align: left; font-size: 13px; }
            td { padding: 8px 12px; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
            tr:nth-child(even) td { background: #f9fafb; }
            .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
            .info-row span:first-child { color: #666; }
          </style>
        </head>
        <body>
          <h2>Tax Summary Report — ${detail.year}</h2>
          <p>Review and manage your annual tax summary</p>
          <div class="stats">
            <div class="stat-box">
              <span>Total Sales Revenue</span>
              <strong>$${detail.totalSalesRevenue.toLocaleString()}</strong>
            </div>
            <div class="stat-box">
              <span>Platform Fees</span>
              <strong class="red">-$${detail.platformFees.toLocaleString()}</strong>
            </div>
            <div class="stat-box">
              <span>Net Payouts</span>
              <strong>$${detail.netPayouts.toLocaleString()}</strong>
            </div>
          </div>
          <div class="info-row">
            <span>Subscription Fees Paid</span>
            <span>$${detail.subscriptionFeesPaid.toFixed(2)} (${detail.planName})</span>
          </div>
          <div class="info-row">
            <span>Refunds Issue</span>
            <span class="red">-$${detail.refundIssue.toFixed(2)}</span>
          </div>
          <h3 style="margin-top:24px; margin-bottom:8px;">Payout Dates & Method</h3>
          <table>
            <thead>
              <tr>
                <th>Transaction Id</th>
                <th>Payment Date</th>
                <th>Amount</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              ${detail.payouts
                .map(
                  (p) => `
                <tr>
                  <td>#${p.transactionId}</td>
                  <td>${format(new Date(p.paymentDate), 'MM/dd/yyyy')}</td>
                  <td>$${p.amount.toFixed(2)}</td>
                  <td>${p.paymentMethod}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  // ─── CSV Export ─────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const rows = [
      ['Tax Summary Report', `${detail.year}`],
      [],
      ['Field', 'Value'],
      ['Total Sales Revenue', `$${detail.totalSalesRevenue}`],
      ['Platform Fees', `$${detail.platformFees}`],
      ['Net Payouts', `$${detail.netPayouts}`],
      [
        'Subscription Fees Paid',
        `$${detail.subscriptionFeesPaid} (${detail.planName})`,
      ],
      ['Refund Issue', `$${detail.refundIssue}`],
      [],
      ['Transaction Id', 'Payment Date', 'Amount', 'Payment Method'],
      ...detail.payouts.map((p) => [
        `#${p.transactionId}`,
        format(new Date(p.paymentDate), 'MM/dd/yyyy'),
        `$${p.amount.toFixed(2)}`,
        p.paymentMethod,
      ]),
    ];

    const content = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax-summary-${detail.year}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-medium">
          Tax Summary Report — {detail.year}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Review and manage your annual tax summary
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 border rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Total Sales Revenue</p>
          <p className="text-2xl font-semibold text-gray-900">
            ${detail.totalSalesRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 border rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Platform Fees</p>
          <p className="text-2xl font-semibold text-red-500">
            -${detail.platformFees.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 border rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Net Payouts</p>
          <p className="text-2xl font-semibold text-gray-900">
            ${detail.netPayouts.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Subscription Fees + Refund */}
      <div className="border rounded-lg p-4 mb-6 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subscription Fees Paid</span>
          <span className="font-medium text-gray-900">
            ${detail.subscriptionFeesPaid.toFixed(2)}{' '}
            <span className="text-gray-400 font-normal">
              ({detail.planName})
            </span>
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Refunds Issue</span>
          <span className="font-medium text-red-500">
            -${detail.refundIssue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payout Table */}
      <div className="mb-6">
        <h3 className="text-base font-medium mb-3">Payout Dates & Method</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#003250] text-white">
                <th className="text-left px-4 py-3 font-medium">
                  Transaction Id
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  Payment Date
                </th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody>
              {detail.payouts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-gray-400 text-sm"
                  >
                    No payout records found.
                  </td>
                </tr>
              ) : (
                detail.payouts.map((payout, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-3 text-gray-700">
                      #{payout.transactionId}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {format(new Date(payout.paymentDate), 'dd MMM, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      ${payout.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {payout.paymentMethod}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003250] text-white text-sm font-medium rounded hover:bg-[#004a78] transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 border text-sm font-medium rounded hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default ViewTaxSummaryDetail;
