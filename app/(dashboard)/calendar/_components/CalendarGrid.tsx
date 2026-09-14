"use client";

import { useEffect, useRef, useState } from "react";
import { buildCalendarWeeks, WEEKDAY_HEADERS, formatCompactUSD, formatUSD, LABEL_COLOR } from "../_lib/helpers";

interface Props {
  year: number;
  month: number; // 1-12
  dailyPnl: Record<string, number>;
  dailyTradeCounts: Record<string, number>;
  today: { year: number; month: number; day: number };
}

export default function CalendarGrid({ year, month, dailyPnl, dailyTradeCounts, today }: Props) {
  const weeks = buildCalendarWeeks(year, month);
  // Hover and tap/click are tracked separately: if a click just toggled a
  // pinned day open while the mouse also happens to be hovering it, a single
  // "activeDay" toggle would immediately flip itself back off (hover sets it,
  // then the click's own toggle reads it as "already open" and closes it).
  // Keeping them independent means either one showing the tooltip is enough.
  const [hoverDay, setHoverDay] = useState<number | null>(null);
  const [pinnedDay, setPinnedDay] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tapping anywhere outside a day cell closes an open tooltip — needed on
  // touch devices, which have no hover-out to fall back on.
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPinnedDay(null);
        setHoverDay(null);
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="tv-card rounded-xl p-2 sm:p-3">
      {/* Weekday header */}
      <div className="grid grid-cols-6 mb-1.5">
        {WEEKDAY_HEADERS.map((d) => (
          <div key={d} className={`text-center text-[9px] sm:text-xs font-semibold tracking-wide py-1 ${LABEL_COLOR}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="space-y-1 sm:space-y-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-6 gap-1 sm:gap-1.5">
            {week.map((day, di) => {
              if (day === null) {
                return <div key={di} className="min-h-[52px] sm:min-h-[88px] lg:min-h-[100px]" />;
              }
              const pnl = dailyPnl[String(day)];
              const count = dailyTradeCounts[String(day)] ?? 0;
              const isToday = today.year === year && today.month === month && today.day === day;
              const isPositive = (pnl ?? 0) > 0;
              const isNegative = (pnl ?? 0) < 0;
              const hasTrade = pnl !== undefined && pnl !== 0;
              const isActive = hasTrade && (hoverDay === day || pinnedDay === day);
              // Center the tooltip on middle columns, but anchor it to the
              // cell's own edge on the leftmost/rightmost column (Sun/Fri) —
              // a centered tooltip there would hang off the side of the
              // viewport and get silently clipped by the page's scroll shell.
              const tooltipPos =
                di === 0 ? "left-0" : di === week.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2";
              const arrowPos =
                di === 0 ? "left-3" : di === week.length - 1 ? "right-3" : "left-1/2 -translate-x-1/2";

              return (
                <div
                  key={di}
                  role={hasTrade ? "button" : undefined}
                  tabIndex={hasTrade ? 0 : undefined}
                  onMouseEnter={() => hasTrade && setHoverDay(day)}
                  onMouseLeave={() => hasTrade && setHoverDay(null)}
                  onClick={(e) => {
                    if (!hasTrade) return;
                    // Stop the outside-click handler above from immediately
                    // closing the tooltip this same click just opened.
                    e.stopPropagation();
                    setPinnedDay((d) => (d === day ? null : day));
                  }}
                  onKeyDown={(e) => {
                    if (!hasTrade) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPinnedDay((d) => (d === day ? null : day));
                    }
                  }}
                  className={`relative min-h-[52px] sm:min-h-[88px] lg:min-h-[100px] rounded-lg p-1 sm:p-1.5 flex flex-col justify-between border transition-transform ${
                    hasTrade ? "cursor-pointer active:scale-95" : ""
                  } ${
                    isToday
                      ? "bg-[#00C9A7] border-[#00C9A7]"
                      : isPositive
                      ? "bg-green-500/[0.08] border-green-500/20"
                      : isNegative
                      ? "bg-red-500/[0.08] border-red-500/20"
                      : "border-gray-200 dark:border-white/8"
                  }`}
                >
                  <span
                    className={`text-[9px] sm:text-xs self-end font-medium ${
                      isToday ? "text-[#001a0f] font-bold" : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {day}
                  </span>
                  {hasTrade && (
                    <div className="text-center overflow-hidden">
                      <p
                        className={`text-[9px] sm:text-[11px] lg:text-sm font-bold leading-tight truncate ${
                          isToday ? "text-[#001a0f]" : isPositive ? "text-green-500" : "text-red-400"
                        }`}
                      >
                        {isPositive ? "+" : ""}{formatCompactUSD(pnl)}
                      </p>
                      <p className={`text-[8px] hidden sm:block ${isToday ? "text-[#001a0f]/70" : "text-gray-400 dark:text-gray-500"}`}>
                        {count} {count === 1 ? "trade" : "trades"}
                      </p>
                    </div>
                  )}

                  {/* Animated hover (desktop) / tap (mobile) tooltip — shows
                      the exact amount, not the rounded compact figure printed
                      inside the cell itself. Always mounted, just faded and
                      scaled out when inactive, so the appear/disappear is a
                      real CSS transition rather than an instant mount. */}
                  {hasTrade && (
                    <div
                      className={`absolute bottom-full ${tooltipPos} mb-2 z-30 pointer-events-none whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-lg transition-all duration-150 ease-out origin-bottom ${
                        isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-1"
                      }`}
                      style={{ background: "#0b1a12", border: "1px solid rgba(0,201,167,0.25)" }}
                    >
                      <span className={isPositive ? "text-green-400" : "text-red-400"}>
                        {isPositive ? "+" : ""}{formatUSD(pnl)}
                      </span>
                      <span className="text-gray-400 ml-1.5 font-normal">
                        &middot; {count} {count === 1 ? "trade" : "trades"}
                      </span>
                      <span
                        className={`absolute top-full ${arrowPos} -mt-[5px] w-2.5 h-2.5 rotate-45`}
                        style={{ background: "#0b1a12", borderRight: "1px solid rgba(0,201,167,0.25)", borderBottom: "1px solid rgba(0,201,167,0.25)" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
