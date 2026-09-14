"use client";

import { useState } from "react";
import useSWR from "swr";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCompactUSD, LABEL_COLOR } from "../_lib/helpers";

interface Trade {
  id: number;
  trader_name: string | null;
  market: string;
  market_name: string;
  direction: "buy" | "sell";
  direction_display: string;
  amount: string;
  entry_price: string;
  exit_price: string | null;
  profit_loss_percent: string;
  user_profit_loss: string;
  status: "open" | "closed";
  status_display: string;
  is_profit: boolean;
  opened_at: string | null;
  closed_at: string | null;
  reference: string;
}
interface HistoryResponse {
  success: boolean;
  trades: Trade[];
  total_count: number;
}

const LIMIT = 25;

export default function TradeLogTab() {
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all");
  const [offset, setOffset] = useState(0);

  const swrKey = `/copy-trader/history/?limit=${LIMIT}&offset=${offset}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`;
  const { data, isLoading } = useSWR<HistoryResponse>(swrKey);
  const trades = data?.success ? data.trades : [];
  const totalCount = data?.success ? data.total_count : 0;

  function formatDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Trade Log</h2>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 text-xs">
          {(["all", "open", "closed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setOffset(0); }}
              className={`px-3 py-1.5 capitalize transition-colors ${
                statusFilter === s
                  ? "bg-[#00C9A7] text-[#001a0f] font-semibold"
                  : `${LABEL_COLOR} hover:bg-gray-100 dark:hover:bg-white/5`
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="tv-card rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#00C9A7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : trades.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            No trades found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className={`border-b border-gray-200 dark:border-white/10 text-left text-xs ${LABEL_COLOR}`}>
                  <th className="px-4 py-2.5 font-medium">Market</th>
                  <th className="px-4 py-2.5 font-medium">Direction</th>
                  <th className="px-4 py-2.5 font-medium">Amount</th>
                  <th className="px-4 py-2.5 font-medium">P/L %</th>
                  <th className="px-4 py-2.5 font-medium">P/L</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Closed</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => {
                  const pl = parseFloat(t.user_profit_loss);
                  return (
                    <tr key={t.id} className="border-b border-gray-100 dark:border-white/5 last:border-b-0">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-gray-900 dark:text-white">{t.market_name || t.market}</p>
                        {t.trader_name && <p className="text-[10px] text-gray-400">via {t.trader_name}</p>}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`flex items-center gap-1 text-xs font-medium ${t.direction === "buy" ? "text-green-500" : "text-red-400"}`}>
                          {t.direction === "buy" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {t.direction_display}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">${parseFloat(t.amount).toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{parseFloat(t.profit_loss_percent).toFixed(2)}%</td>
                      <td className={`px-4 py-2.5 font-semibold ${t.is_profit ? "text-green-500" : "text-red-400"}`}>
                        {t.is_profit ? "+" : ""}{formatCompactUSD(pl)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          t.status === "closed" ? "bg-gray-500/20 text-gray-500 dark:text-gray-300" : "bg-yellow-500/20 text-yellow-500"
                        }`}>
                          {t.status_display}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400">{formatDate(t.closed_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalCount > LIMIT && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{offset + 1}–{Math.min(offset + LIMIT, totalCount)} of {totalCount}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
              disabled={offset === 0}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset((o) => o + LIMIT)}
              disabled={offset + LIMIT >= totalCount}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
