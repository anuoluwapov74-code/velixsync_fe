"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import { X } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { formatCompactUSD, MONTH_NAMES } from "../_lib/helpers";

// The exportable card always has a fixed dark background (it's a branded
// export image, not a themed page section), so its label color is a plain
// fixed slate-blue — the dark-mode value of the page's shared LABEL_COLOR —
// rather than the theme-conditional `dark:` variant used elsewhere on the
// page, which would render wrong (too light) on this permanently-dark card
// when the site itself is in light mode.
const CARD_LABEL_COLOR = "text-[#93A8CC]";

interface Summary {
  total_closed_trades: number;
  total_pnl: number;
  avg_hold_seconds: number | null;
  best_day: number | null;
  best_day_pnl: number | null;
}
interface CheckResponse {
  user: { first_name: string; last_name: string };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  dailyPnl: Record<string, number>;
  summary: Summary | null;
  profitFactor: number;
}

function formatHoldTime(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "-";
  const abs = Math.abs(seconds);
  if (abs < 3600) return `${Math.round(abs / 60)}m`;
  if (abs < 86400) return `${(abs / 3600).toFixed(1)}h`;
  return `${(abs / 86400).toFixed(1)}d`;
}

/** Mon–Fri only (no Sat/Sun), 5 columns + a running weekly-total column —
 * the share card's own convention, distinct from the main calendar grid. */
function buildShareWeeks(year: number, month: number, dailyPnl: Record<string, number>) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const weeks: { days: (number | null)[]; total: number }[] = [];
  let week: (number | null)[] = Array(5).fill(null);
  let weekTotal = 0;
  let started = false;

  for (let day = 1; day <= daysInMonth; day++) {
    const wd = new Date(year, month - 1, day).getDay(); // 0=Sun..6=Sat
    if (wd === 0 || wd === 6) continue;
    const col = wd - 1; // Mon=0..Fri=4
    if (col === 0 && started) {
      weeks.push({ days: week, total: weekTotal });
      week = Array(5).fill(null);
      weekTotal = 0;
    }
    week[col] = day;
    weekTotal += dailyPnl[String(day)] ?? 0;
    started = true;
  }
  weeks.push({ days: week, total: weekTotal });
  return weeks;
}

