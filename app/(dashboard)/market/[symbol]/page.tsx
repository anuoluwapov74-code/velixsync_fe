"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import {
  TrendingUp,
  TrendingDown,
  Loader2,
  ArrowLeft,
  Globe,
  BarChart2,
  Info,
  Wallet,
} from "lucide-react";
import StockLogo from "@/components/dashboard/StockLogo";

interface StockDetail {
  symbol: string;
  name: string;
  logo_url: string | null;
  price: string;
  change: string;
  change_percent: string;
  is_positive_change: boolean;
  open: number;
  previous_close: number;
  day_high: number;
  day_low: number;
  year_high: number;
  year_low: number;
  market_cap: number | null;
  volume: number | null;
  avg_volume: number | null;
  eps: number | null;
  pe: number | null;
  exchange: string | null;
  sector: string | null;
  industry: string | null;
  description: string | null;
  website: string | null;
  ceo: string | null;
}

interface StockDetailResponse {
  success: boolean;
  error?: string;
  stock: StockDetail;
  user_position?: UserPosition | null;
}

interface UserPosition {
  id: number;
  shares: string;
  average_buy_price: string;
  total_invested: string;
  current_value: string;
  profit_loss: string;
  profit_loss_percent: string;
}

function fmt(n: number | string | null | undefined, decimals = 2): string {
  const v = parseFloat(String(n ?? 0));
  if (!v) return "—";
  return v.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtLarge(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

function fmtVol(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const router = useRouter();

  const { data, isLoading: loading, error: swrError } = useSWR<StockDetailResponse>(
    symbol ? `/stocks/${symbol.toUpperCase()}/` : null
  );

  const stock = data?.success ? data.stock : null;
  const position = data?.success ? data.user_position ?? null : null;
  const error = swrError ? "Failed to load data" : !loading && data && !data.success ? (data.error || "Symbol not found") : "";

  const price = stock ? parseFloat(stock.price) : 0;
  const change = stock ? parseFloat(stock.change) : 0;
  const changePct = stock ? parseFloat(stock.change_percent) : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Markets
        </button>

        {loading && (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="w-10 h-10 text-[#00C9A7] animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-40">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {!loading && stock && (
          <div className="space-y-5">
            {/* Hero */}
            <div className="tv-card p-6 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <StockLogo logoUrl={stock.logo_url} name={stock.name || stock.symbol} size={64} rounded="rounded-full" />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-white">{stock.symbol}</h1>
                    {stock.exchange && (
                      <span className="px-2 py-0.5 bg-[rgba(0,201,167,0.1)] text-[#00C9A7] text-xs rounded">
                        {stock.exchange}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm truncate">{stock.name}</p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {price > 0 ? (
                      `$${fmt(price)}`
                    ) : (
                      <span className="text-gray-500 text-xl">Price unavailable</span>
                    )}
                  </div>
                  {price > 0 && (
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 ${
                        stock.is_positive_change ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {stock.is_positive_change ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {stock.is_positive_change ? "+" : ""}
                        {fmt(change)} ({stock.is_positive_change ? "+" : ""}
                        {fmt(changePct)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Market Data */}
              <div className="tv-card p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-4 h-4 text-[#00C9A7]" />
                  <h2 className="text-white font-semibold text-sm">Market Data</h2>
                </div>
                <StatRow label="Open" value={stock.open > 0 ? `$${fmt(stock.open)}` : "—"} />
                <StatRow label="Previous Close" value={stock.previous_close > 0 ? `$${fmt(stock.previous_close)}` : "—"} />
                <StatRow label="Day High" value={stock.day_high > 0 ? `$${fmt(stock.day_high)}` : "—"} />
                <StatRow label="Day Low" value={stock.day_low > 0 ? `$${fmt(stock.day_low)}` : "—"} />
                <StatRow label="52-Week High" value={stock.year_high > 0 ? `$${fmt(stock.year_high)}` : "—"} />
                <StatRow label="52-Week Low" value={stock.year_low > 0 ? `$${fmt(stock.year_low)}` : "—"} />
              </div>

              {/* Key Statistics */}
              <div className="tv-card p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-4 h-4 text-[#00C9A7]" />
                  <h2 className="text-white font-semibold text-sm">Key Statistics</h2>
                </div>
                <StatRow label="Market Cap" value={fmtLarge(stock.market_cap)} />
                <StatRow label="Volume" value={fmtVol(stock.volume)} />
                <StatRow label="Avg Volume" value={fmtVol(stock.avg_volume)} />
                <StatRow label="EPS" value={stock.eps != null ? `$${fmt(stock.eps)}` : "—"} />
                <StatRow label="P/E Ratio" value={stock.pe != null ? fmt(stock.pe) : "—"} />
                {stock.sector && <StatRow label="Sector" value={stock.sector} />}
                {stock.industry && <StatRow label="Industry" value={stock.industry} />}
              </div>
            </div>

            {/* Your Position */}
            {position && (
              <div className="tv-card p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-4 h-4 text-[#00C9A7]" />
                  <h2 className="text-white font-semibold text-sm">Your Position</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Shares Held", value: fmt(position.shares) },
                    { label: "Avg Buy Price", value: `$${fmt(position.average_buy_price)}` },
                    { label: "Total Invested", value: `$${fmt(position.total_invested)}` },
                    { label: "Current Value", value: `$${fmt(position.current_value)}` },
                    {
                      label: "P&L",
                      value: `${parseFloat(position.profit_loss) >= 0 ? "+" : ""}$${fmt(position.profit_loss)} (${parseFloat(position.profit_loss_percent) >= 0 ? "+" : ""}${fmt(position.profit_loss_percent)}%)`,
                      colored: true,
                      positive: parseFloat(position.profit_loss) >= 0,
                    },
                  ].map(({ label, value, colored, positive }) => (
                    <div key={label} className="tv-inner rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <p className={`text-sm font-semibold ${colored ? (positive ? "text-green-400" : "text-red-400") : "text-white"}`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            {stock.description && (
              <div className="tv-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-semibold text-sm">About</h2>
                  {stock.website && (
                    <a
                      href={stock.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#00C9A7] text-xs hover:opacity-80 transition-opacity"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-6">
                  {stock.description}
                </p>
                {stock.ceo && (
                  <p className="text-gray-500 text-xs mt-3">CEO: {stock.ceo}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
