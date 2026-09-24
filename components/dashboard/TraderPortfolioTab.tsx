"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MousePointer2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import StockLogo from "./StockLogo";

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

// Stand-in rows shown only for the instant before the server's positions arrive.
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

export default function TraderPortfolioTab({ traderId, traderName }: Props) {
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [locked, setLocked] = useState(true);
  const [loading, setLoading] = useState(false);
  // True until the first load returns, so a user who already unlocked this portfolio
  // doesn't see the "click to mirror" prompt flash on every page load.
  const [checking, setChecking] = useState(true);
  const unlocked = positions !== null && !locked;

  // On load, fetch the trader's positions plus whether this user still has them locked
  // (portfolio blurred and not yet mirrored). While locked the rows are shown blurred.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch(`/traders/${traderId}/portfolio/`);
        const data = await res.json().catch(() => ({}));
        if (!cancelled && res.ok && data.success) {
          setPositions(data.positions);
          setLocked(Boolean(data.locked));
        }
      } catch {
        // stay locked; the click below reports real errors
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [traderId]);

  // Clicking the icon asks the server to unlock (mirror) it. The server checks the
  // balance against blur_portfolio_amount and stores the unlock so it survives refreshes.
  const mirror = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/traders/${traderId}/portfolio/mirror/`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setPositions(data.positions);
        setLocked(false);
      } else if (res.status === 403) {
        toast.error(data.reason === "not_copying" ? "Copy this trader first" : "You can't mirror this portfolio yet", {
          description: data.error || `Your balance is too low to view ${traderName}'s portfolio.`,
        });
      } else {
        toast.error("Couldn't load portfolio", { description: data.error || "Please try again." });
      }
    } catch {
      toast.error("Couldn't load portfolio", { description: "Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }, [traderId, traderName]);

  const rows = positions && positions.length > 0 ? positions : unlocked ? [] : PLACEHOLDER_ROWS;

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
        {unlocked && rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">No open positions.</p>
        ) : (
          <div
            className={unlocked ? "" : "blur-md select-none pointer-events-none"}
            aria-hidden={!unlocked}
          >
            {rows.map((p) => (
              <PositionRow key={p.id} p={p} />
            ))}
          </div>
        )}

        {!unlocked && !checking && (
          <div className="absolute inset-x-0 top-0 flex justify-center pt-16">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={mirror}
                disabled={loading}
                aria-label="Click here to mirror expert Portfolio"
                className="relative flex h-14 w-14 items-center justify-center rounded-full disabled:cursor-wait"
              >
                <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
                <span className="absolute inset-1.5 rounded-full bg-red-500/30 border border-red-500/60" />
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-red-500 shadow-lg">
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <MousePointer2 className="h-4 w-4 text-white fill-white" />
                  )}
                </span>
              </button>
              <div className="mt-1 h-0 w-0 border-x-[7px] border-b-[8px] border-x-transparent border-b-red-500" />
              <div className="rounded-lg bg-red-500 px-4 py-2 text-center text-[13px] font-bold leading-tight text-white shadow-lg">
                Click here to mirror
                <br />
                expert Portfolio
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
