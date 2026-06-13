'use client';

import { useState } from 'react';
import {
  useGetReferralLinkQuery,
  useGetReferralStatsQuery,
  useEmailReferralLinkMutation,
} from '@/redux/features/referral/referralApi';
import { TTransaction } from '@/types/referral.type';
import { ArrowRight, Mail } from 'lucide-react';
import Spinner from '@/components/shared/Spinner';
import { toast } from 'sonner';
import Image from 'next/image';

const ReferEarn = () => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const [month, setMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${m}`;
  });

  const { data: linkData, isLoading: isLinkLoading } = useGetReferralLinkQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const { data: statsData, isLoading: isStatsLoading } =
    useGetReferralStatsQuery(
      { month: month || undefined },
      {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        pollingInterval: 30000,
      },
    );
  const [emailReferral] = useEmailReferralLinkMutation();

  const referralLink = linkData?.data?.referralLink || '';
  const stats = statsData?.data;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = referralLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy. Please copy manually.');
    }
  };

  const handleEmail = async () => {
    if (!email) return;
    try {
      await emailReferral({ recipientEmail: email }).unwrap();
      setEmail('');
      setShowEmailInput(false);
      toast.success('Email sent successfully! 🎉');
    } catch (error) {
      toast.error('Failed to send email. Please try again.');
    }
  };

  if (isLinkLoading || isStatsLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded-sm px-4 py-2 text-gray-600 w-1/2"
        />
        <button
          disabled
          className="w-1/4 text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80 px-6 py-3 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-5 border-r-5  shadow-gray-500 flex items-center justify-center gap-2"
        >
          <span className="text-sm uppercase font-semibold">
            Request to Payout
          </span>{' '}
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm mb-2">
            Points per Successful referral
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.pointsPerReferral ?? 1} point
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm mb-2">Total Points Earned</p>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.totalPoints ?? 0} points
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm mb-2">Worth Equivalent</p>
          <p className="text-3xl font-bold text-gray-800">
            {stats?.worthEquivalent ?? '$0.00'}
          </p>
          <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
            ⚠️ {stats?.payoutNotice}
          </p>
        </div>

        {/* Business Names Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-gray-500 text-sm mb-3">
            Business names of successful referees
          </p>

          {stats?.businessNames ? (
            <div className="flex flex-wrap gap-2">
              {stats.businessNames
                .split(', ')
                .map((name: string, i: number) => (
                  <span
                    key={i}
                    className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {name}
                  </span>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center">
              No referees yet. <br />
              <span className="text-green-500 font-medium">
                Share your link
              </span>{' '}
              to start earning!
            </p>
          )}
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-4">
        <h3 className="text-gray-800 font-semibold text-base mb-1">
          Your Referral Link
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Share this link with others to earn rewards
        </p>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4">
          <span className="text-sm text-blue-500 flex-1 truncate">
            {referralLink || '...'}
          </span>

          <button
            onClick={handleCopy}
            className={`shrink-0 px-4 py-1.5 rounded-sm text-sm font-semibold transition-all duration-300 cursor-pointer ${
              copied
                ? 'bg-green-700 text-white'
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>

        <button
          onClick={() => setShowEmailInput(!showEmailInput)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-sm border-2 border-dashed border-green-300 text-green-600 font-semibold text-sm hover:bg-teal-50 transition-all duration-200"
        >
          <Mail size={18} /> <span>Send via Email</span>
        </button>

        {/* Email Input — smooth dropdown */}
        {showEmailInput && (
          <div className="mt-3 bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-xs text-gray-500 mb-2">
              Enter the email address you want to invite
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border border-gray-200 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
              />
              <button
                onClick={handleEmail}
                disabled={!email}
                className={`px-5 py-2.5 rounded-sm text-sm transition-all ${
                  email
                    ? 'bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded shadow-sm border overflow-hidden">
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
            {(stats?.transactions?.length ?? 0) > 0 ? (
              stats!.transactions.map((t: TTransaction, i: number) => (
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
                  <Image
                    src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    alt="No results"
                    width={100}
                    height={100}
                    className="mx-auto w-24 mt-2"
                  />
                  <span>No referrals yet</span>
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
