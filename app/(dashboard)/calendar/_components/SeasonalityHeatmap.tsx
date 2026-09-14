"use client";

import useSWR from "swr";
import { formatCompactUSD, LABEL_COLOR } from "../_lib/helpers";

interface SeasonalityCell {
  weekday: string;
  month: string;
  avg_pnl: number;
  trades: number;
}
interface SeasonalityResponse {
  success: boolean;
  grid: SeasonalityCell[];
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function cellColor(cell: SeasonalityCell | undefined) {
  if (!cell || cell.trades === 0) return "bg-gray-100 dark:bg-white/[0.03]";
  return cell.avg_pnl > 0 ? "bg-green-500" : "bg-red-500";
}

export default function SeasonalityHeatmap() {
  const { data } = useSWR<SeasonalityResponse>("/calendar/seasonality/");
  const grid = data?.success ? data.grid : [];
  const lookup = new Map(grid.map((c) => [`${c.weekday}-${c.month}`, c]));

  return (
    <div className="tv-card rounded-xl p-4 overflow-x-auto">
      <h3 className={`text-xs font-semibold tracking-wide mb-3 ${LABEL_COLOR}`}>
        MY SEASONALITY
      </h3>
      <div className="min-w-105">
        <div className="flex">
          <div className="w-9 shrink-0" />
          {MONTHS.map((m) => (
            <div key={m} className={`flex-1 text-center text-[9px] ${LABEL_COLOR}`}>{m}</div>
          ))}
        </div>
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="flex items-stretch mt-1">
            <div className={`w-9 shrink-0 flex items-center text-[9px] ${LABEL_COLOR}`}>{wd}</div>
            {MONTHS.map((m) => {
              const cell = lookup.get(`${wd}-${m}`);
              const opacity = cell && cell.trades > 0 ? Math.min(0.85, 0.25 + Math.abs(cell.avg_pnl) / 3000) : 0.06;
              return (
                <div
                  key={m}
                  title={cell && cell.trades > 0 ? `${wd} ${m}: ${formatCompactUSD(cell.avg_pnl)} avg (${cell.trades} trades)` : "No trades"}
                  className={`flex-1 aspect-square mx-px rounded-sm ${cellColor(cell)}`}
                  style={{ opacity }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
