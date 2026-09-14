"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ChevronDown,
  Loader2,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { PaymentMethod, UserProfile, Transaction } from "@/components/dashboard/modals/types";

const WITHDRAWAL_PROFILE_KEY = "/withdrawals/profile/";
const WITHDRAWAL_METHODS_KEY = "/withdrawals/methods/";

interface WithdrawalProfileResponse {
  success: boolean;
  user: UserProfile;
}
interface WithdrawalMethodsResponse {
  success: boolean;
  methods: PaymentMethod[];
}
interface WithdrawalHistoryResponse {
  success: boolean;
  transactions: Transaction[];
}

export default function WithdrawPage() {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [withdrawalAddress, setWithdrawalAddress] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ ref: string; amount: string } | null>(null);

  const { data: profileRes, error: profileError, isLoading: profileLoading, mutate: mutateProfile } = useSWR<WithdrawalProfileResponse>(WITHDRAWAL_PROFILE_KEY);
  const { data: methodsRes, error: methodsError, isLoading: methodsLoading } = useSWR<WithdrawalMethodsResponse>(WITHDRAWAL_METHODS_KEY);
  const { data: historyRes, error: historyError, isLoading: historyLoading, mutate: mutateHistory } = useSWR<WithdrawalHistoryResponse>("/withdrawals/history/?limit=10");

  const profile = profileRes?.success ? profileRes.user : null;
  const methods = useMemo(() => (methodsRes?.success ? methodsRes.methods : []), [methodsRes]);
  const transactions = historyRes?.success ? historyRes.transactions : [];
  const loading = profileLoading || methodsLoading || historyLoading;

  useEffect(() => {
    if (profileError || methodsError || historyError) toast.error("Failed to load withdrawal data");
  }, [profileError, methodsError, historyError]);

  useEffect(() => {
    if (selectedMethod && methods.length > 0) {
      const method = methods.find((m) => m.method_type === selectedMethod);
      if (method) setWithdrawalAddress(method.address);
    } else {
      setWithdrawalAddress("");
    }
  }, [selectedMethod, methods]);

  const handleMethodSelect = (methodType: string) => {
    setSelectedMethod(methodType);
    setIsDropdownOpen(false);
    setError("");
  };

  const handleConfirmWithdrawal = async () => {
    setError("");

    if (!selectedMethod) { setError("Please select a withdrawal method"); return; }
    if (!amount || parseFloat(amount) <= 0) { setError("Please enter a valid amount"); return; }
    if (!withdrawalAddress) { setError("Withdrawal address is required"); return; }
    if (profile && parseFloat(amount) > parseFloat(profile.balance)) {
      setError(`Insufficient balance. Your balance is ${profile.formatted_balance}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch("/withdrawals/create/", {
        method: "POST",
        body: JSON.stringify({
          method_type: selectedMethod,
          amount: amount,
          withdrawal_address: withdrawalAddress,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess({ ref: data.transaction.reference, amount });
        mutateProfile(
          (current) =>
            current?.success
              ? { ...current, user: { ...current.user, balance: data.transaction.new_balance, formatted_balance: data.transaction.formatted_new_balance } }
              : current,
          { revalidate: false }
        );
        mutateHistory();
        setSelectedMethod("");
        setAmount("");
        setWithdrawalAddress("");
        toast.success("Withdrawal request submitted!");
      } else {
        setError(data.error || "Failed to submit withdrawal request");
      }
    } catch {
      setError("Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  const getDisplayName = (methodType: string): string => {
    return methodType.replace("_ERC20", "").replace("_TRC20", "");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-500/20 text-green-400";
      case "failed": return "bg-red-500/20 text-red-400";
      default: return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">Withdrawal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Withdraw funds from your account</p>
      </motion.div>

      {/* Success Banner */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-600/10 border border-green-500/20 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Withdrawal Submitted</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                ${parseFloat(success.amount).toFixed(2)} &middot; Ref: <span className="font-mono">{success.ref}</span>
              </p>
              <button onClick={() => setSuccess(null)} className="text-xs text-green-600 hover:underline mt-1">Dismiss</button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawal Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-1 tv-card backdrop-blur-xl rounded-2xl p-6"
        >
          <div className="space-y-5">
            {/* Balance Display */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Available Balance</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {profile ? profile.formatted_balance : "$0.00"}
              </p>
            </div>

            <hr className="border-gray-200 dark:border-white/10" />

            {/* Method Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Withdrawal Method
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-4 py-3 rounded-lg text-left flex items-center justify-between transition-all bg-gray-100 dark:bg-[#071a0e] border ${
                    isDropdownOpen ? "border-green-600" : "border-gray-300 dark:border-white/10"
                  } ${selectedMethod ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                >
                  <span>{selectedMethod ? getDisplayName(selectedMethod) : "Select method"}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1.5 rounded-lg shadow-lg overflow-hidden" style={{ background: "#0d1a12", border: "1px solid rgba(0,201,167,0.14)" }}>
                    <div className="px-3 py-2 text-xs font-semibold" style={{ background: "#00C9A7", color: "#001a0f" }}>Select method</div>
                    <div className="max-h-48 overflow-y-auto">
                      {methods.length === 0 ? (
                        <div className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
                          No payment methods available. Add one in settings.
                        </div>
                      ) : (
                        methods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => handleMethodSelect(method.method_type)}
                            className="w-full px-3 py-2.5 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                          >
                            {method.display_name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {methods.length === 0 && (
                <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-600 dark:text-yellow-300">
                      No withdrawal methods set up. Please add one in your settings.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(""); }}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-green-600 transition-all text-lg font-semibold"
              />
              {profile && amount && parseFloat(amount) > parseFloat(profile.balance) && (
                <p className="mt-1.5 text-xs text-red-400">
                  Amount exceeds your balance of {profile.formatted_balance}
                </p>
              )}
            </div>

            {/* Withdrawal Address */}
            {selectedMethod && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Withdrawal Address
                </label>
                <input
                  type="text"
                  value={withdrawalAddress}
                  readOnly
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-gray-500 dark:text-gray-400 focus:outline-none cursor-not-allowed opacity-75"
                />
                <p className="mt-1 text-[10px] text-gray-500">
                  Saved address for {getDisplayName(selectedMethod)}. Update in settings.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-500 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleConfirmWithdrawal}
              disabled={submitting || !selectedMethod || !amount || !withdrawalAddress}
              className="w-full py-3 bg-[#00C9A7] hover:opacity-90 text-[#001a0f] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
              ) : (
                "Confirm Withdrawal"
              )}
            </button>

            {/* Note */}
            <div className="p-3 bg-green-600/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-green-700 dark:text-green-300">
                  <strong>Note:</strong> Withdrawals are processed within 24-48 hours. You will be notified once approved.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Withdrawals Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="tv-card backdrop-blur-xl rounded-2xl p-5 h-fit"
        >
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Withdrawals</h3>

          {transactions.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">No withdrawals yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="tv-inner border border-[rgba(255,255,255,0.06)] rounded-xl p-3">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-red-500/15 flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">Withdrawal</p>
                        <p className="text-[9px] text-gray-500 font-mono">{tx.reference}</p>
                      </div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status_display}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] text-gray-500">{formatDate(tx.created_at)}</p>
                    <p className="text-sm font-bold text-red-400">-${parseFloat(tx.amount).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
