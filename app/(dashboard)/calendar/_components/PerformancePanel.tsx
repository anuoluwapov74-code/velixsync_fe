"use client";

import useSWR from "swr";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import { MONTH_NAMES, LABEL_COLOR } from "../_lib/helpers";

type Period = "week" | "month" | "year";

interface RadarMetrics {
  win_rate: number;
  avg_win: number;
  avg_loss: number;
  avg_gain_pct: number;
  profit_factor: number;
}

interface CalendarDataResponse {
  success: boolean;
  summary: {
    total_closed_trades: number;
    win_rate: number;
    total_return_pct: number;
    total_pnl: number;
  };
  radar: { you: RadarMetrics; average_trader: RadarMetrics };
}

interface Props {
  year: number;
  month: number;
  period: Period;
  onPeriodChange: (p: Period) => void;
}

const METRIC_LABELS: { key: keyof RadarMetrics; label: string }[] = [
  { key: "win_rate", label: "Win Rate" },
  { key: "avg_loss", label: "Average Loss" },
  { key: "avg_win", label: "Average Win" },
  { key: "avg_gain_pct", label: "Average Gain" },
  { key: "profit_factor", label: "Profit Factor" },
];

/** Normalizes each axis independently so the bigger of {you, average}
 * always reaches 100 — lets metrics with wildly different units (%, $,
 * ratio) share one radar without one axis swamping the others. */
function buildRadarData(you: RadarMetrics, avg: RadarMetrics) {
  return METRIC_LABELS.map(({ key, label }) => {
    const a = Math.abs(you[key]);
    const b = Math.abs(avg[key]);
    const scale = Math.max(a, b, 1e-9);
    return {
      metric: label,
      you: (a / scale) * 100,
      average: (b / scale) * 100,
      youRaw: you[key],
      averageRaw: avg[key],
    };
  });
}

function formatRaw(key: keyof RadarMetrics, v: number): string {
  if (key === "win_rate" || key === "avg_gain_pct") return `${v.toFixed(1)}%`;
  if (key === "profit_factor") return v.toFixed(2);
  return `$${v.toFixed(2)}`;
}

export default function PerformancePanel({ year, month, period, onPeriodChange }: Props) {
  const { data } = useSWR<CalendarDataResponse>(
    `/calendar/?year=${year}&month=${month}&period=${period}`
  );

  const summary = data?.success ? data.summary : null;
  const radar = data?.success ? data.radar : null;
  const hasTrades = (summary?.total_closed_trades ?? 0) > 0;
  const radarData = radar ? buildRadarData(radar.you, radar.average_trader) : [];

  const periodLabel =
    period === "week" ? "THIS WEEK" : period === "year" ? `THIS YEAR ${year}` : `THIS MONTH ${MONTH_NAMES[month - 1].toUpperCase()} ${year}`;

  return (
    <div className="tv-card rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xs font-semibold tracking-wide ${LABEL_COLOR}`}>MY PERFORMANCE</h3>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 text-xs">
          {(["week", "month", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-2.5 py-1 capitalize transition-colors ${
                period === p
                  ? "bg-[#16a34a] text-[#001a0f] font-semibold"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <Stat label="Total Closed Trades" value={summary ? String(summary.total_closed_trades) : "—"} />
        <Stat label="Win Rate" value={summary ? `${summary.win_rate.toFixed(2)}%` : "—"} highlight />
        <Stat label="Total Return" value={summary ? `${summary.total_return_pct.toFixed(2)}%` : "—"} highlight />
      </div>

      <p className={`text-[10px] font-semibold tracking-wide mb-1 ${LABEL_COLOR}`}>{periodLabel}</p>
      {!hasTrades && <p className="text-xs text-red-400 mb-3">No trades in this range.</p>}

      <div className="h-64 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#9ca3af", fontSize: 10 }} />
            <Radar name="Your Stats" dataKey="you" stroke="#16a34a" fill="#16a34a" fillOpacity={0.35} />
            <Radar name="Average Trader" dataKey="average" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.15} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-4 mt-1 text-[11px]">
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
          <span className="w-2 h-2 rounded-full bg-[#16a34a]" /> Your Stats
        </span>
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
          <span className="w-2 h-2 rounded-full bg-[#60a5fa]" /> Average Trader
        </span>
      </div>

      {radar && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          {METRIC_LABELS.map(({ key, label }) => (
            <div key={key} className="flex justify-between gap-2">
              <span className="text-gray-500 dark:text-gray-400 truncate">{label}</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium shrink-0">
                {formatRaw(key, radar.you[key])}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={LABEL_COLOR}>{label}</span>
      <span className={`font-semibold ${highlight ? "text-[#16a34a]" : "text-gray-900 dark:text-white"}`}>
        {value}
      </span>
    </div>
  );
}
