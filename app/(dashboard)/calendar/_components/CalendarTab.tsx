"use client";

import { useState } from "react";
import useSWR from "swr";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { MONTH_NAMES, formatCompactUSD, LABEL_COLOR } from "../_lib/helpers";
import CalendarGrid from "./CalendarGrid";
import PerformancePanel from "./PerformancePanel";
import DailyPnlChart from "./DailyPnlChart";
import SeasonalityHeatmap from "./SeasonalityHeatmap";
import RecentTradesPanel from "./RecentTradesPanel";
import ShareModal from "./ShareModal";
import TopStatsBar from "./TopStatsBar";

interface Summary {
  total_closed_trades: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_return_pct: number;
  total_pnl: number;
  avg_hold_seconds: number | null;
  best_day: number | null;
  best_day_pnl: number | null;
}
interface CalendarDataResponse {
  success: boolean;
  daily_pnl: Record<string, number>;
  daily_trade_counts: Record<string, number>;
  summary: Summary;
  radar: { you: { profit_factor: number; avg_win: number; avg_loss: number } };
}

type Period = "week" | "month" | "year";

function getToday() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

export default function CalendarTab() {
  const today = getToday();
  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);
  const [period, setPeriod] = useState<Period>("month");
  const [isShareOpen, setIsShareOpen] = useState(false);

  const { data, isLoading } = useSWR<CalendarDataResponse>(
    `/calendar/?year=${year}&month=${month}&period=month`
  );
  const dailyPnl = data?.success ? data.daily_pnl : {};
  const dailyTradeCounts = data?.success ? data.daily_trade_counts : {};
  const summary = data?.success ? data.summary : null;
  const monthlyTotal = summary ? summary.total_pnl : 0;
  const tradingDays = Object.keys(dailyPnl).length;
  const profitFactor = data?.success ? data.radar.you.profit_factor : 0;
  const avgWin = data?.success ? data.radar.you.avg_win : 0;
  const avgLoss = data?.success ? data.radar.you.avg_loss : 0;

  function goToPrevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); } else { setMonth((m) => m - 1); }
  }
  function goToNextMonth() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); } else { setMonth((m) => m + 1); }
  }
  function goToToday() {
    setYear(today.year);
    setMonth(today.month);
  }
  function handleShare() {
    setIsShareOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Always-visible summary — win rate / total trades etc. before any scrolling */}
      <TopStatsBar
        totalPnl={monthlyTotal}
        avgWin={avgWin}
        avgLoss={avgLoss}
        profitFactor={profitFactor}
        winRate={summary?.win_rate ?? 0}
        totalClosedTrades={summary?.total_closed_trades ?? 0}
        wins={summary?.wins ?? 0}
        losses={summary?.losses ?? 0}
        tradingDays={tradingDays}
      />

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button onClick={goToPrevMonth} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/8 transition-colors shrink-0">
            <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
            {MONTH_NAMES[month - 1]} {year}
          </h2>
          <button onClick={goToNextMonth} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/8 transition-colors shrink-0">
            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={goToToday}
            className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors shrink-0"
          >
            Today
          </button>
          <button
            onClick={handleShare}
            className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-1 shrink-0"
          >
            <Share2 className="w-3 h-3" /> Share
          </button>
        </div>

        <div className={`flex items-center gap-1.5 text-xs sm:text-sm ${LABEL_COLOR}`}>
          <span>Monthly</span>
          <span className={`font-bold ${monthlyTotal > 0 ? "text-green-500" : monthlyTotal < 0 ? "text-red-400" : "text-gray-900 dark:text-white"}`}>
            {monthlyTotal >= 0 ? "" : "-"}{formatCompactUSD(Math.abs(monthlyTotal))}
          </span>
          <span>·</span>
          <span>{tradingDays} {tradingDays === 1 ? "day" : "days"}</span>
        </div>
      </div>

      {/* Calendar + Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
        {isLoading ? (
          <div className="tv-card rounded-xl h-96 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#16a34a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <CalendarGrid year={year} month={month} dailyPnl={dailyPnl} dailyTradeCounts={dailyTradeCounts} today={today} />
        )}
        <PerformancePanel year={year} month={month} period={period} onPeriodChange={setPeriod} />
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DailyPnlChart year={year} month={month} dailyPnl={dailyPnl} />
        <SeasonalityHeatmap />
        <RecentTradesPanel />
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        year={year}
        month={month}
        dailyPnl={dailyPnl}
        summary={summary}
        profitFactor={profitFactor}
      />
    </div>
  );
}
