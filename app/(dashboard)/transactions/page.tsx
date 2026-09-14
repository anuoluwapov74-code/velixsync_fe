"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  Info,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import { Transaction } from "@/components/dashboard/modals/types";

interface TransactionHistoryResponse {
  success: boolean;
  transactions: Transaction[];
}

export default function TransactionHistoryPage() {
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all");

  const { data, error, isLoading: loading } = useSWR<TransactionHistoryResponse>(
    `/transactions/history/?limit=50&type=${filter}`
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">Transaction History</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">View all your deposits and withdrawals</p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex gap-2"
      >
        {(["all", "deposit", "withdrawal"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors text-center ${
              filter !== f
                ? "bg-white/90 dark:bg-[#0d3320]/80 border border-gray-200/50 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                : ""
            }`}
            style={filter === f ? { background: "#16a34a", color: "#001a0f" } : undefined}
          >
            <span className="sm:hidden">
              {f === "all" ? "All" : f === "deposit" ? "Deposits" : "Withdrawals"}
            </span>
            <span className="hidden sm:inline">
              {f === "all" ? "All Transactions" : f === "deposit" ? "Deposits" : "Withdrawals"}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="tv-card backdrop-blur-xl rounded-2xl overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <Info className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {filter !== "all" ? `No ${filter}s to display. Try switching filters.` : "Your transaction history will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-start sm:items-center justify-between p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-white/2 transition-colors gap-3"
              >
                {/* Left: icon + details */}
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                    tx.transaction_type === "deposit" ? "bg-green-500/15" : "bg-red-500/15"
                  }`}>
                    {tx.transaction_type === "deposit" ? (
                      <ArrowDownRight className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {tx.transaction_type_display}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-[10px] text-gray-500 font-mono truncate max-w-22.5 sm:max-w-none">{tx.reference}</p>
                      {tx.currency && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-gray-200 dark:bg-white/5 rounded text-gray-600 dark:text-gray-400 shrink-0">
                          {tx.currency}
                        </span>
                      )}
                    </div>
                    {/* Date shown inline on mobile, below reference */}
                    <p className="text-[10px] text-gray-400 mt-0.5 sm:hidden">{formatDate(tx.created_at)}</p>
                  </div>
                </div>

                {/* Right: status + amount stacked on mobile */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-4 shrink-0">
                  <p className={`text-xs sm:text-sm font-bold whitespace-nowrap ${
                    tx.transaction_type === "deposit" ? "text-green-600" : "text-red-500 dark:text-red-400"
                  }`}>
                    {tx.transaction_type === "deposit" ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-gray-500 hidden sm:block whitespace-nowrap">{formatDate(tx.created_at)}</p>
                    <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${getStatusColor(tx.status)}`}>
                      {tx.status_display}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
