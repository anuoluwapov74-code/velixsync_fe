"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Filter, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Trade {
  id: number;
  trader_id: number | null;
  trader_name: string | null;
  trader_username: string | null;
  trader_avatar_url: string | null;
  market: string;
  market_name: string;
  market_logo_url: string | null;
  custom_image_url: string | null;
  direction: "buy" | "sell";
  direction_display: string;
  duration: string;
  amount: string;
  entry_price: string;
  exit_price: string | null;
  profit_loss_percent: string;
  user_profit_loss: string;
  status: "open" | "closed";
  status_display: string;
  time_ago: string;
  is_profit: boolean;
  opened_at: string | null;
  closed_at: string | null;
  reference: string;
}

interface TradeHistoryResponse {
  success: boolean;
  trades: Trade[];
  total_count: number;
}

export default function TradeHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all");
  const [showFilters, setShowFilters] = useState(false);

  const swrKey = `/copy-trader/history/?limit=100${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`;
  const { data, error: fetchError, isLoading: loading, mutate: refetch } = useSWR<TradeHistoryResponse>(swrKey);
  const trades = data?.success ? data.trades : [];
  const totalCount = data?.success ? data.total_count : 0;
  const error = fetchError ? "Failed to load trade history" : null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Trade History
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {totalCount} {totalCount === 1 ? "trade" : "trades"} total
            </p>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 tv-card rounded-lg text-sm font-medium text-gray-300 hover:opacity-80 transition-all"
          >
            <Filter className="w-4 h-4" />
            Filters
            {statusFilter !== "all" && (
              <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                1
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 tv-card rounded-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Filter Trades
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="flex gap-2">
                  {["all", "open", "closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as typeof statusFilter)}
                      className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                        statusFilter === status
                          ? "bg-[#16a34a] text-[#001a0f]"
                          : "tv-inner text-gray-300 hover:opacity-80"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && trades.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              No trades yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              {statusFilter !== "all"
                ? `No ${statusFilter} trades found`
                : "Start copying expert traders to see your trade history here"}
            </p>
            <Link href="/explore-traders">
              <button className="px-6 py-2.5 bg-[#16a34a] hover:opacity-90 text-[#001a0f] text-sm font-semibold rounded-lg transition-colors">
                Explore Traders
              </button>
            </Link>
          </div>
        )}

        {/* Trades List */}
        {!loading && !error && trades.length > 0 && (
          <div className="tv-card rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 tv-inner border-b border-[rgba(255,255,255,0.06)]">
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Asset
              </div>
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Direction
              </div>
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Entry Price
              </div>
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                P&L
              </div>
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </div>
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Time
              </div>
            </div>

            {/* Trade Rows */}
            <div className="divide-y divide-[rgba(255,255,255,0.06)]">
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-4 hover:bg-[rgba(22,163,74,0.04)] transition-all"
                >
                  {/* Asset */}
                  <div className="flex items-center gap-3">
                    {(trade.custom_image_url ?? trade.market_logo_url) && (
                      <Image
                        src={trade.custom_image_url ?? trade.market_logo_url!}
                        alt={trade.market_name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full shrink-0 object-cover"
                        unoptimized
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {trade.market_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 md:hidden">
                        {trade.market}
                      </p>
                    </div>
                  </div>

                  {/* Direction */}
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        trade.direction === "buy"
                          ? "bg-green-100 dark:bg-green-500/10 text-green-600"
                          : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {trade.direction === "buy" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {trade.direction_display}
                    </span>
                  </div>

                  {/* Entry Price */}
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      ${parseFloat(trade.entry_price).toFixed(2)}
                    </span>
                  </div>

                  {/* P&L */}
                  <div className="flex items-center">
                    <div>
                      <span
                        className={`text-sm font-semibold ${
                          trade.is_profit
                            ? "text-green-600"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {trade.is_profit ? "+" : ""}${parseFloat(trade.user_profit_loss).toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ({trade.is_profit ? "+" : ""}{parseFloat(trade.profit_loss_percent).toFixed(2)}%)
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <span
                      className={`text-xs font-medium ${
                        trade.status === "open"
                          ? "text-green-600"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {trade.status_display}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {trade.time_ago}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
