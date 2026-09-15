"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Calendar, BarChart3, Plus, Minus, Users as UsersIcon } from "lucide-react";
import { PROFILE_KEY } from "@/lib/swrKeys";
import {
  FollowingSection,
  TradeCopiedSection,
} from "@/components/dashboard/portfolio/TradingSections";
import {
  PortfolioBreakdownCard,
} from "@/components/dashboard/portfolio/DashboardCards";
import HeroBalanceCard from "@/components/dashboard/portfolio/HeroBalanceCard";
import DepositModal from "@/components/dashboard/modals/DepositModal";
import WithdrawModal from "@/components/dashboard/modals/WithdrawModal";
import AccountsModal from "@/components/dashboard/modals/AccountsModal";
// Same tab content as the standalone /calendar page — reused directly (not
// duplicated) so the two stay in sync automatically. /calendar itself is
// untouched; this just renders the same self-contained components here too.
import CalendarTab from "../calendar/_components/CalendarTab";
import StatsTab from "../calendar/_components/StatsTab";

interface DashboardData {
  balance: number;
  availableBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
  isVerified: boolean;
  firstName: string;
  target: number;
  showPortfolioGrowth: boolean;
}

interface ProfileResponse {
  success: boolean;
  user: {
    balance: string;
    profit: string;
    is_verified?: boolean;
    first_name?: string;
    target?: string | number;
    show_portfolio_growth?: boolean;
  };
}

interface TransactionHistoryResponse {
  success: boolean;
  transactions: Array<{ status: string; amount: string }>;
}

function sumCompleted(res: TransactionHistoryResponse | undefined): number {
  if (!res?.success) return 0;
  return res.transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
}

// ── Light palette ──
const sg = {
  cardBg: "#fff",
  cardBorder: "1px solid rgba(0,0,0,0.07)",
  cardShadow: "0 28px 80px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.05)",
  heroBg: "#fff",
  darkText: "#0a1a0f",
  mutedText: "rgba(10,26,15,0.45)",
  fadedText: "rgba(10,26,15,0.3)",
  accent: "#059669",
  accentDark: "#059669",
  accentBright: "#10b981",
  statBg: "#f5fbf7",
  statBorder: "1px solid rgba(5,150,105,0.12)",
  divider: "rgba(5,150,105,0.1)",
  pillBg: "rgba(5,150,105,0.08)",
  pillBorder: "rgba(5,150,105,0.2)",
  iconBg: "rgba(5,150,105,0.1)",
  iconGrad: "linear-gradient(135deg, #059669, #047857)",
  sectionBg: "#fff",
};

// ── Dark palette ──
const dk = {
  cardBg: "#111e1b",
  cardBorder: "1px solid rgba(255,255,255,0.06)",
  cardShadow: "0 28px 80px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.35)",
  heroBg: "#111e1b",
  darkText: "#ffffff",
  mutedText: "rgba(255,255,255,0.45)",
  fadedText: "rgba(255,255,255,0.3)",
  accent: "#16a34a",
  accentDark: "#16a34a",
  accentBright: "#16a34a",
  statBg: "#0a1512",
  statBorder: "1px solid rgba(22,163,74,0.1)",
  divider: "rgba(22,163,74,0.1)",
  pillBg: "rgba(22,163,74,0.1)",
  pillBorder: "rgba(22,163,74,0.25)",
  iconBg: "rgba(22,163,74,0.12)",
  iconGrad: "linear-gradient(135deg, #059669, #047857)",
  sectionBg: "#0a1512",
};

