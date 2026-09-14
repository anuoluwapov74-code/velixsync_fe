"use client";

interface HeroBalanceCardProps {
  totalBalance: number;
  totalProfits: number;
  balance: number;
  isVerified: boolean;
  isDark: boolean;
}

const fmt = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Same decorative curve for both themes — there's no real historical balance
// timeseries from the backend, so this stays a static, recolorable trend
// line rather than fabricating fake data points.
const AREA_PATH =
  "M0.0,48.6 L10.7,47.7 L21.3,49.0 L32.0,45.8 L42.7,46.4 L53.3,43.8 L64.0,44.9 L74.7,41.6 L85.3,42.7 L96.0,39.9 L106.7,40.8 L117.3,38.4 L128.0,39.5 L138.7,36.2 L149.3,36.9 L160.0,33.4 L170.7,34.7 L181.3,31.2 L192.0,29.5 L202.7,26.9 L213.3,27.6 L224.0,23.9 L234.7,22.2 L245.3,18.9 L256.0,17.4 L266.7,13.5 L277.3,11.8 L288.0,7.0 L288,59 L0,59 Z";
const LINE_PATH =
  "M0.0,48.6 L10.7,47.7 L21.3,49.0 L32.0,45.8 L42.7,46.4 L53.3,43.8 L64.0,44.9 L74.7,41.6 L85.3,42.7 L96.0,39.9 L106.7,40.8 L117.3,38.4 L128.0,39.5 L138.7,36.2 L149.3,36.9 L160.0,33.4 L170.7,34.7 L181.3,31.2 L192.0,29.5 L202.7,26.9 L213.3,27.6 L224.0,23.9 L234.7,22.2 L245.3,18.9 L256.0,17.4 L266.7,13.5 L277.3,11.8 L288.0,7.0";

const tokens = {
  light: {
    cardBg: "rgba(255,255,255,0.55)",
    cardBorder: "1px solid rgba(255,255,255,0.9)",
    cardShadow: "0 8px 32px rgba(31,41,55,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    accent: "#16a34a",
    accentSoft: "rgba(22,163,74,0.12)",
    chipBg: "rgba(255,255,255,0.7)",
    dividerColor: "rgba(15,23,42,0.06)",
  },
  dark: {
    cardBg: "linear-gradient(135deg, #0a1512 0%, #0d1a15 60%, #111e1b 100%)",
    cardBorder: "1px solid rgba(255,255,255,0.06)",
    cardShadow: "0 28px 80px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.35)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.45)",
    accent: "#00C9A7",
    accentSoft: "rgba(0,201,167,0.15)",
    chipBg: "rgba(0,201,167,0.1)",
    dividerColor: "rgba(255,255,255,0.08)",
  },
};

// Same arrangement in both themes — only the color tokens differ (per the
// "maintain dark mode's theme color, nothing else about arrangement" note).
export default function HeroBalanceCard({ totalBalance, totalProfits, balance, isVerified, isDark }: HeroBalanceCardProps) {
  const t = isDark ? tokens.dark : tokens.light;
  const isProfitPositive = totalProfits >= 0;
  const profitPercent = balance > 0 ? (totalProfits / balance) * 100 : 0;

  return (
    <div
      className="rounded-3xl p-5 backdrop-blur-2xl relative overflow-hidden"
      style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow }}
    >
      {isDark && (
        <>
          <div className="absolute pointer-events-none" style={{
            top: -15, right: -15, width: 190, height: 150,
            background: "radial-gradient(ellipse at center, rgba(0,201,167,0.2) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />
          <div className="absolute pointer-events-none" style={{
            bottom: -15, left: -15, width: 160, height: 125,
            background: "radial-gradient(ellipse at center, rgba(0,201,167,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />
        </>
      )}

      <div className="relative flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-bold leading-none">
            <span style={{ color: t.accent }}>Velix</span>
            <span style={{ color: t.textPrimary }}>Sync</span>
          </span>
          {isVerified && (
            <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: t.accent }}>
              <span>✓</span> Verified
            </div>
          )}
        </div>
        <span
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: t.chipBg, border: `1px solid ${t.cardBorder.replace("1px solid ", "")}`, color: t.textPrimary }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.accent }} /> Live
        </span>
      </div>

      <div className="relative mt-5">
        <p className="text-sm" style={{ color: t.textSecondary }}>Total balance</p>
        <p className="text-4xl font-bold mt-1 tracking-tight" style={{ color: t.textPrimary }}>{fmt(totalBalance)}</p>
        <p className="text-sm font-semibold mt-1.5 flex items-center gap-1" style={{ color: isProfitPositive ? t.accent : "#ef4444" }}>
          <span>{isProfitPositive ? "▲" : "▼"}</span> {fmt(Math.abs(totalProfits))} ({isProfitPositive ? "+" : ""}{profitPercent.toFixed(2)}%) today
        </p>
      </div>

      <div className="relative h-32 mt-3 -mx-1">
        <svg viewBox="-20 -5 328 64" preserveAspectRatio="none" fill="none" style={{ width: "100%", height: "100%", display: "block" }}>
          <defs>
            <linearGradient id={`chartAreaFill-${isDark ? "dark" : "light"}`} x1="288" y1="7" x2="60" y2="59" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={t.accent} stopOpacity="0.28" />
              <stop offset="45%" stopColor={t.accent} stopOpacity="0.08" />
              <stop offset="100%" stopColor={t.accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={AREA_PATH} fill={`url(#chartAreaFill-${isDark ? "dark" : "light"})`} />
          <path d={LINE_PATH} stroke={t.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      <div className="relative grid grid-cols-3 gap-2 pt-4 mt-1" style={{ borderTop: `1px solid ${t.dividerColor}` }}>
        <div>
          <p className="text-xs" style={{ color: t.textSecondary }}>Profit</p>
          <p className="text-base font-bold mt-0.5" style={{ color: isProfitPositive ? t.accent : "#ef4444" }}>{fmt(totalProfits)}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: t.textSecondary }}>Deposited</p>
          <p className="text-base font-bold mt-0.5" style={{ color: t.textPrimary }}>{fmt(balance)}</p>
        </div>
        <div className="flex items-start justify-end">
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
            style={{ background: isProfitPositive ? t.accentSoft : "rgba(239,68,68,0.1)", color: isProfitPositive ? t.accent : "#ef4444" }}
          >
            {isProfitPositive ? "▲" : "▼"} {isProfitPositive ? "+" : ""}{profitPercent.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