export default function ShareModal({ isOpen, onClose, year, month, dailyPnl, summary, profitFactor }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const { data: checkData } = useSWR<CheckResponse>(isOpen ? "/check/" : null);
  const traderName = checkData?.user?.first_name || "Trader";

  if (!isOpen) return null;

  const weeks = buildShareWeeks(year, month, dailyPnl);
  const monthlyPnl = summary?.total_pnl ?? 0;

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      // skipFonts avoids html-to-image's font-embedding pass, which walks
      // every document.styleSheets entry to find @font-face rules and
      // throws a SecurityError the moment it hits a cross-origin one it
      // can't read (e.g. an extension- or widget-injected stylesheet).
      // The card's text still renders with whatever font is already active
      // on the page, since capture happens live, not after the fact.
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#0b1a12",
        skipFonts: true,
      });
      const link = document.createElement("a");
      link.download = `velixsync-calendar-${year}-${String(month).padStart(2, "0")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Calendar share image failed:", err);
      toast.error("Couldn't generate image");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0b1a12] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-[rgba(0,201,167,0.14)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/10">
          <h3 className="font-bold text-gray-900 dark:text-white">Share my trading calendar</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/8 transition-colors">
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* The card has a fixed design width so its 6-column mini-calendar
            never gets squished into unreadable slivers on a narrow phone —
            this wrapper scrolls horizontally instead, so every figure stays
            fully visible (scroll to see it) rather than silently clipped. */}
        <div className="p-5 overflow-x-auto">
          {/* Exportable card — everything inside this div is what gets PNG'd */}
          <div ref={cardRef} className="rounded-xl p-5 min-w-135 w-135" style={{ background: "#0b1a12", border: "1px solid rgba(0,201,167,0.14)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7]" />
                <span className="text-[10px] font-bold tracking-wider text-gray-300">VELIXSYNC</span>
              </div>
              <span className={`text-[10px] ${CARD_LABEL_COLOR}`}>
                Live &middot; Monthly &middot; My Trading &middot; {MONTH_NAMES[month - 1].slice(0, 3)} {year}
              </span>
            </div>

            <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{MONTH_NAMES[month - 1]}</h2>
                <p className="text-xs text-gray-400">{year} &middot; {traderName}</p>
              </div>
              <div className="text-right">
                <p className={`text-[10px] tracking-wide ${CARD_LABEL_COLOR}`}>MONTHLY P/L</p>
                <p className={`text-xl sm:text-2xl font-black ${monthlyPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {monthlyPnl >= 0 ? "+" : "-"}{formatCompactUSD(Math.abs(monthlyPnl))}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <MiniStat label="TRADES" value={String(summary?.total_closed_trades ?? 0).padStart(2, "0")} />
              <MiniStat label="AVG HOLD TIME" value={formatHoldTime(summary?.avg_hold_seconds ?? null)} />
              <MiniStat
                label="PROFIT FACTOR"
                value={profitFactor.toFixed(2)}
                valueClass={profitFactor > 1 ? "text-green-400" : "text-red-400"}
              />
              <MiniStat label="BEST DAY" value={summary?.best_day ? `Day ${summary.best_day}` : "-"} />
            </div>

            <div className="rounded-lg overflow-hidden border border-white/10">
              <div className="grid grid-cols-6 bg-white/5">
                {["MON", "TUE", "WED", "THU", "FRI", "WEEKLY P/L"].map((h) => (
                  <div key={h} className={`text-center text-[8px] font-semibold py-1 ${CARD_LABEL_COLOR}`}>{h}</div>
                ))}
              </div>
              {weeks.map((w, i) => (
                <div key={i} className="grid grid-cols-6 border-t border-white/5">
                  {w.days.map((d, di) => {
                    const pnl = d !== null ? dailyPnl[String(d)] : undefined;
                    return (
                      <div key={di} className="min-h-[52px] p-1 border-r border-white/5 flex flex-col justify-between">
                        {d !== null && <span className="text-[9px] text-gray-500 self-end">{d}</span>}
                        {pnl !== undefined && pnl !== 0 && (
                          <span className={`text-[10px] font-bold text-center ${pnl > 0 ? "text-green-400" : "text-red-400"}`}>
                            {pnl > 0 ? "+" : ""}{formatCompactUSD(pnl)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div className="min-h-[52px] flex items-center justify-center">
                    <span className={`text-[11px] font-bold ${w.total > 0 ? "text-green-400" : w.total < 0 ? "text-red-400" : "text-gray-400"}`}>
                      {w.total >= 0 ? "" : "-"}{formatCompactUSD(Math.abs(w.total))}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-semibold text-white mt-4">
              Every trade verified. <span className="text-[#00C9A7]">Every result real.</span>
            </p>
            <p className="text-[8px] text-gray-500 mt-1 leading-relaxed">
              Past performance is not a guarantee of future results. All trading involves risk. Figures reflect realized P/L only. &copy; {year} VelixSync.
            </p>
          </div>
        </div>

        {/* Card is wider than a phone screen by design (so figures never get
            squished illegible) — this hint makes the horizontal scroll
            discoverable instead of the content just looking cut off. */}
        <p className="sm:hidden text-center text-[10px] text-gray-400 dark:text-gray-500 -mt-2 mb-3">
          ← Scroll the card to see all columns →
        </p>

        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ background: "#00C9A7", color: "#001a0f" }}
          >
            {downloading ? "Generating…" : "Download"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg font-semibold text-sm border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
      <p className={`text-[8px] tracking-wide mb-1 ${CARD_LABEL_COLOR}`}>{label}</p>
      <p className={`text-sm font-bold whitespace-nowrap ${valueClass ?? "text-white"}`}>{value}</p>
    </div>
  );
}
