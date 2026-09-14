"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { Transaction } from "./types";

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TransactionHistoryResponse {
  success: boolean;
  transactions: Transaction[];
}

export default function TransactionHistoryModal({
  isOpen,
  onClose,
}: TransactionHistoryModalProps) {
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all");

  const { data, error, isLoading: loading } = useSWR<TransactionHistoryResponse>(
    isOpen ? `/transactions/history/?limit=20&type=${filter}` : null
  );
  const transactions = data?.success ? data.transactions : [];

  useEffect(() => {
    if (error) toast.error("Failed to load transactions");
  }, [error]);

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl bg-white dark:bg-[#0b1a12] border border-gray-200 dark:border-[rgba(0,201,167,0.14)]"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Transaction History
              </h3>
              <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-5">
              {(["all", "deposit", "withdrawal"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    filter !== f
                      ? "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                      : ""
                  }`}
                  style={filter === f ? { background: "#00C9A7", color: "#001a0f" } : undefined}
                >
                  {f === "all" ? "All" : f === "deposit" ? "Deposits" : "Withdrawals"}
                </button>
              ))}
            </div>

            {/* Transactions List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <Info className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/6 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.transaction_type === "deposit"
                            ? "bg-green-500/15"
                            : "bg-red-500/15"
                        }`}>
                          {tx.transaction_type === "deposit" ? (
                            <ArrowDownRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {tx.transaction_type_display}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">{tx.reference}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status_display}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-gray-500">{formatDate(tx.created_at)}</p>
                      <p className={`text-base font-bold ${
                        tx.transaction_type === "deposit" ? "text-green-400" : "text-red-400"
                      }`}>
                        {tx.transaction_type === "deposit" ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                      </p>
                    </div>

                    {tx.currency && (
                      <div className="mt-1.5">
                        <span className="text-[10px] px-2 py-0.5 bg-gray-200 dark:bg-white/5 rounded text-gray-600 dark:text-gray-400">
                          {tx.currency}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
