"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Clock } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  availableBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
  isVerified: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
  onHistory: () => void;
}

export default function BalanceCard({
  balance,
  totalDeposits,
  totalProfits,
  isVerified,
  onDeposit,
  onWithdraw,
  onHistory,
}: BalanceCardProps) {
  const profitPercent = totalDeposits > 0 ? (totalProfits / totalDeposits) * 100 : 0;
  const isProfitPositive = totalProfits >= 0;

  const fmt = (v: number) =>
    "$" +
    v.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-3"
    >
      {/* ── Balance Card ── */}
      <div className="rounded-2xl overflow-hidden bg-[#0a1a12]">
        {/* Header row */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex flex-col gap-1">
            <span className="text-[15px] font-bold leading-none">
              <span style={{ color: "#16a34a" }}>Velix</span>
              <span className="text-white">Sync</span>
            </span>
            {isVerified && (
              <div className="flex items-center gap-1 rounded-full px-2 py-0.5 w-fit" style={{ background: "rgba(22,163,74,0.15)" }}>
                <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[10px] font-semibold" style={{ color: "#16a34a" }}>Verified</span>
              </div>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#16a34a] bg-[#16a34a]/10 rounded-lg px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Balance + PNL */}
        <div className="px-5 pb-4">
          <p className="text-[11px] text-gray-500 mb-1.5">Total Balance</p>
          <p className="text-[32px] font-extrabold text-white tracking-tight leading-none font-mono">
            {fmt(balance)}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`font-bold font-mono ${
                  isProfitPositive ? "text-[#16a34a]" : "text-red-400"
                }`}
              >
                {isProfitPositive ? "↑" : "↓"} {fmt(Math.abs(totalProfits))}
              </span>
              <span className="text-gray-500 text-[12px]">
                {isProfitPositive ? "+" : ""}
                {profitPercent.toFixed(2)}% today
              </span>
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${
                isProfitPositive
                  ? "bg-[#16a34a]/10 text-[#16a34a]"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {isProfitPositive ? "+" : ""}
              {profitPercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Profit / Deposited row */}
        <div className="flex items-start gap-8 px-5 py-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Profit</p>
            <p className={`text-[13px] font-bold font-mono ${isProfitPositive ? "text-[#16a34a]" : "text-red-400"}`}>
              {fmt(totalProfits)}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Deposited</p>
            <p className="text-[13px] font-bold font-mono text-white">
              {fmt(totalDeposits)}
            </p>
          </div>
        </div>

        {/* Sparkline */}
        <svg
          viewBox="0 0 288 54"
          preserveAspectRatio="none"
          fill="none"
          style={{ display: "block", width: "100%", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
            </linearGradient>
            <filter id="sparkGlow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M0.0,48.6 L10.7,47.7 L21.3,49.0 L32.0,45.8 L42.7,46.4 L53.3,43.8 L64.0,44.9 L74.7,41.6 L85.3,42.7 L96.0,39.9 L106.7,40.8 L117.3,38.4 L128.0,39.5 L138.7,36.2 L149.3,36.9 L160.0,33.4 L170.7,34.7 L181.3,31.2 L192.0,29.5 L202.7,26.9 L213.3,27.6 L224.0,23.9 L234.7,22.2 L245.3,18.9 L256.0,17.4 L266.7,13.5 L277.3,11.8 L288.0,7.0 L288,54 L0,54 Z"
            fill="url(#sparkGrad)"
          />
          <path
            d="M0.0,48.6 L10.7,47.7 L21.3,49.0 L32.0,45.8 L42.7,46.4 L53.3,43.8 L64.0,44.9 L74.7,41.6 L85.3,42.7 L96.0,39.9 L106.7,40.8 L117.3,38.4 L128.0,39.5 L138.7,36.2 L149.3,36.9 L160.0,33.4 L170.7,34.7 L181.3,31.2 L192.0,29.5 L202.7,26.9 L213.3,27.6 L224.0,23.9 L234.7,22.2 L245.3,18.9 L256.0,17.4 L266.7,13.5 L277.3,11.8 L288.0,7.0"
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#sparkGlow)"
          />
        </svg>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* Deposit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onDeposit}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl py-5 px-2 bg-[#16a34a] text-white shadow-lg shadow-[#16a34a]/20"
        >
          <ArrowDownToLine className="w-5 h-5" />
          <span className="text-xs font-semibold">Deposit</span>
        </motion.button>

        {/* Withdraw */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onWithdraw}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl py-5 px-2 bg-white dark:bg-white/6 border border-gray-100 dark:border-white/8 text-gray-700 dark:text-gray-300"
        >
          <ArrowUpFromLine className="w-5 h-5" />
          <span className="text-xs font-semibold">Withdraw</span>
        </motion.button>

        {/* Transfer */}
        <Link href="/transfer" className="block">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl py-5 px-2 bg-white dark:bg-white/6 border border-gray-100 dark:border-white/8 text-gray-700 dark:text-gray-300 w-full"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-xs font-semibold">Transfer</span>
          </motion.div>
        </Link>

        {/* History */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onHistory}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl py-5 px-2 bg-white dark:bg-white/6 border border-gray-100 dark:border-white/8 text-gray-700 dark:text-gray-300"
        >
          <Clock className="w-5 h-5" />
          <span className="text-xs font-semibold">History</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
