"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  ChevronDown,
  Loader2,
  CheckCircle,
  Clock,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { UserProfile } from "./types";
import { getCryptoIcon, getNetworkName } from "./crypto-icons";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WithdrawStep = "form" | "success";

const WITHDRAWAL_PROFILE_KEY = "/withdrawals/profile/";

interface WithdrawalProfileResponse {
  success: boolean;
  user: UserProfile;
}

// Hardcoded crypto types for withdrawal — no dependency on saved payment
// methods or admin-configured deposit wallets. The user always types their
// own destination address manually below.
const CRYPTO_TYPES = ["BTC", "ETH", "USDT", "BNB", "TRX", "USDC", "XRP", "SOL"];

// Frosted-glass treatment on both dropdown panels — everything else (card,
// inputs, buttons) stays the app's normal solid theme.
const GLASS_PANEL =
  "bg-white/70 dark:bg-[#0b1a12]/60 backdrop-blur-xl border border-gray-200/70 dark:border-[rgba(22,163,74,0.18)]";

export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const [step, setStep] = useState<WithdrawStep>("form");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [withdrawSource, setWithdrawSource] = useState<"balance" | "profit">("balance");
  const [amount, setAmount] = useState("");
  const [withdrawalAddress, setWithdrawalAddress] = useState("");
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [withdrawRef, setWithdrawRef] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { data: profileRes, error: profileError, isLoading: profileLoading, mutate: mutateProfile } =
    useSWR<WithdrawalProfileResponse>(isOpen ? WITHDRAWAL_PROFILE_KEY : null);

  const profile = profileRes?.success ? profileRes.user : null;
  const loading = profileLoading;

  React.useEffect(() => {
    if (profileError) toast.error("Failed to load withdrawal data");
  }, [profileError]);

  const availableAmount = profile
    ? parseFloat(withdrawSource === "profit" ? profile.profit : profile.balance)
    : 0;
  const availableLabel = profile
    ? withdrawSource === "profit" ? profile.formatted_profit : profile.formatted_balance
    : "$0.00";

  const handleConfirmWithdrawal = async () => {
    setError("");

    if (!selectedCurrency) { setError("Please select a currency type"); return; }
    if (!amount || parseFloat(amount) <= 0) { setError("Please enter a valid amount"); return; }
    if (!withdrawalAddress.trim()) { setError("Please enter your wallet address"); return; }
    if (profile && parseFloat(amount) > availableAmount) {
      setError(`Insufficient ${withdrawSource === "profit" ? "profit" : "capital"}. Available: ${availableLabel}`);
      return;
    }

    setSubmitting(true);

    // Fire-and-forget: tell admin a withdrawal is being confirmed, independent
    // of (and never blocking) the real withdrawal request below.
    apiFetch("/withdrawals/intent/", {
      method: "POST",
      body: JSON.stringify({
        method_type: selectedCurrency,
        amount: amount,
        withdrawal_address: withdrawalAddress.trim(),
        source: withdrawSource,
      }),
    }).catch(() => {});

    try {
      const res = await apiFetch("/withdrawals/create/", {
        method: "POST",
        body: JSON.stringify({
          method_type: selectedCurrency,
          amount: amount,
          withdrawal_address: withdrawalAddress.trim(),
          source: withdrawSource,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWithdrawRef(data.transaction.reference);
        setWithdrawAmount(amount);
        mutateProfile(
          (current) =>
            current?.success
              ? { ...current, user: { ...current.user, balance: data.transaction.new_balance, formatted_balance: data.transaction.formatted_new_balance } }
              : current,
          { revalidate: false }
        );
        setStep("success");
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

  const handleClose = () => {
    setStep("form");
    setSelectedCurrency("");
    setWithdrawSource("balance");
    setAmount("");
    setWithdrawalAddress("");
    setError("");
    setIsTypeDropdownOpen(false);
    setIsSourceDropdownOpen(false);
    setWithdrawRef("");
    setWithdrawAmount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white dark:bg-[#0b1a12] border border-gray-200 dark:border-[rgba(22,163,74,0.14)]"
        >
          {/* ==================== FORM STEP ==================== */}
          {step === "form" && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Withdraw</h3>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity bg-gray-100 dark:bg-white/8"
                >
                  <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                To make a withdrawal, select your balance, amount and verify the address you wish for payment to be made into.
              </p>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Type Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Type:
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => { setIsTypeDropdownOpen(!isTypeDropdownOpen); setIsSourceDropdownOpen(false); }}
                        className={`w-full px-4 py-2.5 rounded-lg text-left flex items-center justify-between gap-2 transition-all bg-gray-50 dark:bg-white/5 border ${
                          isTypeDropdownOpen ? "border-[#16a34a]" : "border-gray-200 dark:border-white/10"
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          {selectedCurrency && (
                            <span className="shrink-0 [&_svg]:!w-5 [&_svg]:!h-5">{getCryptoIcon(selectedCurrency)}</span>
                          )}
                          <span className={`truncate ${selectedCurrency ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>
                            {selectedCurrency
                              ? `${selectedCurrency} (${getNetworkName(selectedCurrency)})`
                              : "Select currency"}
                          </span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 transition-transform ${isTypeDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isTypeDropdownOpen && (
                        <div className={`absolute z-10 w-full mt-1.5 rounded-lg shadow-lg overflow-hidden ${GLASS_PANEL}`}>
                          <div className="max-h-56 overflow-y-auto">
                            {CRYPTO_TYPES.map((currency) => (
                              <button
                                key={currency}
                                onClick={() => {
                                  setSelectedCurrency(currency);
                                  setIsTypeDropdownOpen(false);
                                  setError("");
                                }}
                                className="w-full px-3 py-2.5 flex items-center gap-2.5 text-left text-sm text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                              >
                                <span className="shrink-0 [&_svg]:!w-6 [&_svg]:!h-6">{getCryptoIcon(currency)}</span>
                                <span className="flex-1 truncate">{currency}</span>
                                {selectedCurrency === currency && (
                                  <Check className="w-4 h-4 shrink-0" style={{ color: "#16a34a" }} />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Source Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Withdraw from:
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => { setIsSourceDropdownOpen(!isSourceDropdownOpen); setIsTypeDropdownOpen(false); }}
                        className={`w-full px-4 py-2.5 rounded-lg text-left flex items-center justify-between transition-all bg-gray-50 dark:bg-white/5 border ${
                          isSourceDropdownOpen
                            ? "border-[#16a34a]"
                            : "border-gray-200 dark:border-white/10"
                        } text-gray-900 dark:text-white`}
                      >
                        <span>{withdrawSource === "profit" ? "Profit" : "Capital"}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${isSourceDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isSourceDropdownOpen && (
                        <div className={`absolute z-10 w-full mt-1.5 rounded-lg shadow-lg overflow-hidden ${GLASS_PANEL}`}>
                          {(["balance", "profit"] as const).map((src) => (
                            <button
                              key={src}
                              onClick={() => { setWithdrawSource(src); setIsSourceDropdownOpen(false); setError(""); }}
                              className="w-full px-4 py-2.5 flex items-center justify-between gap-2 text-left text-sm text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                              <span className={withdrawSource === src ? "font-semibold" : ""}>
                                {src === "profit" ? "Profit" : "Capital"}
                              </span>
                              {withdrawSource === src && <Check className="w-4 h-4 shrink-0" style={{ color: "#16a34a" }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Amount:
                    </label>
                    <div className={`flex items-center rounded-lg bg-gray-50 dark:bg-white/5 border transition-all ${
                      error && !amount ? "border-red-400" : "border-gray-200 dark:border-white/10 focus-within:border-[#16a34a]"
                    }`}>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setError(""); }}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="flex-1 min-w-0 px-4 py-2.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                      />
                      <span className="pr-4 text-xs font-semibold text-gray-400 dark:text-gray-500">USD</span>
                    </div>
                    {profile && amount && parseFloat(amount) > availableAmount && (
                      <p className="mt-1.5 text-xs text-red-400">
                        Amount exceeds your {withdrawSource === "profit" ? "profit" : "capital"} of {availableLabel}
                      </p>
                    )}
                  </div>

                  {/* Current balance */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Current balance</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{availableLabel} USD</span>
                  </div>

                  {/* Withdrawal Address — always manually typed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Address:
                    </label>
                    <input
                      type="text"
                      value={withdrawalAddress}
                      onChange={(e) => { setWithdrawalAddress(e.target.value); setError(""); }}
                      placeholder="Your wallet address"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#16a34a] transition-all"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <p className="text-xs text-red-500 dark:text-red-300">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-white/10">
                    <button
                      onClick={handleClose}
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmWithdrawal}
                      disabled={submitting || !selectedCurrency || !amount || !withdrawalAddress.trim()}
                      className="flex-1 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
                      style={{ background: "#16a34a", color: "#001a0f" }}
                    >
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
                      ) : (
                        "Withdraw"
                      )}
                    </button>
                  </div>

                  {/* Note */}
                  <div className="p-3 bg-green-600/10 border border-green-500/20 rounded-lg">
                    <p className="text-[10px] text-green-600">
                      <strong>Note:</strong> Withdrawals are processed within 24-48 hours. You will be notified once approved.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== SUCCESS STEP ==================== */}
          {step === "success" && (
            <div className="p-5">
              <div className="text-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Withdrawal Submitted!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your withdrawal is being processed</p>
              </div>

              <div className="bg-green-600/10 border border-green-500/20 rounded-xl p-3.5 mb-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">${parseFloat(withdrawAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Source:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{withdrawSource === "profit" ? "Profit" : "Capital"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{selectedCurrency}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-green-500/20">
                  <span className="text-gray-500 dark:text-gray-400">Reference:</span>
                  <span className="text-green-600 font-semibold font-mono text-xs">{withdrawRef}</span>
                </div>
              </div>

              <div className="bg-green-600/10 border border-green-500/20 rounded-xl p-3.5 mb-3">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Processing Time</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Withdrawals are processed within 24-48 hours after approval.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
                style={{ background: "#16a34a", color: "#001a0f" }}
              >
                Got It!
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
