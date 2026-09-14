"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import { formatUSD, LABEL_COLOR } from "../_lib/helpers";
import SeasonalityHeatmap from "./SeasonalityHeatmap";

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
  summary: { total_closed_trades: number; win_rate: number; total_return_pct: number; total_pnl: number };
  radar: { you: RadarMetrics; average_trader: RadarMetrics };
}

const METRIC_LABELS: { key: keyof RadarMetrics; label: string }[] = [
  { key: "win_rate", label: "Win Rate" },
  { key: "avg_loss", label: "Average Loss" },
  { key: "avg_win", label: "Average Win" },
  { key: "avg_gain_pct", label: "Average Gain" },
  { key: "profit_factor", label: "Profit Factor" },
];

function buildRadarData(you: RadarMetrics, avg: RadarMetrics) {
  return METRIC_LABELS.map(({ key, label }) => {
    const a = Math.abs(you[key]);
    const b = Math.abs(avg[key]);
    const scale = Math.max(a, b, 1e-9);
    return { metric: label, you: (a / scale) * 100, average: (b / scale) * 100 };
  });
}

export default function StatsTab() {
  const now = new Date();
  const [period, setPeriod] = useState<Period>("month");
  const { data } = useSWR<CalendarDataResponse>(
    `/calendar/?year=${now.getFullYear()}&month=${now.getMonth() + 1}&period=${period}`
  );
  const summary = data?.success ? data.summary : null;
  const radar = data?.success ? data.radar : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Stats</h2>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 text-xs">
          {(["week", "month", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 capitalize transition-colors ${
                period === p ? "bg-[#16a34a] text-[#001a0f] font-semibold" : `${LABEL_COLOR} hover:bg-gray-100 dark:hover:bg-white/5`
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Closed Trades" value={summary ? String(summary.total_closed_trades) : "—"} />
        <StatCard label="Win Rate" value={summary ? `${summary.win_rate.toFixed(2)}%` : "—"} accent />
        <StatCard label="Total Return" value={summary ? `${summary.total_return_pct.toFixed(2)}%` : "—"} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="tv-card rounded-xl p-5">
          <h3 className={`text-xs font-semibold tracking-wide mb-3 ${LABEL_COLOR}`}>
            YOU VS. AVERAGE TRADER
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar ? buildRadarData(radar.you, radar.average_trader) : []} outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Radar name="Your Stats" dataKey="you" stroke="#16a34a" fill="#16a34a" fillOpacity={0.35} />
                <Radar name="Average Trader" dataKey="average" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#16a34a]" /> Your Stats
            </span>
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#60a5fa]" /> Average Trader
            </span>
          </div>
        </div>

        <div className="tv-card rounded-xl p-5">
          <h3 className={`text-xs font-semibold tracking-wide mb-4 ${LABEL_COLOR}`}>
            BREAKDOWN
          </h3>
          {radar ? (
            <div className="space-y-3">
              {METRIC_LABELS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className={LABEL_COLOR}>{label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {key === "win_rate" || key === "avg_gain_pct"
                      ? `${radar.you[key].toFixed(2)}%`
                      : key === "profit_factor"
                      ? radar.you[key].toFixed(2)
                      : formatUSD(radar.you[key])}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm ${LABEL_COLOR}`}>No data yet.</p>
          )}
        </div>
      </div>

      <SeasonalityHeatmap />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="tv-card rounded-xl p-4">
      <p className={`text-xs mb-1 ${LABEL_COLOR}`}>{label}</p>
      <p className={`text-2xl font-bold ${accent ? "text-[#16a34a]" : "text-gray-900 dark:text-white"}`}>{value}</p>
    </div>
  );
}
