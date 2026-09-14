"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Users,
  DollarSign,
  Gift,
  Share2,
  AlertCircle,
  X,
  DownloadCloud,
  RefreshCw,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import DepositModal from "@/components/dashboard/modals/DepositModal";

interface ReferralData {
  referral_code: string;
  referral_link: string;
  total_referrals: number;
  total_earnings: string;
  referral_bonus_rate: number;
}

interface Referral {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  has_deposited: boolean;
  bonus_earned: string;
}

interface ReferralInfoResponse {
  success: boolean;
  referral_data: ReferralData;
  error?: string;
}
interface ReferralListResponse {
  success: boolean;
  referrals: Referral[];
}

// This endpoint needs the frontend's own origin (for the referral link it
// builds server-side) — a header the shared SWR fetcher doesn't send, so this
// key gets its own fetcher instead of the global one.
const referralInfoFetcher = (url: string) =>
  apiFetch(url, { headers: { "X-Frontend-URL": window.location.origin } }).then((res) => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  });

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

  // States for generating referral code
  const [generating, setGenerating] = useState(false);
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);

  const {
    data: infoRes,
    error: infoError,
    isLoading: infoLoading,
    mutate: refetchInfo,
  } = useSWR<ReferralInfoResponse>("/referral/info/", referralInfoFetcher);
  const { data: listRes, isLoading: listLoading, mutate: refetchList } = useSWR<ReferralListResponse>("/referral/list/");

  const referralData = infoRes?.success ? infoRes.referral_data : null;
  const referrals = listRes?.success ? listRes.referrals : [];
  const loading = infoLoading || listLoading;
  const error = infoError
    ? infoError instanceof Error
      ? infoError.message
      : "Failed to fetch referral data. Please check your connection."
    : infoRes && !infoRes.success
      ? infoRes.error || "Failed to fetch referral data"
      : null;

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const generateReferralCode = async () => {
    // If user already has a code, ask for confirmation
    if (referralData?.referral_code) {
      const confirmed = window.confirm(
        "Are you sure you want to regenerate your referral code? Your old code will no longer work."
      );
      if (!confirmed) return;
    }

    setGenerating(true);
    setGenerateMessage(null);

    try {
      const response = await apiFetch("/referral/generate/", {
        method: "POST",
        body: JSON.stringify({ force: true }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGenerateMessage("✅ Referral code generated successfully!");
        // Refresh referral data to get the new code
        await refetchInfo();
        setTimeout(() => setGenerateMessage(null), 3000);
      } else {
        setGenerateMessage(
          `❌ ${data.error || "Failed to generate referral code"}`
        );
        setTimeout(() => setGenerateMessage(null), 5000);
      }
    } catch (error) {
      console.error("Error generating referral code:", error);
      setGenerateMessage("❌ Failed to generate referral code");
      setTimeout(() => setGenerateMessage(null), 5000);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (referralData) {
      navigator.clipboard.writeText(referralData.referral_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleModalCopy = () => {
    if (referralData) {
      navigator.clipboard.writeText(referralData.referral_link);
      setModalCopied(true);
      setTimeout(() => setModalCopied(false), 2000);
    }
  };

  const handleShareClick = () => {
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-xl font-bold text-red-500">Error</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => {
              refetchInfo();
              refetchList();
            }}
            className="w-full px-4 py-2 bg-[#00C9A7] hover:opacity-90 text-[#001a0f] rounded-lg font-medium transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-green-700 to-green-800 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-sm sm:text-base font-bold">Reward Center</h1>
          </div>

          <p className="text-blue-50 dark:text-green-100 text-sm sm:text-base mb-6">
            Invite friends and earn rewards! Get{" "}
            <span className="font-bold text-lg">
              {referralData?.referral_bonus_rate || 10}%
            </span>{" "}
            of their first deposit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Referrals */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-200" />
                <p className="text-sm text-green-100">Total Referrals</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                {referralData?.total_referrals || 0}
              </p>
            </div>

            {/* Total Earnings */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-200" />
                <p className="text-sm text-green-100">Total Earned</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                $
                {parseFloat(referralData?.total_earnings || "0").toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Referral Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="tv-card rounded-xl sm:rounded-2xl p-5 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-6 h-6 text-green-600" />
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              Your Referral Link
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 tv-inner border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-3 overflow-x-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-nowrap">
                  {referralData?.referral_link || ""}
                </p>
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00C9A7] hover:opacity-90 text-[#001a0f] rounded-lg font-medium transition-all shadow-sm whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Referral Code Display */}
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Your Referral Code
                  </p>
                  {referralData?.referral_code ? (
                    <p className="text-sm font-bold text-green-700 dark:text-green-400 font-mono break-all">
                      {referralData.referral_code}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No referral code yet
                    </p>
                  )}
                </div>

                {/* Always show button - Generate or Regenerate */}
                <button
                  onClick={generateReferralCode}
                  disabled={generating}
                  className="px-4 py-2 bg-[#00C9A7] hover:opacity-90 text-[#001a0f] rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>
                        {referralData?.referral_code
                          ? "Regenerate"
                          : "Generate"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Generate Message */}
              {generateMessage && (
                <p
                  className={`text-sm mt-3 ${
                    generateMessage.startsWith("✅")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500"
                  }`}
                >
                  {generateMessage}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="tv-card rounded-xl sm:rounded-2xl p-5 sm:p-8"
        >
          <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-6">
            Complete tasks & earn!!!
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
            Earn points by completing daily and weekly tasks. Redeem your points
            for exclusive rewards and bonuses!
          </p>

          <div className="space-y-4">
            {/* Task 1: Refer a Friend */}
            <div className="tv-inner border border-[rgba(255,255,255,0.06)] rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-full flex-shrink-0">
                  <Users className="w-6 h-6 text-green-700 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-yellow-600 dark:text-yellow-500 mb-2">
                    Refer a Friend
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                    Invite your friends to join and get{" "}
                    {referralData?.referral_bonus_rate || 10}% of their first
                    deposit!
                  </p>
                  <button
                    onClick={handleShareClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#00C9A7] hover:opacity-90 text-[#001a0f] rounded-lg text-sm font-medium transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Link
                  </button>
                </div>
              </div>
            </div>

            {/* Task 2: First Deposit Bonus */}
            <div className="tv-inner border border-[rgba(255,255,255,0.06)] rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-full flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-green-700 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-yellow-600 dark:text-yellow-500 mb-2">
                    +10%
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Deposit and get 10% bonus on your first deposit! (min
                    $10,000.00)
                  </p>

                  <button
                    onClick={() => setShowDeposit(true)}
                    className="inline-flex items-center mt-3 gap-2 px-4 py-2 bg-[#00C9A7] hover:opacity-90 text-[#001a0f] rounded-lg text-sm font-medium transition-all"
                  >
                    <DownloadCloud className="w-4 h-4" />
                    Deposit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Referrals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="tv-card rounded-xl sm:rounded-2xl p-5 sm:p-8"
        >
          <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-6">
            Your Referrals ({referrals.length})
          </h2>

          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No referrals yet. Start sharing your link!
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-white/10">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Earned
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((referral) => (
                      <tr
                        key={referral.id}
                        className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#0d3320]/30 transition-colors"
                      >
                        <td className="py-5 px-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {referral.first_name} {referral.last_name}
                        </td>
                        <td className="py-5 px-4 text-sm text-gray-700 dark:text-gray-300">
                          {referral.email}
                        </td>
                        <td className="py-5 px-4 text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(referral.date_joined)}
                        </td>
                        <td className="py-5 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                              referral.has_deposited
                                ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                                : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                            }`}
                          >
                            {referral.has_deposited ? "Deposited" : "Pending"}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-sm font-semibold text-green-700 dark:text-green-400">
                          $
                          {parseFloat(referral.bonus_earned).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-4">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="tv-inner border border-[rgba(255,255,255,0.06)] rounded-xl p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {referral.first_name} {referral.last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {referral.email}
                        </p>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                          referral.has_deposited
                            ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {referral.has_deposited ? "Deposited" : "Pending"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-white/10">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Joined
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(referral.date_joined)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Earned
                        </p>
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">
                          $
                          {parseFloat(referral.bonus_earned).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Share Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="tv-card rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#0d3320]/50 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Modal Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Invite Friends & Earn Rewards
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Share your referral link below. When your friends sign up and
                  start trading, you both earn rewards!
                </p>
              </div>

              {/* Referral Link Section */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Your Referral Link:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={referralData?.referral_link || ""}
                    readOnly
                    className="flex-1 px-4 py-3 tv-inner border border-[rgba(255,255,255,0.06)] rounded-lg text-sm text-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
                  />
                  <button
                    onClick={handleModalCopy}
                    className="px-6 py-3 bg-[#00C9A7] hover:opacity-90 text-[#001a0f] rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {modalCopied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Referral Code in Modal */}
              <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Your Referral Code
                </p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400 font-mono">
                  {referralData?.referral_code || "N/A"}
                </p>
              </div>

              {/* Footer Text */}
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                You can track your referrals and rewards in your account
                dashboard.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Deposit Modal */}
      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
    </section>
  );
}
