"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Search, TrendingUp, TrendingDown, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import StockLogo from "@/components/dashboard/StockLogo";
import { buildSparklinePath, buildSparklineArea } from "./sparkline";

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */

interface Stock {
  id: number;
  symbol: string;
  name: string;
  logo_url: string | null;
  domain: string | null;
  category: string;
  sector: string | null;
  exchange: string | null;
  description: string | null;
  price: string;
  change: string;
  change_percent: string;
  is_positive_change: boolean;
  is_featured: boolean;
  volume: string;
  market_cap: string;
  pe: number | null;
  eps: number;
  high_52w: number;
  low_52w: number;
  div_yield: string;
  beta: number;
  avg_vol: string;
  sparkline: number[];
}

interface IndexQuote {
  name: string;
  value: string;
  change: string;
  change_pct: string;
  positive: boolean;
}

interface StocksResponse {
  success: boolean;
  stocks: Stock[];
  indices: IndexQuote[];
}

type Filter = "all" | "stock" | "crypto" | "etf";
type Sector = "All" | "Technology" | "Finance" | "Healthcare" | "Energy" | "Consumer" | "Industrials";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",    label: "All" },
  { key: "stock",  label: "Stocks" },
  { key: "crypto", label: "Crypto" },
  { key: "etf",    label: "ETF" },
];

const SECTOR_FILTERS: Sector[] = ["All", "Technology", "Finance", "Healthcare", "Energy", "Consumer", "Industrials"];

const SECTOR_COLORS: Record<string, string> = {
  Technology: "#06b6d4",
  Finance: "#3b82f6",
  Healthcare: "#22c55e",
  Energy: "#f97316",
  Consumer: "#8b5cf6",
  Industrials: "#f59e0b",
};

const PAGE_SIZE = 12;

/* ══════════════════════════════════════════════════════════════
   SPARKLINES
══════════════════════════════════════════════════════════════ */

