"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, X, CheckCircle, AlertCircle, Activity, Shield, Target } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Signal {
  id: number;
  name: string;
  signal_type: string;
  price: string;
  signal_strength: string;
  action: string;
  risk_level: string;
  timeframe: string;
  status: string;
  is_featured: boolean;
  is_purchased: boolean;
  market_analysis: string;
  entry_point: string;
  target_price: string;
  stop_loss: string;
  technical_indicators: string;
  fundamental_analysis: string;
  created_at: string;
  expires_at: string | null;
}

interface PurchasedSignal {
  id: number;
  signal_id: number;
  signal_name: string;
  signal_type: string;
  amount_paid: string;
  purchase_reference: string;
  purchased_at: string;
  signal_data: any;
  current_signal: {
    name: string;
    signal_strength: string;
    market_analysis: string;
    entry_point: string;
    target_price: string;
    stop_loss: string;
    action: string;
    timeframe: string;
    risk_level: string;
    status: string;
  } | null;
}

const SIGNALS_KEY = "/signals/";
const PURCHASED_SIGNALS_KEY = "/signals/purchased/";

interface SignalsResponse {
  success: boolean;
  signals: Signal[];
  user_balance: string;
}

interface PurchasedSignalsResponse {
  success: boolean;
  purchases: PurchasedSignal[];
}

export default function SignalsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "purchased">("all");
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const { data: signalsRes, isLoading: loading, mutate: mutateSignals } = useSWR<SignalsResponse>(SIGNALS_KEY);
  const { data: purchasedRes, mutate: mutatePurchased } = useSWR<PurchasedSignalsResponse>(PURCHASED_SIGNALS_KEY);
  const signals = signalsRes?.success ? signalsRes.signals : [];
  const purchasedSignals = purchasedRes?.success ? purchasedRes.purchases : [];
  const userBalance = signalsRes?.success ? signalsRes.user_balance : "0";

  const handlePurchase = async () => {
    if (!selectedSignal) return;

    const signalPrice = parseFloat(selectedSignal.price);
    const balance = parseFloat(userBalance);

    if (balance < signalPrice) {
      return;
    }

    setPurchasing(true);
    try {
      const response = await apiFetch(`/signals/${selectedSignal.id}/purchase/`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        mutateSignals(
          (current) =>
            current?.success
              ? {
                  ...current,
                  user_balance: data.new_balance,
                  signals: current.signals.map((s) => (s.id === selectedSignal.id ? { ...s, is_purchased: true } : s)),
                }
              : current,
          { revalidate: false }
        );
        mutatePurchased();
        setShowPurchaseModal(false);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error purchasing signal:", error);
    } finally {
      setPurchasing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-green-500 bg-green-500/10";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10";
      case "high":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const getActionColor = (action: string) => {
    if (action.toLowerCase().includes("buy")) return "text-green-500";
    if (action.toLowerCase().includes("sell")) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                Trading Signals
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Professional trading signals from expert analysts
              </p>
            </div>

            {/* Balance Display */}
            <div className="bg-green-600/10 dark:bg-green-500/20 border-2 border-green-600 rounded-xl px-6 py-4">
              <div className="text-xs md:text-sm text-green-600 mb-1">
                Wallet Balance
              </div>
              <div className="text-base sm:text-sm font-bold text-gray-900 dark:text-white">
                ${parseFloat(userBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === "all"
                  ? "text-green-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              All Signals
              {activeTab === "all" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("purchased")}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === "purchased"
                  ? "text-green-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Purchased Signals
              {activeTab === "purchased" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-blue-400" />
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* All Signals Grid */}
            {activeTab === "all" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {signals.map((signal) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="tv-card rounded-2xl p-6 hover:border-[#16a34a] transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {signal.name}
                          </h3>
                          {signal.is_featured && (
                            <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {signal.signal_type}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                          ${parseFloat(signal.price).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Signal Price
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="tv-inner rounded-lg p-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Strength
                        </div>
                        <div className="text-sm font-bold text-green-600">
                          {parseFloat(signal.signal_strength).toFixed(0)}%
                        </div>
                      </div>
                      <div className="tv-inner rounded-lg p-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Action
                        </div>
                        <div className={`text-sm font-bold ${getActionColor(signal.action)}`}>
                          {signal.action}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Timeframe:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {signal.timeframe}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Risk Level:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRiskColor(signal.risk_level)}`}>
                          {signal.risk_level.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={() => {
                        setSelectedSignal(signal);
                        setShowPurchaseModal(true);
                      }}
                      disabled={signal.is_purchased}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        signal.is_purchased
                          ? "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "hover:opacity-90"
                      }`}
                      style={!signal.is_purchased ? { background: "#16a34a", color: "#001a0f" } : undefined}
                    >
                      {signal.is_purchased ? "Already Purchased" : "Purchase Signal"}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Purchased Signals */}
            {activeTab === "purchased" && (
              <div className="space-y-6">
                {purchasedSignals.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      You haven&apos;t purchased any signals yet
                    </p>
                  </div>
                ) : (
                  purchasedSignals.map((purchase) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="tv-card rounded-2xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {purchase.signal_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Purchased {new Date(purchase.purchased_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            ${parseFloat(purchase.amount_paid).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {purchase.purchase_reference}
                          </div>
                        </div>
                      </div>

                      {purchase.current_signal && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 tv-inner rounded-lg p-4">
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Entry Point
                            </div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {purchase.current_signal.entry_point}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Target Price
                            </div>
                            <div className="text-sm font-semibold text-green-500">
                              {purchase.current_signal.target_price}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Stop Loss
                            </div>
                            <div className="text-sm font-semibold text-red-500">
                              {purchase.current_signal.stop_loss}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && selectedSignal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPurchaseModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPurchaseModal(false)}
            >
              <div
                className="rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-6">
                  Purchase Signal
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="tv-inner rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Signal</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedSignal.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(selectedSignal.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Your Balance
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(userBalance).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {parseFloat(userBalance) < parseFloat(selectedSignal.price) && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-red-600 dark:text-red-400 mb-1">
                          Insufficient Balance
                        </div>
                        <div className="text-sm text-red-600 dark:text-red-400">
                          You need ${parseFloat(selectedSignal.price).toFixed(2)} but only have $
                          {parseFloat(userBalance).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePurchase}
                    disabled={
                      purchasing || parseFloat(userBalance) < parseFloat(selectedSignal.price)
                    }
                    className="flex-1 py-3 bg-[#16a34a] hover:opacity-90 text-[#001a0f] font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchasing ? "Processing..." : "Confirm Purchase"}
                  </button>
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && selectedSignal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="rounded-2xl max-w-md w-full p-6 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2">
                  Purchase Successful!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You have successfully purchased {selectedSignal.name}
                </p>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSelectedSignal(null);
                    setActiveTab("purchased");
                  }}
                  className="w-full py-3 bg-[#16a34a] hover:opacity-90 text-[#001a0f] font-semibold rounded-lg transition-all"
                >
                  View Purchased Signals
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
