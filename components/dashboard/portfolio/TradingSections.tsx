"use client";

import { motion } from "framer-motion";
import { ChevronDown, BarChart2, Users, Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { useTheme } from "next-themes";
import Image from "next/image";

interface CopiedTrade {
  id: number;
  trader_name: string | null;
  trader_id: number | null;
  market: string;
  market_name: string;
  market_logo_url: string | null;
  custom_image_url: string | null;
  direction: "buy" | "sell";
  duration: string;
  entry_price: string;
  exit_price: string | null;
  profit_loss_percent: string;
  user_profit_loss: string;
  status: "open" | "closed";
  time_ago: string;
  is_profit: boolean;
}

interface FollowingTrader {
  id: number;
  trader_id: number;
  trader_name: string;
  trader_username: string;
  trader_avatar_url: string | null;
  initial_investment: string;
  started_copying_at: string;
}

// ── VelixSync's own theme tokens — light matches the Arctic White reference
// (translucent glass over the page's radial gradient), dark matches the rest
// of the dashboard's established dark card (solid #111e1b, teal-free here
// since accent stays the same green in both themes per an earlier request).
const cardTheme = {
  light: {
    cardBg: "rgba(255,255,255,0.55)",
    cardBorder: "1px solid rgba(255,255,255,0.9)",
    cardShadow: "0 8px 32px rgba(31,41,55,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    divider: "rgba(15,23,42,0.06)",
    neutralBg: "rgba(15,23,42,0.05)",
    inputBg: "rgba(255,255,255,0.7)",
    skeletonBg: "rgba(15,23,42,0.08)",
    rowBorder: "1px solid rgba(15,23,42,0.06)",
    hoverBg: "rgba(15,23,42,0.025)",
  },
  dark: {
    cardBg: "#111e1b",
    cardBorder: "1px solid rgba(255,255,255,0.06)",
    cardShadow: "0 28px 80px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.35)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.45)",
    divider: "rgba(255,255,255,0.08)",
    neutralBg: "rgba(255,255,255,0.06)",
    inputBg: "rgba(255,255,255,0.04)",
    skeletonBg: "rgba(255,255,255,0.06)",
    rowBorder: "1px solid rgba(255,255,255,0.05)",
    hoverBg: "rgba(255,255,255,0.03)",
  },
};

// Same green (and same red) in both themes — only the pill/tint backgrounds
// shift per theme for contrast, the accent color itself never changes.
const ACCENT = "#16a34a";
const ACCENT_SOFT = { light: "rgba(22,163,74,0.12)", dark: "rgba(22,163,74,0.18)" };
const RED = "#ef4444";
const RED_SOFT = { light: "rgba(239,68,68,0.1)", dark: "rgba(239,68,68,0.15)" };

/* ── Skeleton block ── */
function Sk({ className, bg }: { className?: string; bg: string }) {
  return <div className={`animate-pulse rounded ${className ?? ""}`} style={{ background: bg }} />;
}

/* ── Chevron used by both accordion headers ── */
function AccordionChevron({ open, color }: { open: boolean; color: string }) {
  return (
    <ChevronDown
      size={16}
      strokeWidth={1.8}
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      style={{ color }}
    />
  );
}

/* ── Asset logo — real image if we have one, else a colored initials circle ── */
function AssetLogo({ trade }: { trade: CopiedTrade }) {
  const src = trade.custom_image_url ?? trade.market_logo_url;
  if (src) {
    return (
      <Image
        src={src}
        alt={trade.market_name}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full shrink-0 object-cover"
        unoptimized
      />
    );
  }
  const initials = trade.market.slice(0, 3).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 select-none bg-[#1a1a1a] text-white">
      {initials}
    </div>
  );
}

// Dashboard preview only shows the most recent trades — the full list lives
// on /trade-history.
const TRADE_PREVIEW_LIMIT = 5;

const dirLabel = (d: "buy" | "sell") => (d === "buy" ? "Buy" : "Sell");
const statusLabel = (s: "open" | "closed") => s.charAt(0).toUpperCase() + s.slice(1);

const fmtEarning = (pct: string) => {
  const n = parseFloat(pct);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
};

const fmtPnl = (trade: CopiedTrade) =>
  `${trade.is_profit ? "+" : "-"}$${Math.abs(parseFloat(trade.user_profit_loss)).toFixed(2)}`;

interface CopiedTradesResponse {
  success: boolean;
  trades: CopiedTrade[];
}

export function TradeCopiedSection() {
  const [open, setOpen] = useState(true);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const t = isDark ? cardTheme.dark : cardTheme.light;
  const accentSoft = isDark ? ACCENT_SOFT.dark : ACCENT_SOFT.light;
  const redSoft = isDark ? RED_SOFT.dark : RED_SOFT.light;

  // Backend already returns trades sorted newest-first (by opened_at desc).
  const { data, isLoading: loading } = useSWR<CopiedTradesResponse>("/copy-trader/trades/");
  const trades = useMemo(() => (data?.success ? data.trades : []), [data]);

  const visibleTrades = trades.slice(0, TRADE_PREVIEW_LIMIT);

  const statusStyle = (status: "open" | "closed") =>
    status === "open"
      ? { background: accentSoft, color: ACCENT }
      : { background: t.neutralBg, color: t.textSecondary };

  const dirStyle = (direction: "buy" | "sell") =>
    direction === "buy"
      ? { background: accentSoft, color: ACCENT }
      : { background: redSoft, color: RED };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-3xl backdrop-blur-xl overflow-hidden"
      style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button type="button" onClick={() => setOpen((v) => !v)} className="text-left">
          <h2 className="text-[16px] font-bold" style={{ color: t.textPrimary }}>Trade Copied</h2>
        </button>
        <button type="button" onClick={() => setOpen((v) => !v)}>
          <AccordionChevron open={open} color={t.textSecondary} />
        </button>
      </div>

      {open && (loading ? (
        <div className="px-5 pb-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-4 space-y-3" style={{ border: t.rowBorder }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sk className="w-8 h-8 rounded-full" bg={t.skeletonBg} />
                  <Sk className="h-4 w-24" bg={t.skeletonBg} />
                </div>
                <Sk className="h-5 w-14" bg={t.skeletonBg} />
              </div>
              <div className="flex gap-4">
                <Sk className="h-3 w-16" bg={t.skeletonBg} />
                <Sk className="h-3 w-16" bg={t.skeletonBg} />
                <Sk className="h-3 w-16" bg={t.skeletonBg} />
              </div>
            </div>
          ))}
        </div>
      ) : visibleTrades.length === 0 ? (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mb-4" style={{ background: t.neutralBg }}>
            <BarChart2 size={28} strokeWidth={1.5} style={{ color: t.textSecondary }} />
          </div>
          <p className="text-[15px] font-bold mb-1.5" style={{ color: t.textPrimary }}>No trades yet</p>
          <p className="text-[13px] leading-relaxed mb-5 max-w-[220px]" style={{ color: t.textSecondary }}>
            Start copying expert traders to see your trades here
          </p>
          <Link
            href="/explore-traders"
            className="h-10 px-8 rounded-xl flex items-center justify-center text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: ACCENT }}
          >
            Explore Traders
          </Link>
        </div>
      ) : (
        <>
          {/* ── Mobile cards (< sm) ── */}
          <div className="sm:hidden flex flex-col gap-3 px-4 pb-4">
            {visibleTrades.map((trade) => (
              <div key={trade.id} className="rounded-2xl overflow-hidden" style={{ border: t.rowBorder }}>
                {/* Asset row + status */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                  <div className="flex items-center gap-2.5">
                    <AssetLogo trade={trade} />
                    <div>
                      <p className="text-[14px] font-bold leading-tight" style={{ color: t.textPrimary }}>{trade.market_name}</p>
                      <p className="text-[11px]" style={{ color: t.textSecondary }}>
                        {trade.market} · {trade.duration}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize" style={statusStyle(trade.status)}>
                    {statusLabel(trade.status)}
                  </span>
                </div>

                <div style={{ borderTop: t.divider }} />

                {/* Labels */}
                <div className="grid grid-cols-3 px-4 pt-3 pb-1 gap-2">
                  {["DIRECTION", "ENTRY", "EARNING"].map((lbl) => (
                    <span key={lbl} className="text-[10px] font-medium uppercase tracking-wide" style={{ color: t.textSecondary }}>
                      {lbl}
                    </span>
                  ))}
                </div>

                {/* Values */}
                <div className="grid grid-cols-3 px-4 pb-3 gap-2 items-center">
                  <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full w-fit" style={dirStyle(trade.direction)}>
                    {dirLabel(trade.direction)}
                  </span>
                  <span className="text-[13px]" style={{ color: t.textPrimary }}>
                    ${parseFloat(trade.entry_price).toLocaleString()}
                  </span>
                  <span className="text-[13px] font-bold" style={{ color: parseFloat(trade.profit_loss_percent) >= 0 ? ACCENT : RED }}>
                    {fmtEarning(trade.profit_loss_percent)}
                  </span>
                </div>

                {/* PNL footer */}
                <div style={{ borderTop: t.divider }} />
                <div className="flex items-center gap-2 px-4 py-3">
                  <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: t.textSecondary }}>PNL</span>
                  <span className="text-[14px] font-bold" style={{ color: trade.is_profit ? ACCENT : RED }}>{fmtPnl(trade)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop scrollable table (sm+) ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr style={{ borderBottom: t.divider }}>
                  {["Asset", "Ticker", "Direction", "Entry", "Earning %", "P&L", "Duration", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wide whitespace-nowrap" style={{ color: t.textSecondary }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleTrades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="transition-colors"
                    style={{ borderBottom: t.divider }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = t.hoverBg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <AssetLogo trade={trade} />
                        <p className="text-[13px] font-semibold" style={{ color: t.textPrimary }}>{trade.market_name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[12px]" style={{ color: t.textSecondary }}>
                      {trade.market}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] font-bold px-2.5 py-1 rounded-full" style={dirStyle(trade.direction)}>
                        {dirLabel(trade.direction)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] whitespace-nowrap" style={{ color: t.textPrimary }}>
                      ${parseFloat(trade.entry_price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] font-semibold whitespace-nowrap" style={{ color: parseFloat(trade.profit_loss_percent) >= 0 ? ACCENT : RED }}>
                      {fmtEarning(trade.profit_loss_percent)}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] font-semibold whitespace-nowrap" style={{ color: trade.is_profit ? ACCENT : RED }}>
                      {fmtPnl(trade)}
                    </td>
                    <td className="px-4 py-3.5 text-[12px] whitespace-nowrap" style={{ color: t.textSecondary }}>
                      {trade.duration}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full capitalize" style={statusStyle(trade.status)}>
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ))}
    </motion.div>
  );
}

interface FollowingResponse {
  success: boolean;
  traders: FollowingTrader[];
}

export function FollowingSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(true);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const t = isDark ? cardTheme.dark : cardTheme.light;

  const { data, isLoading: loading } = useSWR<FollowingResponse>("/copy-trader/following/");
  const traders = useMemo(() => (data?.success ? data.traders : []), [data]);

  const filteredTraders = useMemo(() => {
    if (searchQuery.trim() === "") return traders;
    const q = searchQuery.toLowerCase();
    return traders.filter(
      (trader) =>
        trader.trader_name.toLowerCase().includes(q) ||
        trader.trader_username.toLowerCase().includes(q)
    );
  }, [searchQuery, traders]);

  const getInitials = (name: string) =>
    name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

  const isEmpty = traders.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-3xl backdrop-blur-xl overflow-hidden"
      style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 pt-5 pb-4 text-left"
      >
        <h2 className="text-[16px] font-bold" style={{ color: t.textPrimary }}>Following</h2>
        <AccordionChevron open={open} color={t.textSecondary} />
      </button>

      {open && (
        <div className="px-5 pb-5">
          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: t.textSecondary }}>
              <Search size={13} strokeWidth={1.5} />
            </div>
            <input
              type="text"
              placeholder="Search for trader"
              disabled={isEmpty}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl text-[13px] outline-none transition-colors"
              style={{ background: t.inputBg, border: t.rowBorder, color: t.textPrimary }}
              onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "")}
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Sk className="w-8 h-8 rounded-full shrink-0" bg={t.skeletonBg} />
                  <Sk className="h-4 flex-1" bg={t.skeletonBg} />
                  <Sk className="h-4 w-14 shrink-0" bg={t.skeletonBg} />
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            /* ── No experts followed ── */
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center mb-3" style={{ background: t.neutralBg }}>
                <Users size={26} strokeWidth={1.5} style={{ color: t.textSecondary }} />
              </div>
              <p className="text-[14px] font-bold mb-1" style={{ color: t.textPrimary }}>No experts followed</p>
              <p className="text-[12px] leading-relaxed mb-5 max-w-[200px]" style={{ color: t.textSecondary }}>
                Start copying expert traders to see them here
              </p>
              <Link
                href="/explore-traders"
                className="h-10 px-6 rounded-xl flex items-center justify-center text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: ACCENT }}
              >
                Explore Traders
              </Link>
            </div>
          ) : filteredTraders.length === 0 ? (
            /* ── Search returned nothing ── */
            <p className="text-[13px] text-center py-6" style={{ color: t.textSecondary }}>No traders match your search</p>
          ) : (
            /* ── Trader list ── */
            <div className="flex flex-col gap-3">
              {filteredTraders.map((trader) => (
                <Link
                  key={trader.id}
                  href={`/explore-traders/${trader.trader_id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {trader.trader_avatar_url ? (
                    <Image
                      src={trader.trader_avatar_url}
                      alt={trader.trader_name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center text-[11px] font-bold text-white shrink-0 rounded-full bg-[#4a7a6a]">
                      {getInitials(trader.trader_name)}
                    </div>
                  )}
                  <span className="flex-1 text-[13px] font-medium truncate" style={{ color: t.textPrimary }}>
                    {trader.trader_name}
                  </span>
                  <span className="text-[13px] font-semibold shrink-0" style={{ color: t.textPrimary }}>
                    ${parseFloat(trader.initial_investment).toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