function MiniSparkline({ prices, positive }: { prices: number[]; positive: boolean }) {
  const W = 80, H = 32;
  if (prices.length < 2) return <div style={{ width: W, height: H }} />;
  const path = buildSparklinePath(prices, W, H, 2);
  const area = buildSparklineArea(prices, W, H, 2);
  const color = positive ? "#22c55e" : "#ef4444";
  const gradId = positive ? "mini-profit" : "mini-loss";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ModalSparkline({ prices, positive }: { prices: number[]; positive: boolean }) {
  const W = 560, H = 110, padding = 6;
  if (prices.length < 2) return <div className="w-full" style={{ height: H }} />;
  const linePath = buildSparklinePath(prices, W, H, padding);
  const areaPath = buildSparklineArea(prices, W, H, padding);
  const color = positive ? "#22c55e" : "#ef4444";
  const gradId = positive ? "grad-profit" : "grad-loss";
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" fill="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   INDEX BAR
══════════════════════════════════════════════════════════════ */

function IndexBar({ indices }: { indices: IndexQuote[] }) {
  if (indices.length === 0) return null;
  return (
    <div className="tv-card rounded-xl mb-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-0 min-w-max">
        {indices.map((idx, i) => (
          <div key={idx.name} className={`flex items-center gap-4 py-3 pr-6 ${i > 0 ? "pl-6 border-l border-gray-200 dark:border-white/10" : "pl-4"} shrink-0`}>
            <div>
              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider leading-none mb-1">
                {idx.name}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{idx.value}</span>
                <span className={`text-xs font-semibold ${idx.positive ? "text-green-600" : "text-red-600 dark:text-red-400"}`}>
                  {idx.change} ({idx.change_pct})
                </span>
              </div>
            </div>
          </div>
        ))}
        <div className="ml-auto pl-6 pr-4 border-l border-gray-200 dark:border-white/10 shrink-0 py-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-green-600">Live</span>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">NYSE &middot; NASDAQ</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   RICH STOCK CARD + MODAL (category === "stock")
══════════════════════════════════════════════════════════════ */

function RichStockCard({ stock, onClick }: { stock: Stock; onClick: () => void }) {
  const positive = stock.is_positive_change;
  const sectorColor = stock.sector ? SECTOR_COLORS[stock.sector] : undefined;

  return (
    <button onClick={onClick} className="w-full text-left tv-card rounded-xl p-5 hover:border-[#16a34a] transition-all group">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <StockLogo logoUrl={stock.logo_url} domain={stock.domain} name={stock.name} size={44} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate group-hover:text-[#16a34a] transition-colors">
              {stock.name}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#16a34a]/10 text-[#16a34a]">
                {stock.symbol}
              </span>
              {stock.sector && (
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{ backgroundColor: `${sectorColor}1a`, color: sectorColor }}
                >
                  {stock.sector}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="shrink-0 mt-1">
          <MiniSparkline prices={stock.sparkline} positive={positive} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">
            ${parseFloat(stock.price).toFixed(2)}
          </p>
          <p className={`text-xs font-semibold mt-1 ${positive ? "text-green-600" : "text-red-600 dark:text-red-400"}`}>
            {positive ? "▲" : "▼"} {positive ? "+" : ""}
            {parseFloat(stock.change).toFixed(2)} ({positive ? "+" : ""}
            {parseFloat(stock.change_percent).toFixed(2)}%)
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Vol</p>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{stock.volume}</p>
        </div>
      </div>
    </button>
  );
}

function RichStockModal({ stock, onClose }: { stock: Stock; onClose: () => void }) {
  const positive = stock.is_positive_change;
  const sectorColor = stock.sector ? SECTOR_COLORS[stock.sector] : undefined;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const metrics = [
    { label: "Market Cap", value: stock.market_cap },
    { label: "P/E Ratio", value: stock.pe !== null ? stock.pe.toFixed(1) : "N/A" },
    { label: "EPS", value: stock.eps > 0 ? `$${stock.eps.toFixed(2)}` : "N/A" },
    { label: "52W High", value: stock.high_52w > 0 ? `$${stock.high_52w.toFixed(2)}` : "N/A" },
    { label: "52W Low", value: stock.low_52w > 0 ? `$${stock.low_52w.toFixed(2)}` : "N/A" },
    { label: "Avg Volume", value: stock.avg_vol },
    { label: "Dividend Yield", value: stock.div_yield },
    { label: "Beta", value: stock.beta > 0 ? stock.beta.toFixed(2) : "N/A" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#0b1a12] w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-4">
            <StockLogo logoUrl={stock.logo_url} domain={stock.domain} name={stock.name} size={52} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{stock.name}</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#16a34a]/10 text-[#16a34a]">
                  {stock.symbol}
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-1 flex-wrap">
                <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                  ${parseFloat(stock.price).toFixed(2)}
                </span>
                <span className={`text-sm font-semibold ${positive ? "text-green-600" : "text-red-600 dark:text-red-400"}`}>
                  {positive ? "▲" : "▼"} {positive ? "+" : ""}
                  {parseFloat(stock.change).toFixed(2)} ({positive ? "+" : ""}
                  {parseFloat(stock.change_percent).toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-6 pt-5 pb-2">
          <div className="tv-card rounded-xl overflow-hidden p-3">
            <ModalSparkline prices={stock.sparkline} positive={positive} />
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-[10px] text-gray-400 dark:text-gray-500">20 days ago</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">Today</span>
          </div>
        </div>

        <div className="px-6 py-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            Key Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {metrics.map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {stock.sector && (
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: `${sectorColor}1a`, color: sectorColor }}
              >
                {stock.sector}
              </span>
            )}
            {stock.exchange && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {stock.exchange}
              </span>
            )}
          </div>
          {stock.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{stock.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */

export default function StocksTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [sectorFilter, setSectorFilter] = useState<Sector>("All");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [page, setPage] = useState(1);

  // Stock prices sync roughly every 15 min server-side, so poll on the same cadence
  const { data, isLoading: loading } = useSWR<StocksResponse>("/stocks/", {
    refreshInterval: 900_000,
  });
  const stocks = useMemo(() => (data?.success ? data.stocks : []), [data]);
  const indices = useMemo(() => (data?.success ? data.indices : []), [data]);

  const isStockView = activeFilter === "stock";

  // Reset to page 1 / clear sector filter when the top filter or search changes
  // (adjust during render, not in an effect, to avoid a cascading extra render)
  const [prevFilters, setPrevFilters] = useState({ activeFilter, searchQuery });
  if (prevFilters.activeFilter !== activeFilter || prevFilters.searchQuery !== searchQuery) {
    setPrevFilters({ activeFilter, searchQuery });
    if (page !== 1) setPage(1);
    if (!isStockView && sectorFilter !== "All") setSectorFilter("All");
  }

  const filtered = useMemo(() => {
    let list = stocks;
    if (activeFilter !== "all") list = list.filter((s) => s.category === activeFilter);
    if (isStockView && sectorFilter !== "All") list = list.filter((s) => s.sector === sectorFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }
    return list;
  }, [stocks, activeFilter, sectorFilter, isStockView, searchQuery]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: stocks.length };
    FILTERS.slice(1).forEach(({ key }) => {
      c[key] = stocks.filter((s) => s.category === key).length;
    });
    return c;
  }, [stocks]);

  // The rich stock view shows its curated ~20 names on one page (no pagination
  // needed); the plain All/Crypto/ETF grid keeps the existing pager.
  const totalPages = isStockView ? 1 : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = isStockView ? filtered : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[rgba(22,163,74,0.04)] text-gray-900 dark:text-white rounded-lg border-2 border-[rgba(22,163,74,0.14)] focus:border-[#16a34a] focus:outline-none transition-colors placeholder:text-gray-500"
        />
      </div>

      {/* Asset-class filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === key ? "" : "tv-card text-gray-500 dark:text-gray-300 hover:opacity-80"
            }`}
            style={activeFilter === key ? { background: "#16a34a", color: "#001a0f" } : undefined}
          >
            {label}
            {counts[key] > 0 && (
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 ${
                  activeFilter === key ? "bg-black/10 text-[#001a0f]" : "bg-gray-500/10 text-gray-500 dark:text-gray-300"
                }`}
              >
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stocks-only: index bar + sector pills */}
      {isStockView && (
        <>
          <IndexBar indices={indices} />
          <div className="mb-6 flex flex-wrap gap-2">
            {SECTOR_FILTERS.map((sector) => (
              <button
                key={sector}
                onClick={() => setSectorFilter(sector)}
                className={`h-8 px-4 rounded-full text-xs font-semibold transition-colors ${
                  sectorFilter === sector
                    ? ""
                    : "tv-card text-gray-500 dark:text-gray-300 hover:border-[#16a34a]"
                }`}
                style={sectorFilter === sector ? { background: "#16a34a", color: "#001a0f" } : undefined}
              >
                {sector}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-[#16a34a] animate-spin" />
        </div>
      )}

      {/* Grid */}
      {!loading && paginated.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((stock) =>
            isStockView ? (
              <RichStockCard key={stock.symbol} stock={stock} onClick={() => setSelectedStock(stock)} />
            ) : (
              <div
                key={stock.symbol}
                onClick={() => router.push(`/market/${stock.symbol}`)}
                className="tv-card p-6 rounded-lg hover:border-[#16a34a] transition-all cursor-pointer hover:shadow-lg hover:shadow-[#16a34a]/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <StockLogo logoUrl={stock.logo_url} name={stock.name || stock.symbol} size={48} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{stock.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {stock.is_featured && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs font-medium rounded">
                        Featured
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 bg-white/5 text-gray-400 text-xs rounded capitalize">
                      {stock.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {parseFloat(stock.price) > 0 ? (
                      `$${parseFloat(stock.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    ) : (
                      <span className="text-gray-500 text-xs">Price unavailable</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {stock.is_positive_change ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${stock.is_positive_change ? "text-green-500" : "text-red-500"}`}>
                      {stock.is_positive_change ? "+" : ""}
                      {parseFloat(stock.change).toFixed(2)} ({parseFloat(stock.change_percent).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Empty */}
      {!loading && paginated.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchQuery ? "No stocks found matching your search" : `No ${activeFilter === "all" ? "assets" : activeFilter} available`}
          </p>
        </div>
      )}

      {/* Pagination (plain grid only) */}
      {!loading && !isStockView && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg tv-card text-gray-400 disabled:opacity-40 hover:border-[#16a34a] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | "…")[]>((acc, p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="text-gray-500 px-1">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === p ? "" : "tv-card text-gray-400 hover:border-[#16a34a]"
                  }`}
                  style={page === p ? { background: "#16a34a", color: "#001a0f" } : undefined}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg tv-card text-gray-400 disabled:opacity-40 hover:border-[#16a34a] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-gray-500 text-sm ml-2">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
        </div>
      )}

      {selectedStock && <RichStockModal stock={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
