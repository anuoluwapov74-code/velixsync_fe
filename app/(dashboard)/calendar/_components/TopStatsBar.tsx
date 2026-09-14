"use client";

import { formatCompactUSD, LABEL_COLOR } from "../_lib/helpers";

interface Props {
  totalPnl: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  winRate: number;
  totalClosedTrades: number;
  wins: number;
  losses: number;
  tradingDays: number;
}

/** Always-visible summary — the stats a user should see immediately, before
 * ever scrolling to the calendar or the MY PERFORMANCE panel. Stacks as a
 * full-width divided list on mobile (matching the reference design) and
 * becomes a single 5-column row with vertical dividers from `sm` up. */
export default function TopStatsBar({
  totalPnl, avgWin, avgLoss, profitFactor, winRate, totalClosedTrades, wins, losses, tradingDays,
}: Props) {
  const winTotal = avgWin + Math.abs(avgLoss);
  const winShare = winTotal > 0 ? (avgWin / winTotal) * 100 : 50;

  return (
    <div className="tv-card rounded-xl overflow-hidden sm:p-5">
      <div className="divide-y divide-gray-200 dark:divide-white/10 sm:divide-y-0 sm:grid sm:grid-cols-5 sm:gap-2 sm:divide-x sm:dark:divide-white/10">
        <Stat label="NET P&L" align="left" className="sm:pr-2">
          <p className={`text-xl sm:text-2xl font-bold ${totalPnl > 0 ? "text-green-500" : totalPnl < 0 ? "text-red-400" : "text-gray-900 dark:text-white"}`}>
            {totalPnl >= 0 ? "" : "-"}{formatCompactUSD(Math.abs(totalPnl))}
          </p>
        </Stat>

        <Stat label="AVG WIN / LOSS" className="sm:px-2">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-green-500 shrink-0">{formatCompactUSD(avgWin)}</span>
            <span className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden min-w-[40px]">
              <span className="flex h-full">
                <span className="bg-green-500 h-full" style={{ width: `${winShare}%` }} />
                <span className="bg-red-400 h-full" style={{ width: `${100 - winShare}%` }} />
              </span>
            </span>
            <span className="text-red-400 shrink-0">-{formatCompactUSD(Math.abs(avgLoss))}</span>
          </div>
        </Stat>

        <Stat label="PROFIT FACTOR" className="sm:px-2">
          <p className={`text-xl sm:text-2xl font-bold ${profitFactor > 1 ? "text-green-500" : "text-red-400"}`}>
            {profitFactor.toFixed(2)}
          </p>
        </Stat>

        <Stat label="WIN RATE" className="sm:px-2">
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{winRate.toFixed(1)}%</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">{wins}W / {losses}L</p>
        </Stat>

        <Stat label="TOTAL TRADES" className="sm:pl-2">
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalClosedTrades}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">{tradingDays} trading {tradingDays === 1 ? "day" : "days"}</p>
        </Stat>
      </div>
    </div>
  );
}

function Stat({
  label, align = "center", className, children,
}: { label: string; align?: "left" | "center"; className?: string; children: React.ReactNode }) {
  return (
    <div className={`px-4 py-3 sm:p-0 ${align === "left" ? "text-left" : "text-center sm:text-left"} ${className ?? ""}`}>
      <p className={`text-[10px] font-semibold tracking-wide mb-1 ${LABEL_COLOR}`}>{label}</p>
      {children}
    </div>
  );
}
