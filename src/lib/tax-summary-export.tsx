import { format } from 'date-fns';
import {
  TSalesTaxSummary,
  TSubscriptionTaxSummary,
} from '@/types/payment.type';

// ─── CSV Export ───────────────────────────────────────────────────────────────

const downloadCSV = (filename: string, rows: string[][]) => {
  const content = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// ─── PDF Export (print) ───────────────────────────────────────────────────────

const downloadPDF = (html: string, filename: string) => {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; font-size: 14px; color: #111; }
          h2 { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          td { padding: 6px 0; }
          td:first-child { color: #555; width: 220px; }
          td:last-child { font-weight: 500; }
          .red { color: #E24B4A; }
          .divider { border-top: 1px solid #e5e7eb; margin: 16px 0; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);
  win.document.close();
  win.print();
};

// ─── Sales ────────────────────────────────────────────────────────────────────

export const handleDownloadPDF = (
  type: 'sales' | 'subscription',
  data: TSalesTaxSummary | TSubscriptionTaxSummary,
) => {
  if (type === 'sales') {
    const d = data as TSalesTaxSummary;
    const html = `
      <h2>Tax Summary Report — ${d.year}</h2>
      <table>
        <tr><td>Total Sales Revenue</td><td>$${d.totalSalesRevenue.toLocaleString()}</td></tr>
        <tr><td>Platform Fees</td><td>$${d.platformFees.toLocaleString()}</td></tr>
        <tr><td>Net Payouts</td><td>$${d.netPayouts.toLocaleString()}</td></tr>
        <tr><td>Subscription Fees Paid</td><td>$${d.subscriptionFeesPaid.toFixed(2)} (${d.planName})</td></tr>
        <tr><td>Refund issue</td><td class="red">$${d.refundIssue.toLocaleString()}</td></tr>
        <tr><td>Payout dates and methods</td><td>${d.payoutDatesAndMethods}</td></tr>
      </table>
    `;
    downloadPDF(html, `tax-summary-${d.year}.pdf`);
  }

  if (type === 'subscription') {
    const d = data as TSubscriptionTaxSummary;
    const startDate = d.startDate
      ? format(new Date(d.startDate), 'dd MMM, yyyy')
      : 'N/A';
    const expDate = d.expirationDate
      ? format(new Date(d.expirationDate), 'dd MMM, yyyy')
      : 'N/A';
    const html = `
      <h2>Subscription Tax Summary — ${d.planName}</h2>
      <table>
        <tr><td>Plan Amount</td><td>$${d.amount.toFixed(2)} / ${d.durationType === 'monthly' ? 'Month' : 'Year'}</td></tr>
        <tr><td>Trial</td><td>${d.durationType === 'monthly' ? 'Monthly' : 'Yearly'}</td></tr>
        <tr><td>Start Date</td><td>${startDate}</td></tr>
        <tr><td>Expiration Date</td><td>${expDate}</td></tr>
        <tr><td>Total Paid This Period</td><td>$${d.amount.toFixed(2)}</td></tr>
        <tr><td>Refund issue</td><td class="red">$${d.refundIssue.toFixed(2)}</td></tr>
        <tr><td>Status</td><td>${d.planStatus}</td></tr>
      </table>
    `;
    downloadPDF(html, `subscription-summary-${d._id}.pdf`);
  }
};

export const handleExportCSV = (
  type: 'sales' | 'subscription',
  data: TSalesTaxSummary | TSubscriptionTaxSummary,
) => {
  if (type === 'sales') {
    const d = data as TSalesTaxSummary;
    const rows = [
      ['Field', 'Value'],
      ['Year', `${d.year}`],
      ['Total Sales Revenue', `$${d.totalSalesRevenue}`],
      ['Platform Fees', `$${d.platformFees}`],
      ['Net Payouts', `$${d.netPayouts}`],
      ['Subscription Fees Paid', `$${d.subscriptionFeesPaid} (${d.planName})`],
      ['Refund Issue', `$${d.refundIssue}`],
      ['Payout dates and methods', d.payoutDatesAndMethods],
    ];
    downloadCSV(`tax-summary-${d.year}.csv`, rows);
  }

  if (type === 'subscription') {
    const d = data as TSubscriptionTaxSummary;
    const startDate = d.startDate
      ? format(new Date(d.startDate), 'dd MMM, yyyy')
      : 'N/A';
    const expDate = d.expirationDate
      ? format(new Date(d.expirationDate), 'dd MMM, yyyy')
      : 'N/A';
    const rows = [
      ['Field', 'Value'],
      ['Plan Name', d.planName],
      ['Plan Amount', `$${d.amount.toFixed(2)}`],
      ['Duration', d.durationType === 'monthly' ? 'Monthly' : 'Yearly'],
      ['Start Date', startDate],
      ['Expiration Date', expDate],
      ['Total Paid', `$${d.amount.toFixed(2)}`],
      ['Refund Issue', `$${d.refundIssue.toFixed(2)}`],
      ['Status', d.planStatus],
    ];
    downloadCSV(`subscription-summary-${d._id}.csv`, rows);
  }
};
