"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { squarify } from "./squarify";

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

/** A synthetic cell standing in for the long tail of smallest-cap names in a tier, so they
 * don't each get their own sliver. Shares the fields the renderer needs off TreemapStock. */
interface BucketCell {
  symbol: string;
  change_percent: string;
  market_cap: number;
  tier: TreemapStock["tier"];
  isBucket: true;
  count: number;
  tickers: string[];
}

type TreemapCell = TreemapStock | (Partial<Pick<TreemapStock, "name" | "price">> & BucketCell);

const TIER_ORDER: TreemapStock["tier"][] = ["Mega", "Large", "Mid"];
const MIN_TIER_HEIGHT = 140;

// Below this many px per side, a ticker + % reads as an illegible smear rather
// than data. Once a tier has more items than its area can give this much room
// each, the smallest-cap tail gets folded into one "+N more" cell instead of
// squarify slicing them into ever-thinner spiral slivers (see totalHeightFor).
const MIN_CELL_W = 60;
const MIN_CELL_H = 44;

/**
 * Total height budget (split across tiers below, proportional to market cap).
 * Scaled off the measured container width rather than a flat constant so the
 * aspect ratio each tier is squarified into stays roughly the same at every
 * breakpoint. Fixing this to a width-independent constant is what caused the
 * mobile "spiral" bug: a narrow container got a tall/portrait aspect ratio,
 * and squarify degenerates into ever-thinner slivers for smoothly-decreasing
 * values (like market caps) at extreme aspect ratios.
 */
function totalHeightFor(containerWidth: number) {
  return Math.max(360, Math.min(680, containerWidth * 0.6));
}

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

function makeBucket(tier: TreemapStock["tier"], rest: TreemapStock[]): BucketCell {
  return {
    symbol: `+${rest.length}`,
    change_percent: "0",
    market_cap: rest.reduce((s, d) => s + d.market_cap, 0),
    tier,
    isBucket: true,
    count: rest.length,
    tickers: rest.map((s) => s.symbol),
  };
}

/**
 * Squarify, then check the result for slivers below a legible minimum size.
 * An area-average check isn't enough here — for smoothly, steeply-decreasing
 * values (like Dow 30 market caps), squarify can produce a "spiral" of
 * ever-thinner slices even when the *average* area per item is generous,
 * because the split is so uneven. So instead: lay out, look for violations,
 * fold the single smallest-cap item into a bucket, and retry — repeating
 * until everything fits or only the bucket is left.
 */
function layoutTier(tierStocksDesc: TreemapStock[], tier: TreemapStock["tier"], width: number, height: number) {
  let items = tierStocksDesc;
  let bucketed: TreemapStock[] = [];

  while (true) {
    const cells: TreemapCell[] = bucketed.length > 0 ? [...items, makeBucket(tier, bucketed)] : items;
    const rects = squarify(
      cells.map((s) => ({ ...s, value: s.market_cap })),
      0,
      0,
      width,
      height
    );

    const hasSliver = rects.some(
      (r) => !("isBucket" in r && r.isBucket) && (r.w < MIN_CELL_W || r.h < MIN_CELL_H)
    );
    if (!hasSliver || items.length <= 1) return rects;

    // Fold the smallest-cap remaining real item into the bucket and retry.
    bucketed = [...bucketed, items[items.length - 1]];
    items = items.slice(0, -1);
  }
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
  const totalCap = useMemo(() => stocks.reduce((s, d) => s + d.market_cap, 0), [stocks]);

  const tiers = useMemo(() => {
    if (containerWidth === 0) return [];
    const totalHeight = totalHeightFor(containerWidth);
    return TIER_ORDER.map((tier) => {
      const tierStocks = stocks.filter((s) => s.tier === tier).sort((a, b) => b.market_cap - a.market_cap);
      const tierCap = tierStocks.reduce((s, d) => s + d.market_cap, 0);
      const height =
        tierStocks.length === 0
          ? 0
          : Math.max(MIN_TIER_HEIGHT, Math.round((tierCap / (totalCap || 1)) * totalHeight));

      // Real pixel width in, real pixel rects out — so row-splitting, font
      // size, and the show/hide thresholds below all match what's actually
      // on screen at the current breakpoint (desktop, tablet, phone, ...).
      // Slivers below MIN_CELL_W/H get folded into a "+N more" bucket (see layoutTier).
      const rects = layoutTier(tierStocks, tier, containerWidth, height);
      return { tier, height, rects };
    }).filter((t) => t.rects.length > 0);
  }, [stocks, totalCap, containerWidth]);

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

        {!isLoading &&
          tiers.map(({ tier, height, rects }) => (
            <div key={tier} className="mb-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {tier}
              </h3>
              <div className="relative w-full rounded-lg overflow-hidden" style={{ height }}>
                {rects.map((r) => {
                  const isBucket = "isBucket" in r && r.isBucket;
                  const changePercent = parseFloat(r.change_percent);
                  const showChange = !isBucket && r.h >= 28;
                  const showName = r.w >= 40 && r.h >= 20;
                  const title = isBucket
                    ? `${r.count} more: ${r.tickers.join(", ")}`
                    : `${r.symbol} ${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`;
                  return (
                    <div
                      key={r.symbol}
                      title={title}
                      className="absolute flex flex-col items-center justify-center border border-black/10 dark:border-white/10 overflow-hidden px-1 transition-opacity hover:opacity-90"
                      style={{
                        left: r.x,
                        top: r.y,
                        width: r.w,
                        height: r.h,
                        background: isBucket ? "#475569" /* slate-600: neutral, not a green/red move */ : colorFor(changePercent),
                      }}
                    >
                      {showName && (
                        <span
                          className="font-bold text-white truncate max-w-full"
                          style={{ fontSize: Math.max(10, Math.min(22, Math.min(r.w / 6, r.h / 3))) }}
                        >
                          {r.symbol}
                        </span>
                      )}
                      {isBucket && r.h >= 34 && (
                        <span className="text-white/90 text-[10px] truncate max-w-full">more</span>
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
