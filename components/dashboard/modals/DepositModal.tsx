"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, AlertCircle, Copy, Check, Upload, CheckCircle,
  Loader2, CreditCard, ArrowLeft, Info, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { apiFetch } from "@/lib/api";
import { AdminWallet } from "./types";
import { getCryptoIcon, getNetworkName } from "./crypto-icons";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DepositOptionsResponse {
  success: boolean;
  wallets: AdminWallet[];
  error?: string;
}

type DepositStep = "select" | "card" | "amount" | "address" | "success";

const TEAL = "#00C9A7";

/* ── Shared close button ── */
function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gray-100 dark:bg-white/8 hover:opacity-80 transition-opacity"
    >
      <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
    </button>
  );
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const [step, setStep] = useState<DepositStep>("select");
  const [selectedWallet, setSelectedWallet] = useState<AdminWallet | null>(null);
  const [dollarAmount, setDollarAmount] = useState("");
  const [currencyAmount, setCurrencyAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendingIntent, setSendingIntent] = useState(false);
  const [depositReference, setDepositReference] = useState("");

  // Card step
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [submittingCard, setSubmittingCard] = useState(false);
  const [cardError, setCardError] = useState("");

  // Address step
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const amountRef = useRef<HTMLInputElement>(null);

  const { data: optionsRes, isLoading: loading } = useSWR<DepositOptionsResponse>(
    isOpen ? "/deposits/options/" : null
  );
  const wallets = optionsRes?.success ? optionsRes.wallets : [];

  useEffect(() => {
    if (optionsRes && !optionsRes.success) toast.error(optionsRes.error || "Failed to load deposit options");
  }, [optionsRes]);

  // Default to the first wallet once options load, without clobbering a
  // selection the user already made (e.g. on a background revalidation).
  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) setSelectedWallet(wallets[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets]);

  useEffect(() => {
    if (step === "amount") setTimeout(() => amountRef.current?.focus(), 80);
  }, [step]);

  useEffect(() => {
    if (dollarAmount && selectedWallet) {
      const dollars = parseFloat(dollarAmount);
      const rate = parseFloat(selectedWallet.amount);
      if (!isNaN(dollars) && !isNaN(rate) && rate > 0) {
        setCurrencyAmount((dollars / rate).toFixed(8));
      } else setCurrencyAmount("");
    } else setCurrencyAmount("");
  }, [dollarAmount, selectedWallet]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError("");
    const rawNumber = cardNumber.replace(/\s/g, "");
    if (!cardholderName.trim()) { setCardError("Cardholder name is required"); return; }
    if (rawNumber.length < 13 || rawNumber.length > 19) { setCardError("Invalid card number"); return; }
    const [expMonth = "", expYear = ""] = cardExpiry.split("/").map(s => s.trim());
    if (expMonth.length !== 2 || expYear.length !== 2) { setCardError("Enter a valid expiry date (MM/YY)"); return; }
    if (parseInt(expMonth) < 1 || parseInt(expMonth) > 12) { setCardError("Invalid expiry month"); return; }
    if (cvv.length < 3 || cvv.length > 4) { setCardError("Invalid CVV"); return; }
    setSubmittingCard(true);
    try {
      const res = await apiFetch("/cards/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardholder_name: cardholderName.trim(),
          card_number: rawNumber,
          expiry_month: expMonth,
          expiry_year: `20${expYear}`,
          cvv,
          billing_address: billingAddress.trim(),
          billing_zip: billingZip.trim(),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setCardError(data.error);
      } else {
        toast.info(data.message || "Card payment is not available at this time. Please use cryptocurrency instead.");
        setCardholderName(""); setCardNumber(""); setCardExpiry("");
        setCvv(""); setBillingAddress(""); setBillingZip(""); setCardError("");
        setStep("select");
      }
    } catch {
      setCardError("Failed to connect to server");
    } finally {
      setSubmittingCard(false);
    }
  };

  const handleCopy = () => {
    if (!selectedWallet) return;
    navigator.clipboard.writeText(selectedWallet.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAmountNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dollarAmount || parseFloat(dollarAmount) <= 0) { setError("Please enter a valid amount"); return; }
    if (!currencyAmount || !selectedWallet) return;
    setError("");
    setSendingIntent(true);
    try {
      await apiFetch("/deposits/payment-intent/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: selectedWallet.currency, dollar_amount: dollarAmount, currency_unit: currencyAmount }),
      });
    } catch { /* non-blocking */ } finally { setSendingIntent(false); }
    setCopied(false);
    setReceipt(null);
    setChecked(false);
    setStep("address");
  };

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("File size must be less than 5MB"); return; }
    setReceipt(file); setError("");
  }, []);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("File size must be less than 5MB"); return; }
    setReceipt(file); setError("");
  };

  const handleConfirmDeposit = async () => {
    if (!selectedWallet || !receipt) { setError("Please upload payment proof"); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("currency", selectedWallet.currency);
      formData.append("dollar_amount", dollarAmount);
      formData.append("currency_unit", currencyAmount);
      formData.append("receipt", receipt);
      const res = await apiFetch("/deposits/create/", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setDepositReference(data.transaction.reference);
        setStep("success");
        toast.success("Deposit request submitted successfully!");
      } else toast.error(data.error || "Failed to submit deposit");
    } catch {
      toast.error("Failed to submit deposit request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("select"); setSelectedWallet(null);
    setDollarAmount(""); setCurrencyAmount("");
    setReceipt(null); setError(""); setCopied(false); setChecked(false);
    setDepositReference("");
    setCardholderName(""); setCardNumber(""); setCardExpiry("");
    setCvv(""); setBillingAddress(""); setBillingZip(""); setCardError("");
    onClose();
  };

  const handleSelectWallet = (wallet: AdminWallet) => {
    setSelectedWallet(wallet);
    setStep("amount");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-[360px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0b1a12]"
        >

          {/* ══════════════ SELECT ══════════════ */}
          {step === "select" && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Choose payment method</h3>
                <CloseBtn onClick={handleClose} />
              </div>

              <div className="h-px mb-4 bg-gray-200 dark:bg-white/7" />

              <div className="space-y-3">
                {/* Card Payment */}
                <div className="rounded-xl p-3.5 bg-[rgba(0,201,167,0.06)] dark:bg-[rgba(0,201,167,0.04)] border border-[rgba(0,201,167,0.2)] dark:border-[rgba(0,201,167,0.14)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(0,201,167,0.12)" }}>
                      <CreditCard className="w-4.5 h-4.5" style={{ color: TEAL }} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900 dark:text-white">Card Payment</p>
                      <p className="text-[11px] text-gray-500 dark:text-white/40">Visa, Mastercard, Amex, Discover</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep("card")}
                    className="w-full h-10 rounded-lg text-[13px] font-bold transition-opacity hover:opacity-90"
                    style={{ background: TEAL, color: "#001a0f" }}
                  >
                    Pay with Card
                  </button>
                </div>

              </div>

              {/* Cryptocurrency options — scrollable, Card Payment above stays put */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: TEAL }} />
                </div>
              ) : wallets.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-gray-400 dark:text-white/30 mx-auto mb-3" />
                  <p className="text-[13px] text-gray-500 dark:text-white/40">No deposit options available</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1 mt-3">
                  {wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="rounded-xl p-3.5 bg-[rgba(0,201,167,0.06)] dark:bg-[rgba(0,201,167,0.04)] border border-[rgba(0,201,167,0.2)] dark:border-[rgba(0,201,167,0.14)]"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-gray-100 dark:bg-white/8 [&_svg]:!w-5 [&_svg]:!h-5">
                          {getCryptoIcon(wallet.currency)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-gray-900 dark:text-white truncate">{wallet.currency_display}</p>
                          <p className="text-[11px] text-gray-500 dark:text-white/40">{getNetworkName(wallet.currency)}</p>
                          <p className="text-[10.5px] text-gray-400 dark:text-white/30 mt-0.5">Rate: ${wallet.amount} per unit</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectWallet(wallet)}
                        className="w-full h-10 rounded-lg text-[13px] font-bold transition-opacity hover:opacity-90"
                        style={{ background: TEAL, color: "#001a0f" }}
                      >
                        Deposit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ CARD ══════════════ */}
          {step === "card" && (
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => { setCardError(""); setStep("select"); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gray-100 dark:bg-white/8 hover:opacity-80 transition-opacity">
                  <ArrowLeft className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>
                <div className="flex-1">
                  <h3 className="text-[17px] font-bold text-gray-900 dark:text-white">Card Payment</h3>
                  <p className="text-[11px] text-gray-500 dark:text-white/40">Enter your card details</p>
                </div>
                <CloseBtn onClick={handleClose} />
              </div>

              <form onSubmit={handleCardSubmit} className="space-y-2.5">
                {[
                  { label: "Cardholder Name", value: cardholderName, setter: setCardholderName, placeholder: "John Doe", type: "text" },
                ].map(({ label, value, setter, placeholder, type }) => (
                  <div key={label}>
                    <label className="block text-[12px] font-medium mb-1 text-gray-500 dark:text-white/40">{label}</label>
                    <input type={type} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder}
                      className="w-full px-4 py-2.5 rounded-xl text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-[#00C9A7] transition-colors bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
                  </div>
                ))}
                <div>
                  <label className="block text-[12px] font-medium mb-1 text-gray-500 dark:text-white/40">Card Number</label>
                  <input type="text" inputMode="numeric" value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242" maxLength={23}
                    className="w-full px-4 py-2.5 rounded-xl text-[13px] text-gray-900 dark:text-white font-mono placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-[#00C9A7] transition-colors bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium mb-1 text-gray-500 dark:text-white/40">Expiry</label>
                    <input type="text" inputMode="numeric" value={cardExpiry} placeholder="MM/YY" maxLength={5}
                      onChange={e => {
                        const raw = e.target.value; const d = raw.replace(/\D/g, "").slice(0, 4);
                        setCardExpiry(d.length <= 2 ? d : d.slice(0, 2) + "/" + d.slice(2));
                      }}
                      className="w-full px-4 py-2.5 rounded-xl text-[13px] text-gray-900 dark:text-white font-mono placeholder-gray-400 dark:placeholder-gray-600 outline-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1 text-gray-500 dark:text-white/40">CVV</label>
                    <input type="text" inputMode="numeric" value={cvv} placeholder="123" maxLength={4}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="w-full px-4 py-2.5 rounded-xl text-[13px] text-gray-900 dark:text-white font-mono placeholder-gray-400 dark:placeholder-gray-600 outline-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium mb-1 text-gray-500 dark:text-white/40">
                    Billing Address <span className="opacity-50">(Optional)</span>
                  </label>
                  <input type="text" value={billingAddress} onChange={e => setBillingAddress(e.target.value)} placeholder="123 Main St"
                    className="w-full px-4 py-2.5 rounded-xl text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
                </div>
                {cardError && (
                  <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-[12px] text-red-400">{cardError}</p>
                  </div>
                )}
                <button type="submit" disabled={submittingCard}
                  className="w-full h-10 rounded-lg text-[13px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                  style={{ background: TEAL, color: "#001a0f" }}>
                  {submittingCard ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</> : "Add Card"}
                </button>
              </form>
            </div>
          )}

          {/* ══════════════ AMOUNT ══════════════ */}
          {step === "amount" && (
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => { setStep("select"); setError(""); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gray-100 dark:bg-white/8 hover:opacity-80 transition-opacity">
                  <ArrowLeft className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>
                <h3 className="flex-1 text-[17px] font-bold text-gray-900 dark:text-white">Enter Amount</h3>
                <CloseBtn onClick={handleClose} />
              </div>

              {/* Selected currency + rate */}
              {selectedWallet && (
                <div className="rounded-lg p-2.5 mb-2.5 bg-[rgba(0,201,167,0.06)] dark:bg-[rgba(0,201,167,0.04)] border border-[rgba(0,201,167,0.2)] dark:border-[rgba(0,201,167,0.14)]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-gray-100 dark:bg-white/8 [&_svg]:!w-4.5 [&_svg]:!h-4.5">
                      {getCryptoIcon(selectedWallet.currency)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold truncate leading-tight" style={{ color: TEAL }}>{selectedWallet.currency_display}</p>
                      <p className="text-[11px] text-gray-500 dark:text-white/40 leading-tight">Rate: ${selectedWallet.amount} per unit</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Don't have crypto? */}
              <div className="rounded-lg p-2.5 mb-3 bg-[rgba(0,201,167,0.06)] dark:bg-[rgba(0,201,167,0.04)] border border-[rgba(0,201,167,0.2)] dark:border-[rgba(0,201,167,0.14)]">
                <div className="flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: TEAL }} />
                  <div>
                    <p className="text-[11px] text-gray-700 dark:text-gray-300 mb-1.5 leading-tight">
                      Don&apos;t have cryptocurrency? Purchase from:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { name: "Binance", url: "https://www.binance.com" },
                        { name: "Coinbase", url: "https://www.coinbase.com" },
                        { name: "Crypto.com", url: "https://crypto.com" },
                        { name: "Kraken", url: "https://www.kraken.com" },
                      ].map((ex) => (
                        <a
                          key={ex.name}
                          href={ex.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded text-[9px] font-medium bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors hover:text-[#00C9A7]"
                        >
                          {ex.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Big amount input */}
              <form onSubmit={handleAmountNext}>
                <div className="flex flex-col items-center mb-3">
                  <input
                    ref={amountRef}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={dollarAmount}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      const parts = val.split(".");
                      if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return;
                      setDollarAmount(val); setError("");
                    }}
                    className={`text-[52px] font-bold bg-transparent border-none outline-none text-center w-full ${
                      dollarAmount ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-white/25"
                    }`}
                  />
                  {error && <p className="text-[12px] text-red-400 mt-1">{error}</p>}
                  <p className="text-[12px] text-center mt-2" style={{ color: "rgba(255,165,0,0.8)" }}>
                    All deposits are converted to USD for ease of use
                  </p>
                </div>

                {/* You will get */}
                <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-white/7">
                  <span className="text-[13px] text-gray-500 dark:text-white/40">You will get</span>
                  <span className="text-[13px] font-bold text-gray-900 dark:text-white">
                    {dollarAmount && parseFloat(dollarAmount) > 0
                      ? `${parseFloat(dollarAmount).toFixed(2)} USD`
                      : "0.00 USD"}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!dollarAmount || parseFloat(dollarAmount) <= 0 || sendingIntent}
                  className="w-full h-10 rounded-lg text-[13px] font-bold transition-opacity hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: TEAL, color: "#001a0f" }}
                >
                  {sendingIntent ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</> : "Deposit"}
                </button>
              </form>
            </div>
          )}

          {/* ══════════════ ADDRESS + UPLOAD ══════════════ */}
          {step === "address" && selectedWallet && (
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => { setStep("amount"); setReceipt(null); setError(""); setCopied(false); setChecked(false); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gray-100 dark:bg-white/8 hover:opacity-80 transition-opacity">
                  <ArrowLeft className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>
                <div className="flex-1" />
                <CloseBtn onClick={handleClose} />
              </div>

              {/* Fund from Wallet — subtle, secondary to the coin icon below */}
              <div className="flex justify-center mb-2">
                <button
                  onClick={() => router.push("/connect-wallet")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/8 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  Fund from Wallet
                </button>
              </div>

              {/* Coin icon */}
              <div className="flex flex-col items-center text-center mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden mb-2 [&_svg]:!w-12 [&_svg]:!h-12"
                  style={{ border: "2px solid rgba(0,201,167,0.2)" }}>
                  {getCryptoIcon(selectedWallet.currency)}
                </div>
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">
                  {selectedWallet.currency}
                  {selectedWallet.currency !== getNetworkName(selectedWallet.currency) &&
                    ` (${getNetworkName(selectedWallet.currency)})`}
                </h3>

                {/* Wallet address */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-mono truncate max-w-[210px]" style={{ color: TEAL }}>
                    {selectedWallet.wallet_address}
                  </span>
                  <button onClick={handleCopy} title={copied ? "Copied!" : "Copy address"}
                    className="shrink-0 transition-colors"
                    style={{ color: copied ? TEAL : isDark ? "rgba(255,255,255,0.4)" : "#9CA3AF" }}>
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* QR code — scan to send */}
              {selectedWallet.qr_code_url && (
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-lg bg-white">
                    <Image
                      src={selectedWallet.qr_code_url}
                      alt="Wallet QR code"
                      width={96}
                      height={96}
                      className="rounded"
                      unoptimized
                    />
                    <p className="text-center text-[9px] text-gray-500 mt-1 font-medium">Scan to pay</p>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px mb-3 bg-gray-200 dark:bg-white/7" />

              {/* Checkbox */}
              <div className="flex items-center gap-3 mb-3 cursor-pointer select-none"
                onClick={() => setChecked(v => !v)}>
                <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    background: checked ? TEAL : "transparent",
                    border: checked ? `2px solid ${TEAL}` : isDark ? "2px solid rgba(255,255,255,0.25)" : "2px solid #D1D5DB",
                  }}>
                  {checked && <Check className="w-3 h-3 text-[#001a0f]" strokeWidth={3} />}
                </div>
                <span className="text-[13px] text-gray-700 dark:text-white/70">
                  I have funded my wallet
                </span>
              </div>

              {/* Upload area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="rounded-xl p-3 transition-all mb-3"
                style={{
                  border: `1.5px dashed ${isDragging ? TEAL : isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"}`,
                  background: isDragging ? "rgba(0,201,167,0.06)" : isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
                }}
              >
                <input type="file" id="deposit-proof" accept="image/*,.pdf"
                  onChange={handleFileInput} className="hidden" />
                {receipt ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden shrink-0 bg-gray-100 dark:bg-white/8">
                      {receipt.type.startsWith("image/")
                        ? <img src={URL.createObjectURL(receipt)} alt="preview" className="w-full h-full object-cover rounded-lg" />
                        : <Upload className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-gray-900 dark:text-white font-medium truncate">{receipt.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-white/40">{(receipt.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button onClick={() => setReceipt(null)}
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(239,68,68,0.15)" }}>
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="deposit-proof" className="flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(0,201,167,0.12)" }}>
                      <Upload className="w-4 h-4" style={{ color: TEAL }} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-gray-900 dark:text-white">Upload payment proof</p>
                      <p className="text-[10px] text-gray-500 dark:text-white/40">PNG, JPG or PDF (max. 5MB)</p>
                    </div>
                  </label>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 mb-3 rounded-xl p-3"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-[12px] text-red-400">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleConfirmDeposit}
                disabled={!checked || !receipt || submitting}
                className="w-full h-11 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2"
                style={{
                  background: checked && receipt ? TEAL : "rgba(0,201,167,0.18)",
                  color: checked && receipt ? "#001a0f" : "rgba(0,201,167,0.45)",
                  cursor: checked && receipt ? "pointer" : "not-allowed",
                }}
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</> : "Top up complete"}
              </button>
            </div>
          )}

          {/* ══════════════ SUCCESS ══════════════ */}
          {step === "success" && (
            <div className="p-5 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                style={{ background: "rgba(0,201,167,0.12)" }}>
                <CheckCircle className="w-7 h-7" style={{ color: TEAL }} />
              </div>
              <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-1.5">Deposit Submitted!</h3>
              <p className="text-[13px] leading-relaxed mb-1.5 text-gray-500 dark:text-white/40">
                Your deposit is pending confirmation.
              </p>
              {depositReference && (
                <p className="text-[11px] font-mono mb-3" style={{ color: TEAL }}>Ref: {depositReference}</p>
              )}
              <p className="text-[12px] mb-4 text-gray-500 dark:text-white/40">
                Funds will be credited within 30 minutes to 24 hours after verification.
              </p>
              <button
                onClick={() => { handleClose(); router.push("/transactions"); }}
                className="w-full h-10 rounded-lg text-[13px] font-bold transition-opacity hover:opacity-90"
                style={{ background: TEAL, color: "#001a0f" }}
              >
                Done
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
