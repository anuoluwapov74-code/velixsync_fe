"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCompactUSD, LABEL_COLOR } from "../_lib/helpers";

interface Props {
  year: number;
  month: number;
  dailyPnl: Record<string, number>;
}

export default function DailyPnlChart({ year, month, dailyPnl }: Props) {
  const daysInMonth = new Date(year, month, 0).getDate();
  let cumulative = 0;
  const data = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    cumulative += dailyPnl[String(day)] ?? 0;
    return { day, cumulative };
  });
  const hasTrades = Object.keys(dailyPnl).length > 0;

  return (
    <div className="tv-card rounded-xl p-4">
      <h3 className={`text-xs font-semibold tracking-wide mb-3 ${LABEL_COLOR}`}>
        DAILY NET CUMULATIVE P&amp;L
      </h3>
      {!hasTrades ? (
        <div className="h-40 flex items-center justify-center">
          <p className="text-sm text-blue-400">No trades this month</p>
        </div>
      ) : (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C9A7" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00C9A7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCompactUSD(v)}
                width={48}
              />
              <Tooltip
                contentStyle={{ background: "#0b1a12", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 8, fontSize: 12 }}
                labelFormatter={(d) => `Day ${d}`}
                formatter={(v?: number) => [formatCompactUSD(v ?? 0), "Cumulative P&L"]}
              />
              <Area type="monotone" dataKey="cumulative" stroke="#00C9A7" strokeWidth={2} fill="url(#pnlGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
