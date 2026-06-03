'use client';

import { useState } from 'react';
import {
  useGetReferralLinkQuery,
  useGetReferralStatsQuery,
  useEmailReferralLinkMutation,
} from '@/redux/features/referral/referralApi';

const ReferEarn = () => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [month, setMonth] = useState('');

  const { data: linkData } = useGetReferralLinkQuery(undefined);
  const { data: statsData } = useGetReferralStatsQuery(month || undefined);
  const [emailReferral] = useEmailReferralLinkMutation();

  const referralLink = linkData?.data?.referralLink || '';
  const stats = statsData?.data;

  // ✅ Copy link
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Email link
  const handleEmail = async () => {
    if (!email) return;
    await emailReferral({ recipientEmail: email });
    setEmail('');
    setShowEmailInput(false);
    alert('Email sent successfully!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-600"
        />
        <button className="bg-white border border-gray-300 px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
          Request to Payout →
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Points per referral */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm mb-2">
            Points per Successful referral
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.pointsPerReferral ?? 1} point
          </p>
        </div>

        {/* Total Points */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm mb-2">Total Points Earned</p>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.totalPoints ?? 0} points
          </p>
        </div>

        {/* Worth Equivalent */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm mb-2">Worth Equivalent</p>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.worthEquivalent ?? '$0.00'}
          </p>
          <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
            ⚠️ {stats?.payoutNotice}
          </p>
        </div>

        {/* Business Names */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm mb-2">
            Business names of successful referees
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {stats?.businessNames || '—'}
          </p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-4">
        <p className="text-gray-600 text-sm mb-3">
          Unique Referral Link:{' '}
          <span className="text-blue-500">{referralLink}</span>
        </p>

        <div className="flex gap-4">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="text-teal-600 font-semibold underline"
          >
            {copied ? 'Copied! ✓' : '[Copy]'}
          </button>

          {/* Email Button */}
          <button
            onClick={() => setShowEmailInput(!showEmailInput)}
            className="text-teal-600 font-semibold underline"
          >
            [Email]
          </button>
        </div>

        {/* Email Input */}
        {showEmailInput && (
          <div className="flex gap-2 mt-4">
            <input
              type="email"
              placeholder="Enter recipient email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-4 py-2 flex-1"
            />
            <button
              onClick={handleEmail}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Send
            </button>
          </div>
        )}
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-teal-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-gray-600">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">
                Points
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">
                Method
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">
                Referee
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {stats?.transactions?.length > 0 ? (
              stats.transactions.map((t: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3 text-sm">{t.transactionId}</td>
                  <td className="px-4 py-3 text-sm">{t.points}</td>
                  <td className="px-4 py-3 text-sm">{t.method}</td>
                  <td className="px-4 py-3 text-sm">{t.referee}</td>
                  <td className="px-4 py-3 text-sm">{t.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No referrals yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferEarn;