export default function PortfolioPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: profileRes, isLoading: profileLoading, mutate: mutateProfile } = useSWR<ProfileResponse>(PROFILE_KEY);
  const { data: depositRes, isLoading: depositsLoading, mutate: mutateDeposits } = useSWR<TransactionHistoryResponse>("/deposits/history/?limit=100");
  const { data: withdrawalRes, isLoading: withdrawalsLoading, mutate: mutateWithdrawals } = useSWR<TransactionHistoryResponse>("/withdrawals/history/?limit=100");

  const isLoading = profileLoading || depositsLoading || withdrawalsLoading;

  const dashboardData: DashboardData = useMemo(() => {
    const user = profileRes?.success ? profileRes.user : null;
    return {
      balance: user ? parseFloat(user.balance) || 0 : 0,
      availableBalance: user ? parseFloat(user.balance) || 0 : 0,
      totalDeposits: sumCompleted(depositRes),
      totalWithdrawals: sumCompleted(withdrawalRes),
      totalProfits: user ? parseFloat(user.profit) || 0 : 0,
      isVerified: user?.is_verified || false,
      firstName: user?.first_name || "",
      target: user?.target != null ? parseFloat(String(user.target)) : 50000,
      showPortfolioGrowth: user?.show_portfolio_growth || false,
    };
  }, [profileRes, depositRes, withdrawalRes]);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const [activeQuickTab, setActiveQuickTab] = useState(0);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const p = isDark ? dk : sg;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Revalidate everything after a deposit/withdrawal completes, so the hero
  // balance and progress bar reflect it without a full-page loading state.
  const refetchDashboardData = () => {
    mutateProfile();
    mutateDeposits();
    mutateWithdrawals();
  };

  const { balance, totalDeposits, totalWithdrawals, totalProfits, isVerified, firstName, target, showPortfolioGrowth } =
    dashboardData;

  void totalWithdrawals;

  // Progress bar: how far completed deposits are toward the admin-set target
  const progressWidth = target > 0 ? Math.min((totalDeposits / target) * 100, 100) : 0;
  const totalBalance = balance + totalProfits;

  const fmtCompact = (n: number) => {
    if (n >= 1_000_000_000) return "$" + (n / 1_000_000_000).toFixed(n % 1_000_000_000 === 0 ? 0 : 1) + "B";
    if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M";
    if (n >= 1_000) return "$" + (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + "k";
    return "$" + n.toFixed(0);
  };

  const handleDepositClose = () => { setShowDeposit(false); refetchDashboardData(); };
  const handleWithdrawClose = () => { setShowWithdraw(false); refetchDashboardData(); };


  return (
    <div className="space-y-4">
      {/* Quick actions — tab-style nav; visual only for now, behavior TBD.
          Sticky under the TopNav so the rest of the page scrolls beneath it. */}
      <div
        className="sticky top-0 z-20 flex items-center gap-6 border-b backdrop-blur-xl"
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
          background: isDark ? "rgba(11,26,18,0.92)" : "rgba(238,246,241,0.85)",
        }}
      >
        {([
          ["Calendar", Calendar],
          ["Stats", BarChart3],
        ] as const).map(([label, Icon], i) => {
          const active = i === activeQuickTab;
          const accentColor = isDark ? "#16a34a" : "#16a34a";
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveQuickTab(i)}
              className="flex items-center gap-1.5 pt-1 pb-2.5 text-sm border-b-2 -mb-px transition-colors"
              style={{
                borderColor: active ? accentColor : "transparent",
                color: active ? (isDark ? "#ffffff" : "#0f172a") : (isDark ? "rgba(255,255,255,0.45)" : "#94a3b8"),
                fontWeight: active ? 600 : 500,
              }}
            >
              <Icon size={15} color={active ? accentColor : "currentColor"} strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {getGreeting()}, {firstName || "Trader"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Here&apos;s an overview of your portfolio and trading activity
        </p>
      </motion.div>

      {/* ── Top row: hero card + portfolio sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 items-start">

        {/* ══ SKELETON ══ */}
        {isLoading && (
          <>
            {/* Left card skeleton */}
            <div className="rounded-[28px] overflow-hidden animate-pulse"
              style={{ background: p.cardBg, boxShadow: p.cardShadow, border: p.cardBorder }}>
              <div className="px-6 py-6" style={{ background: p.heroBg }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 rounded-md bg-emerald-300/30 dark:bg-emerald-600/20" />
                    <div className="h-3 w-16 rounded-md bg-emerald-300/20 dark:bg-emerald-600/15" />
                  </div>
                  <div className="h-6 w-14 rounded-full bg-emerald-300/30 dark:bg-emerald-600/20" />
                </div>
                <div className="h-3 w-24 rounded bg-emerald-300/20 dark:bg-emerald-600/15 mb-2" />
                <div className="h-10 w-52 rounded-lg bg-emerald-300/30 dark:bg-emerald-600/25 mb-4" />
                <div className="h-4 w-60 rounded bg-emerald-300/20 dark:bg-emerald-600/15 mb-4" />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-10 rounded bg-emerald-300/20 dark:bg-emerald-600/15" />
                    <div className="h-4 w-24 rounded bg-emerald-300/30 dark:bg-emerald-600/20" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-14 rounded bg-emerald-300/20 dark:bg-emerald-600/15" />
                    <div className="h-4 w-24 rounded bg-emerald-300/30 dark:bg-emerald-600/20" />
                  </div>
                </div>
              </div>
              <div className="h-[120px]" style={{ background: p.heroBg }} />
              <div className="grid grid-cols-4 gap-2 px-4 pb-5 pt-4" style={{ background: p.heroBg }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-[62px] rounded-[14px] bg-emerald-300/25 dark:bg-emerald-600/15" />
                ))}
              </div>
            </div>

            {/* Right column skeleton */}
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="rounded-2xl px-4 pt-3 pb-3"
                style={{ background: p.cardBg, border: p.cardBorder }}>
                <div className="flex justify-between mb-2">
                  <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mb-1.5" />
                <div className="h-2.5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/[0.06]">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-[#111e1b]">
                  <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="px-4 py-1 bg-white dark:bg-[#111e1b] divide-y divide-gray-50 dark:divide-white/[0.05]">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                      </div>
                      <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ REAL CONTENT ══ */}
        {!isLoading && (<>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Hero card: same arrangement in both themes, only the color tokens differ ── */}
          <HeroBalanceCard totalBalance={totalBalance} totalProfits={totalProfits} balance={balance} isVerified={isVerified} isDark={isDark} />

          {/* ── Action buttons: same arrangement in both themes (Deposit / Withdraw / Accounts), only the color tokens differ ── */}
          <div
            className="mt-4 rounded-3xl grid grid-cols-3 backdrop-blur-xl"
            style={{
              background: isDark ? "#111e1b" : "rgba(255,255,255,0.55)",
              border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.9)",
              boxShadow: isDark
                ? "0 28px 80px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.35)"
                : "0 8px 32px rgba(31,41,55,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            {([
              ["Deposit", Plus, () => setShowDeposit(true)],
              ["Withdraw", Minus, () => setShowWithdraw(true)],
              ["Accounts", UsersIcon, () => setShowAccounts(true)],
            ] as const).map(([label, Icon, onClick], i) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="flex flex-col items-center justify-center gap-1.5 py-4 text-sm font-semibold"
                style={{
                  color: isDark ? "#ffffff" : "#0f172a",
                  borderLeft: i > 0 ? `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)"}` : "none",
                }}
              >
                <Icon size={18} color={isDark ? "#16a34a" : "#16a34a"} strokeWidth={2.2} />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4">
          {showPortfolioGrowth && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl px-4 pt-3 pb-2"
            style={{ background: "transparent" }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-semibold" style={{ color: p.mutedText }}>Portfolio Growth</span>
              <span className="text-[9px] font-bold" style={{ color: p.accentDark }}>{fmtCompact(target)} target</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(39,174,96,0.12)" : "rgba(5,150,105,0.1)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressWidth}%` }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #059669, #34d399)" }}
              />
            </div>
          </motion.div>
          )}
          <PortfolioBreakdownCard
            balance={dashboardData.balance}
            totalDeposits={dashboardData.totalDeposits}
            totalWithdrawals={dashboardData.totalWithdrawals}
            totalProfits={dashboardData.totalProfits}
          />
        </div>
        </>)}
      </div>

      {/* ── Calendar / Trade Log / Stats — controlled by the sticky tab bar
          pinned at the top of the page, right under the Deposit/Withdraw/
          Accounts row as requested. Same components as the standalone
          /calendar page, so behavior and data stay identical. ── */}
      {!isLoading && (
        <div>
          {activeQuickTab === 0 && <CalendarTab />}
          {activeQuickTab === 1 && <StatsTab />}
        </div>
      )}

      {/* ── Bottom row: trade copied + following, side by side on desktop.
          items-start so each card keeps its own natural height — opening one
          accordion never stretches or shifts the other. min-w-0 on both grid
          items stops the Trade Copied table's min-w-[640px] from forcing the
          whole grid track (and page) wider when the accordion opens — without
          it, a grid item's default min-width:auto refuses to shrink below its
          content's intrinsic width, so the table pushed the layout instead of
          scrolling inside its own card. ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 items-start">
        <div className="min-w-0"><TradeCopiedSection /></div>
        <div className="min-w-0"><FollowingSection /></div>
      </div>

      {/* Modals */}
      <DepositModal isOpen={showDeposit} onClose={handleDepositClose} />
      <WithdrawModal isOpen={showWithdraw} onClose={handleWithdrawClose} />
      <AccountsModal isOpen={showAccounts} onClose={() => setShowAccounts(false)} onDeposit={() => setShowDeposit(true)} />
    </div>
  );
}
