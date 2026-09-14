"use client";

import { motion } from "framer-motion";
import { BarChart2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTheme } from "next-themes";

export function LiveTradingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full rounded-2xl p-3 tv-card flex justify-center"
    >
      <motion.a
        href="/session"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="inline-flex items-center gap-2.5 py-2.5 px-4 rounded-xl transition-all"
        style={{ background: "rgba(239,68,68,0.1)" }}
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
        <BarChart2 className="w-4 h-4 text-red-400" />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Go to Session
        </span>
      </motion.a>
    </motion.div>
  );
}

/* ── Donut: generic ring chart, segments drawn clockwise from 12 o'clock.
   Sized purely via CSS classes (not width/height attrs) so it scales down
   on narrow screens instead of forcing the card to overflow. ── */
function Donut({ segments }: { segments: { pct: number; color: string }[] }) {
  const size = 168, stroke = 30, r = (size - stroke) / 2, c = 2 * Math.PI * r;

  // Precompute each segment's dash length + running start-offset without
  // mutating a variable across the render map.
  const arcs = segments.reduce<{ dash: number; offset: number; color: string }[]>((acc, seg) => {
    const dash = (Math.max(seg.pct, 0) / 100) * c;
    const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    return [...acc, { dash, offset, color: seg.color }];
  }, []);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-20 h-20 sm:w-24 sm:h-24 shrink-0">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={stroke}
            strokeDasharray={`${arc.dash} ${c - arc.dash}`}
            strokeDashoffset={-arc.offset}
          />
        ))}
      </g>
    </svg>
  );
}

interface PortfolioBreakdownProps {
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
}

// Light palette matches the Arctic White reference exactly; dark palette
// keeps the app's existing dark card look (same tokens used elsewhere on
// the dashboard home page).
const donutTheme = {
  light: {
    cardBg: "rgba(255,255,255,0.55)",
    cardBorder: "1px solid rgba(255,255,255,0.9)",
    cardShadow: "0 8px 32px rgba(31,41,55,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    accent: "#16a34a",
    secondary: "#3b82f6",
  },
  dark: {
    cardBg: "#111e1b",
    cardBorder: "1px solid rgba(255,255,255,0.06)",
    cardShadow: "0 28px 80px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.35)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.45)",
    accent: "#00C9A7",
    secondary: "#3b82f6",
  },
};

export function PortfolioBreakdownCard({ balance, totalDeposits, totalWithdrawals, totalProfits }: PortfolioBreakdownProps) {
  void totalDeposits;
  void totalWithdrawals;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const t = isDark ? donutTheme.dark : donutTheme.light;

  const total = balance + totalProfits;
  const profitPct = total > 0 ? Math.max((totalProfits / total) * 100, 0) : 0;
  const depositedPct = total > 0 ? Math.max(100 - profitPct, 0) : 0;
  const growthPct = balance > 0 ? (totalProfits / balance) * 100 : 0;
  const isPositive = growthPct >= 0;

  const legend = [
    { label: `Profits (${profitPct.toFixed(0)}%)`, pct: `${profitPct.toFixed(0)}%`, color: t.accent },
    { label: `Deposited (${depositedPct.toFixed(0)}%)`, pct: `${depositedPct.toFixed(0)}%`, color: t.secondary },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-3xl p-5 backdrop-blur-xl overflow-hidden"
      style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow }}
    >
      <h3 className="text-base font-bold" style={{ color: t.textPrimary }}>Asset allocation</h3>
      <div className="flex items-center justify-between mt-4 gap-3">
        <div className="min-w-0">
          <p className="text-xl font-bold flex items-center gap-1" style={{ color: isPositive ? t.accent : "#ef4444" }}>
            {isPositive ? "+" : ""}{growthPct.toFixed(2)}%
            {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
          </p>
          <p className="text-xs mt-1 max-w-[140px]" style={{ color: t.textSecondary }}>
            portfolio growth from total deposits
          </p>
          <div className="mt-5 space-y-2.5">
            {legend.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2" style={{ color: t.textPrimary }}>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                  {row.label}
                </span>
                <span style={{ color: t.textSecondary }}>{row.pct}</span>
              </div>
            ))}
          </div>
        </div>
        <Donut segments={[{ pct: profitPct, color: t.accent }, { pct: depositedPct, color: t.secondary }]} />
      </div>
    </motion.div>
  );
}

// Keep backward-compatible export alias
export const AssetAllocationCard = PortfolioBreakdownCard;
