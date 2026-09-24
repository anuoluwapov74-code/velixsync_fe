"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

interface TreemapStock {
  symbol: string;
  name: string;
  price: string;
  change_percent: string;
  market_cap: number;
  tier: "Mega" | "Large" | "Mid";
}

interface TreemapResponse {
  success: boolean;
  index: string;
  updated_at: string | null;
  stocks: TreemapStock[];
}

const TIER_ORDER: TreemapStock["tier"][] = ["Mega", "Large", "Mid"];

// Column count is derived from the measured container width so cells stay
// roughly this wide at every breakpoint, instead of a fixed column count
// that'd be cramped on mobile or sparse on desktop.
const TARGET_COL_PX = 84;
const MIN_COLUMNS = 4;

// Color intensity saturates by ±5% daily move, matching how heatmaps like
// Finviz cap their color scale so a handful of big movers don't wash everything else out.
const MAX_MOVE = 5;

function colorFor(changePercent: number) {
  const clamped = Math.max(-MAX_MOVE, Math.min(MAX_MOVE, changePercent));
  const intensity = Math.abs(clamped) / MAX_MOVE; // 0..1
  if (changePercent >= 0) {
    // dark green -> bright green
    const l = 18 + intensity * 20; // lightness %
    return `hsl(142, 71%, ${l}%)`;
  }
  const l = 18 + intensity * 20;
  return `hsl(0, 72%, ${l}%)`;
}

function formatUpdatedAt(iso: string | null) {
  if (!iso) return null;
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * A free-form squarified layout lets one dominant stock (e.g. NVDA at ~25x the
 * smallest Dow name) force everything else into ever-thinner slivers on a narrow
 * screen. A CSS grid sidesteps that: every box is a whole number of grid cells,
 * so the smallest possible box is always one full cell — never a hairline.
 * Size still reflects market cap, just quantized into a few span tiers relative
 * to the biggest name in the tier, instead of continuously proportional.
 */
function spanFor(relativeCap: number): { col: number; row: number } {
  if (relativeCap >= 0.55) return { col: 3, row: 3 };
  if (relativeCap >= 0.28) return { col: 2, row: 2 };
  if (relativeCap >= 0.12) return { col: 2, row: 1 };
  return { col: 1, row: 1 };
}

/** Tracks an element's live rendered width so layout math can react to real breakpoints, not assumptions. */
function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

export default function TreemapTab() {
  // Dow 30 constituents sync roughly every 15 min server-side, so poll on the same cadence
  const { data, isLoading } = useSWR<TreemapResponse>("/treemap/", {
    refreshInterval: 900_000,
  });
  const [containerRef, containerWidth] = useContainerWidth<HTMLDivElement>();

  const stocks = useMemo(() => (data?.success ? data.stocks : []), [data]);

  const columns = containerWidth > 0 ? Math.max(MIN_COLUMNS, Math.round(containerWidth / TARGET_COL_PX)) : MIN_COLUMNS;
  const cellPx = containerWidth > 0 ? containerWidth / columns : 0;

  const tiers = useMemo(() => {
    return TIER_ORDER.map((tier) => {
      const tierStocks = stocks.filter((s) => s.tier === tier).sort((a, b) => b.market_cap - a.market_cap);
      const maxCap = tierStocks[0]?.market_cap || 1;
      const items = tierStocks.map((s) => ({ ...s, ...spanFor(s.market_cap / maxCap) }));
      return { tier, items };
    }).filter((t) => t.items.length > 0);
  }, [stocks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Dow Jones 30 &middot; sized by market cap, colored by 1D change
        </p>
        {data?.updated_at && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Updated {formatUpdatedAt(data.updated_at)}
          </p>
        )}
      </div>

      <div ref={containerRef}>
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-[#16a34a] animate-spin" />
          </div>
        )}

        {!isLoading && stocks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Treemap data isn&apos;t available yet</p>
          </div>
        )}

        {!isLoading && containerWidth > 0 &&
          tiers.map(({ tier, items }) => (
            <div key={tier} className="mb-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {tier}
              </h3>
              <div
                className="grid rounded-lg overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gridAutoRows: `${cellPx}px`,
                  gridAutoFlow: "dense",
                }}
              >
                {items.map((r) => {
                  const changePercent = parseFloat(r.change_percent);
                  const w = r.col * cellPx;
                  const h = r.row * cellPx;
                  const showChange = h >= 34 && w >= 50;
                  const showName = w >= 34 && h >= 22;
                  const title = `${r.symbol} ${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`;
                  return (
                    <div
                      key={r.symbol}
                      title={title}
                      style={{
                        gridColumn: `span ${r.col}`,
                        gridRow: `span ${r.row}`,
                        background: colorFor(changePercent),
                      }}
                      className="flex flex-col items-center justify-center border border-black/10 dark:border-white/10 overflow-hidden px-1 transition-opacity hover:opacity-90"
                    >
                      {showName && (
                        <span
                          className="font-bold text-white truncate max-w-full"
                          style={{ fontSize: Math.max(9, Math.min(22, Math.min(w / 5, h / 2.4))) }}
                        >
                          {r.symbol}
                        </span>
                      )}
                      {showChange && (
                        <span className="text-white/90 text-xs truncate max-w-full">
                          {changePercent >= 0 ? "+" : ""}
                          {changePercent.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
