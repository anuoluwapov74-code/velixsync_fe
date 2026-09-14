"use client";

import useSWR from "swr";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCompactUSD, LABEL_COLOR } from "../_lib/helpers";

interface Trade {
  id: number;
  market: string;
  market_name: string;
  direction: "buy" | "sell";
  user_profit_loss: string;
  is_profit: boolean;
  status: "open" | "closed";
  time_ago: string;
}
interface HistoryResponse {
  success: boolean;
  trades: Trade[];
}

export default function RecentTradesPanel() {
  const { data } = useSWR<HistoryResponse>("/copy-trader/history/?status=closed&limit=6");
  const trades = data?.success ? data.trades : [];

  return (
    <div className="tv-card rounded-xl p-4">
      <h3 className={`text-xs font-semibold tracking-wide mb-3 ${LABEL_COLOR}`}>
        RECENT TRADES
      </h3>
      {trades.length === 0 ? (
        <div className="h-40 flex items-center justify-center">
          <p className="text-sm text-blue-400">No recent trades</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {trades.map((t) => {
            const pl = parseFloat(t.user_profit_loss);
            return (
              <div key={t.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  {t.is_profit ? (
                    <TrendingUp className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  )}
                  <span className="truncate text-gray-700 dark:text-gray-300">{t.market_name || t.market}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-gray-400">{t.time_ago}</span>
                  <span className={`font-semibold ${t.is_profit ? "text-green-500" : "text-red-400"}`}>
                    {t.is_profit ? "+" : ""}{formatCompactUSD(pl)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
