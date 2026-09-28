"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import StockLogo from "./StockLogo";
import DepositModal from "@/components/dashboard/modals/DepositModal";

interface Position {
  id: number;
  market: string;
  name: string;
  direction: string;
  logo_url: string | null;
  invested_pct: string;
  profit_loss: string;
  value_pct: string;
}

interface Props {
  traderId: number;
  traderName: string;
}

// Stand-in rows shown blurred behind the locked notice; the server sends no real rows while locked.
const PLACEHOLDER_ROWS: Position[] = [
  ["PEP", "PepsiCo", "7.33", "-6.45", "6.18"],
  ["DGE", "Diageo", "7.04", "-12.90", "5.53"],
  ["DEO", "Diageo plc ADR", "6.90", "0.66", "6.26"],
  ["HLN", "Haleon PLC ADR", "5.96", "15.08", "6.19"],
  ["PUM", "PUMA AG", "5.45", "23.74", "6.08"],
  ["SDLF", "Standard Life PLC", "4.26", "57.84", "6.06"],
  ["VFC", "VF Corp", "4.26", "9.23", "4.19"],
  ["MNG", "M&G plc", "2.17", "91.20", "3.74"],
].map(([market, name, inv, pl, val], i) => ({
  id: -(i + 1),
  market,
  name,
  direction: "LONG",
  logo_url: null,
  invested_pct: inv,
  profit_loss: pl,
  value_pct: val,
}));

const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

function PositionRow({ p }: { p: Position }) {
  const pl = parseFloat(p.profit_loss);
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 dark:border-[rgba(39,174,96,0.08)] last:border-0">
      <StockLogo logoUrl={p.logo_url} name={p.name || p.market} size={44} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
          {p.direction === "SHORT" ? "Short" : "Long"} {p.market}
        </p>
        {p.name && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.name}</p>}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-8 text-right text-[13px] font-medium shrink-0">
        <span className="w-12 sm:w-16 text-gray-900 dark:text-white">{p.invested_pct}%</span>
        <span className={`w-14 sm:w-16 ${pl < 0 ? "text-red-500" : "text-emerald-500"}`}>{p.profit_loss}%</span>
        <span className="w-12 sm:w-16 text-gray-900 dark:text-white">{p.value_pct}%</span>
      </div>
    </div>
  );
}

function Requirement({ done, title, children }: { done: boolean; title: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      {done ? (
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#16a34a]" />
      ) : (
        <Circle className="w-5 h-5 shrink-0 mt-0.5 text-gray-300 dark:text-gray-600" />
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
        <div className="text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 mt-0.5">{children}</div>
      </div>
    </li>
  );
}

interface LockedInfoModalProps {
  traderName: string;
  requiredBalance: number;
  balance: number;
  isCopying: boolean;
  onClose: () => void;
  onDeposit: () => void;
}

function LockedInfoModal({ traderName, requiredBalance, balance, isCopying, onClose, onDeposit }: LockedInfoModalProps) {
  const meetsThreshold = balance >= requiredBalance;
  const pct = requiredBalance > 0 ? Math.min(100, (balance / requiredBalance) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-locked-title"
        className="relative w-full sm:max-w-[460px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0f1a14] border border-gray-200 dark:border-white/10"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#16a34a]/10 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-[#16a34a]" />
              </div>
              <h3 id="portfolio-locked-title" className="text-[18px] font-bold leading-snug text-gray-900 dark:text-white">
                Portfolio access locked
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/10 hover:opacity-80 transition-opacity"
            >
              <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-5">
            {traderName}&apos;s portfolio is only shared with copiers whose capital meets the trader&apos;s
            required copy value. It works the same way as being unable to copy a trader until you&apos;ve
            reached their minimum capital.
          </p>

          <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Your capital
              </span>
              <span className="text-sm font-semibold text-[#16a34a]">
                {money(balance)} / {money(requiredBalance)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#16a34a] to-[#22c55e] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {meetsThreshold ? (
                "You meet the required capital."
              ) : (
                <>
                  You need{" "}
                  <span className="font-semibold text-[#16a34a]">{money(requiredBalance - balance)}</span> more to
                  reach the required capital.
                </>
              )}
            </p>
          </div>

          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            What&apos;s required
          </h4>
          <ul className="space-y-4 mb-6">
            <Requirement done={isCopying} title={`Copy ${traderName}`}>
              You must be actively copying this trader. {isCopying ? "You are copying them." : "You are not copying them yet."}
            </Requirement>
            <Requirement done={meetsThreshold} title="Meet the required capital">
              Your account capital must reach {money(requiredBalance)}, the copy value set for this trader.
            </Requirement>
            <Requirement done={false} title="Approval">
              Once you qualify, access is approved on your account and their open positions become visible
              here. For the specific requirements, contact the trader whose account you&apos;re copying.
            </Requirement>
          </ul>

          <div className="flex flex-col gap-2.5">
            {!meetsThreshold && (
              <button
                onClick={onDeposit}
                className="w-full h-11 rounded-full text-sm font-bold text-white bg-[#17703a] hover:opacity-90 transition-opacity"
              >
                Make a Deposit
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full h-11 rounded-full text-sm font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function TraderPortfolioTab({ traderId, traderName }: Props) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [locked, setLocked] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [requiredBalance, setRequiredBalance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isCopying, setIsCopying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch(`/traders/${traderId}/portfolio/`);
        const data = await res.json().catch(() => ({}));
        if (!cancelled && res.ok && data.success) {
          setPositions(data.positions);
          setLocked(Boolean(data.locked));
          setRequiredBalance(parseFloat(data.required_balance) || 0);
          setBalance(parseFloat(data.balance) || 0);
          setIsCopying(Boolean(data.is_copying));
          setLoaded(true);
        }
      } catch {
        // stays locked; the notice below is shown once loaded
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [traderId]);

  const showLocked = locked && loaded;
  const rows = locked ? PLACEHOLDER_ROWS : positions;

  return (
    <div className="tv-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Portfolio</h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-8 text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          <span className="w-12 sm:w-16">Invested</span>
          <span className="w-14 sm:w-16">P/L</span>
          <span className="w-12 sm:w-16">Value</span>
        </div>
      </div>

      <div className="relative">
        {loaded && !locked && rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">No open positions.</p>
        ) : (
          <div className={locked ? "blur-md select-none pointer-events-none" : ""} aria-hidden={locked}>
            {rows.map((p) => (
              <PositionRow key={p.id} p={p} />
            ))}
          </div>
        )}

        {showLocked && (
          <div className="absolute inset-0 z-10 flex items-start justify-center px-2 pt-4 sm:px-4 sm:pt-10">
            <div className="max-w-sm rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-xl shadow-xl p-5 sm:p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5 text-[#16a34a]" />
              </div>
              <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-100">
                Hello, {traderName}&apos;s portfolio becomes available once your capital meets the required
                threshold of this trader&apos;s copy value. After approval, you&apos;ll be able to view and
                mirror their open positions. For details on the specific requirements, tap the button below.
              </p>
              <button
                type="button"
                onClick={() => setShowInfo(true)}
                className="mt-4 h-10 px-6 rounded-full text-sm font-bold text-white bg-[#17703a] hover:opacity-90 transition-opacity"
              >
                View requirements
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showInfo && (
          <LockedInfoModal
            traderName={traderName}
            requiredBalance={requiredBalance}
            balance={balance}
            isCopying={isCopying}
            onClose={() => setShowInfo(false)}
            onDeposit={() => {
              setShowInfo(false);
              setShowDeposit(true);
            }}
          />
        )}
      </AnimatePresence>

      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
    </div>
  );
}
