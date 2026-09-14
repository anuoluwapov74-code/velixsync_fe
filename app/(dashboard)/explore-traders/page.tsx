"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import useSWR from "swr";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Users,
  Star,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { PulseLoader } from "react-spinners";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Trader {
  id: number;
  name: string;
  username: string;
  avatar_url: string | null;
  badge: string;
  country: string;
  gain: string;
  risk: number;
  trades: number;
  copiers: number;
  trend_direction: string;
  category: string;
  tags: string[];
  min_account_threshold: string;
  is_active: boolean;
}

const categories = [
  { key: "all", label: "All" },
  { key: "crypto", label: "Crypto" },
  { key: "stocks", label: "Stocks" },
  { key: "healthcare", label: "Healthcare" },
  { key: "financial", label: "Financial Services" },
  { key: "options", label: "Options" },
  { key: "tech", label: "Tech" },
  { key: "etf", label: "ETF" },
];

const faqs = [
  {
    question: "What is Copy Trading?",
    answer:
      "Copy trading is an investment method that allows individuals to automatically copy the trades of professional or experienced traders. Instead of making trading decisions yourself, you select a trader to follow, and your account mirrors their positions in real time.",
  },
  {
    question: "How do I copy an Expert?",
    answer:
      "Simply browse through our top traders, review their performance metrics, and click the 'Copy' button on their profile. You can set your investment amount and risk parameters before starting to copy their trades.",
  },
  {
    question: "How can I stop copying an Expert?",
    answer:
      "You can stop copying an expert at any time by going to your active copies section and clicking 'Stop Copying'. Your current positions can be closed immediately or you can choose to keep them open.",
  },
  {
    question: "Why don't I receive any trades from copied experts?",
    answer:
      "This could be because the expert hasn't made any trades recently, your account balance is insufficient for the minimum trade size, or there may be trading restrictions on your account. Check your copy trading settings and account status.",
  },
];

// Mini trend line icon
const TrendIcon: React.FC<{ direction: string }> = ({ direction }) => {
  const isUp = direction === "upward";
  const color = isUp ? "#6b7280" : "#6b7280";
  const upPath = "M2,12 L6,9 L10,11 L14,6 L18,8 L22,3";
  const downPath = "M2,3 L6,6 L10,4 L14,9 L18,7 L22,12";

  return (
    <svg
      width="24"
      height="14"
      viewBox="0 0 24 14"
      fill="none"
      className="shrink-0"
    >
      <path
        d={isUp ? upPath : downPath}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const getAvatarUrl = (avatarUrl: string | null, name: string) => {
  return (
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&size=128`
  );
};

const formatGain = (gain: string) => {
  const val = parseFloat(gain);
  if (val >= 1000) {
    return `${(val / 1000).toFixed(1)}K`;
  }
  return val.toFixed(2);
};

/* ══════════════════════════════════════════════════════════════════════════
   "When they grow, you grow" hero banner — reproduces the reference mockup
   in code (light card that flips to a dark card in dark mode). The mockup
   was designed at a single (roughly tablet-ish) width; the two-column
   layout is kept at every breakpoint per instruction ("mobile should be
   exactly the same" — no stacking), with sizes scaling down for real phone
   widths. Desktop sizing beyond the mockup is improvised for balance.
   ══════════════════════════════════════════════════════════════════════════ */

const FEATURED_TRADERS = [
  { name: "OptionsMike", avatar: "/team/banner_1.jpg", returnPct: "31.18%" },
  { name: "AlphaTrader", avatar: "/team/banner_2.jpg", returnPct: "24.96%" },
  { name: "GreenMomentum", avatar: "/team/banner_3.jpg", returnPct: "18.72%" },
];

const BANNER_GRID_LINES = [
  { y: 8, label: "+30%" },
  { y: 46, label: "+20%" },
  { y: 84, label: "+10%" },
  { y: 122, label: "0%" },
  { y: 160, label: "-10%" },
];

// Hand-drawn noisy-but-upward line, matching the mockup's "steady climb with
// small dips" shape. Plot area is 0–260 on the x-axis; 260–320 is reserved
// for the axis labels on the right, same as the reference.
const BANNER_LINE_PATH =
  "M0,150 L18,140 L36,144 L54,120 L72,128 L90,104 L108,110 L126,86 L144,92 L162,68 L180,72 L198,50 L216,40 L234,30 L252,20 L260,14";
const BANNER_AREA_PATH = `${BANNER_LINE_PATH} L260,160 L0,160 Z`;

function GrowthChart() {
  return (
    <svg viewBox="0 0 320 168" preserveAspectRatio="xMidYMid meet" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="growthBannerFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>

      {BANNER_GRID_LINES.map((g) => (
        <g key={g.label}>
          <line
            x1="0"
            x2="260"
            y1={g.y}
            y2={g.y}
            className="stroke-gray-200 dark:stroke-white/10"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          <text
            x="270"
            y={g.y + 3}
            className="fill-gray-400 dark:fill-gray-500"
            style={{ fontSize: 9, fontWeight: 600 }}
          >
            {g.label}
          </text>
        </g>
      ))}

      <path d={BANNER_AREA_PATH} fill="url(#growthBannerFill)" />
      <path d={BANNER_LINE_PATH} stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* End-point halo + dot */}
      <circle cx="260" cy="14" r="9" fill="#22c55e" fillOpacity="0.18" />
      <circle cx="260" cy="14" r="4.5" fill="#22c55e" className="stroke-white dark:stroke-[#0b1a12]" strokeWidth="2" />
    </svg>
  );
}

const BANNER_FEATURES = [
  { icon: ShieldCheck, title: "Secure & Regulated", sub: "Your capital is protected" },
  { icon: Users, title: "30M+ Users", sub: "Join a global community" },
  // The reference's third icon is a competitor's brand mark — swapped for a
  // generic icon rather than reproducing another company's logo.
  { icon: Sparkles, title: "Simple & Transparent", sub: "Easy to copy. Easy to invest." },
];

function GrowthBanner() {
  return (
    <div className="relative bg-white dark:bg-[#0b1a12] rounded-3xl border border-gray-100 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="grid grid-cols-[minmax(0,6fr)_minmax(0,7fr)] gap-3 sm:gap-8 lg:gap-12 p-4 sm:p-8 lg:p-12">
        {/* ── Left: heading, subtext, featured traders ── */}
        <div className="min-w-0">
          <h1 className="text-base sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold leading-[1.15] text-gray-900 dark:text-white">
            When they grow,
            <br />
            <span className="text-green-600 dark:text-green-400">you grow</span>
          </h1>
          <p className="mt-2 sm:mt-4 text-[11px] sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 max-w-[220px] sm:max-w-xs lg:max-w-sm leading-snug">
            Copy experienced investors automatically and benefit from their knowledge and strategy.
          </p>

          {/* Fixed-size chips that scroll horizontally instead of shrinking
              to fit — keeps avatars/text legible on narrow screens rather
              than squeezing them past a readable floor. */}
          <div
            className="flex gap-3 sm:gap-6 mt-3 sm:mt-8 overflow-x-auto pr-2 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {FEATURED_TRADERS.map((t) => (
              <div key={t.name} className="flex flex-col items-start shrink-0">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden border border-gray-100 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center border-2 border-white dark:border-[#0b1a12]">
                    <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white fill-white" />
                  </div>
                </div>
                <p className="mt-1.5 sm:mt-2.5 text-[10px] sm:text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  {t.name}
                </p>
                <p className="text-xs sm:text-lg font-extrabold text-green-600 dark:text-green-400 mt-0.5">
                  {t.returnPct}
                </p>
                <p className="text-[9px] sm:text-[10px] font-semibold tracking-wide text-gray-400 dark:text-gray-500 uppercase mt-0.5 whitespace-nowrap">
                  Return (12M)
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: portfolio stat + chart ── */}
        <div className="min-w-0 flex flex-col">
          <p className="text-[9px] sm:text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase truncate">
            Your Portfolio (12M)
          </p>
          <div className="flex items-center gap-1 sm:gap-2 mt-1">
            <span className="text-lg sm:text-3xl lg:text-4xl font-extrabold text-green-600 dark:text-green-400">
              +24.96%
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 shrink-0" />
          </div>
          {/* aspect-ratio (not a fixed min-height) keeps the chart's own
              proportions correct as the column narrows, instead of it
              getting squashed/distorted. */}
          <div className="w-full aspect-[320/168] mt-2 sm:mt-4">
            <GrowthChart />
          </div>
        </div>
      </div>

      {/* ── Feature row ── */}
      <div className="border-t border-gray-100 dark:border-white/10 px-4 sm:px-8 lg:px-12 py-3 sm:py-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-6">
          {BANNER_FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-1.5 sm:gap-3 min-w-0">
              <f.icon className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" strokeWidth={2} />
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[13px] font-bold uppercase text-gray-900 dark:text-white leading-tight">
                  {f.title}
                </p>
                <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                  {f.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExploreTraders() {
  const [activeTab, setActiveTab] = useState<"experts" | "howItWorks">(
    "experts"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Embla carousel for Trending Investors
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      loop: true,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch ALL traders (only search filter goes to API, NOT category)
  const params = new URLSearchParams();
  if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
  const queryString = params.toString();
  const swrKey = `/traders/${queryString ? `?${queryString}` : ""}`;

  const { data, error: fetchError, isLoading: loading, mutate: refetchTraders } = useSWR<Trader[]>(swrKey);
  const traders = useMemo(() => data ?? [], [data]);
  const error = fetchError ? "Failed to load traders. Please try again later." : null;

  // Only the top 5 traders (ranked by Min Capital, highest first) are shown
  // by default — every section on this page (Trending, Rising Stars,
  // categories) draws from this same pool. Searching lifts the cap entirely
  // so a user can find any trader, not just the top 5.
  const displayTraders = useMemo(() => {
    if (debouncedSearch.trim()) return traders;
    return [...traders]
      .sort(
        (a, b) =>
          (parseFloat(b.min_account_threshold) || 0) -
          (parseFloat(a.min_account_threshold) || 0)
      )
      .slice(0, 5);
  }, [traders, debouncedSearch]);

  const trendingTraders = displayTraders;

  // Rising Stars is a real criteria now (tagged "Rising Star(s)" by admin),
  // not an arbitrary slice — the section hides itself entirely when none of
  // the displayed traders qualify.
  const risingStars = useMemo(
    () =>
      displayTraders.filter((t) =>
        t.tags?.some((tag) => tag.toLowerCase().includes("rising"))
      ),
    [displayTraders]
  );

  // Category filter is CLIENT-SIDE, only for "Most copied by categories"
  const categorizedTraders = useMemo(() => {
    if (activeCategory === "all") return displayTraders;
    return displayTraders.filter(
      (t) => t.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [displayTraders, activeCategory]);

  return (
    <div className="w-full min-h-screen rounded-2xl ">
      {/* ========== HERO BANNER — "When they grow, you grow" ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <GrowthBanner />
      </div>

      {/* ========== SEARCH BAR ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Type to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[rgba(0,201,167,0.04)] border border-[rgba(0,201,167,0.14)] rounded-xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]/30 focus:border-[#00C9A7] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ========== TABS ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 border-b border-[rgba(255,255,255,0.08)]">
          <button
            onClick={() => setActiveTab("experts")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "experts"
                ? "text-gray-900 dark:text-white"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            Top Experts
            {activeTab === "experts" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("howItWorks")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "howItWorks"
                ? "text-gray-900 dark:text-white"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            How It Works
            {activeTab === "howItWorks" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white" />
            )}
          </button>
        </div>
      </div>

      {/* ========== CONTENT ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "experts" ? (
          <>
            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <PulseLoader color="#27ae60" size={15} />
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">{error}</p>
                <button
                  onClick={() => refetchTraders()}
                  className="mt-4 px-6 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && traders.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                  {debouncedSearch
                    ? `No traders found matching "${debouncedSearch}"`
                    : "No traders found"}
                </p>
                {debouncedSearch && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-6 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {!loading && !error && traders.length > 0 && (
              <>
                {/* ========== TRENDING INVESTORS (carousel) ========== */}
                <section className="mb-12">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Trending Investors
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => emblaApi?.scrollPrev()}
                        disabled={!canScrollPrev}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        aria-label="Previous"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => emblaApi?.scrollNext()}
                        disabled={!canScrollNext}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        aria-label="Next"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Investors with the most popularity of copy among others
                  </p>

                  <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-4">
                      {trendingTraders.map((trader) => (
                        <div
                          key={trader.id}
                          className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(25%-12px)]"
                        >
                          <Link
                            href={`/explore-traders/${trader.id}`}
                            className="group block tv-card rounded-xl overflow-hidden hover:shadow-lg hover:border-[#00C9A7] transition-all h-full"
                          >
                            {/* Card Header - Dark top section */}
                            <div className="bg-gray-800 dark:bg-[#071a0e] px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600 dark:border-gray-500 bg-gray-700 shrink-0">
                                  {trader.avatar_url ? (
                                    <Image
                                      src={getAvatarUrl(
                                        trader.avatar_url,
                                        trader.name
                                      )}
                                      width={48}
                                      height={48}
                                      alt={trader.name}
                                      className="w-full h-full object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-semibold text-lg">
                                      {trader.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-sm font-semibold text-white truncate">
                                    {trader.name}
                                  </h3>
                                  <p className="text-xs text-gray-400">
                                    {trader.badge === "gold"
                                      ? "Earning trader"
                                      : trader.risk >= 7
                                      ? "High risk"
                                      : "Active trader"}
                                  </p>
                                </div>
                              </div>
                              {/* Badges */}
                              <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-2.5 py-1 bg-lime-400/20 text-lime-400 text-[10px] font-medium rounded-full">
                                  Trending Investors
                                </span>
                                {trader.badge === "gold" && (
                                  <span className="px-2.5 py-1 bg-lime-400/20 text-lime-400 text-[10px] font-medium rounded-full">
                                    Long track record
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Body - Stats */}
                            <div className="px-4 py-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {formatGain(trader.gain)}%
                                  </p>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <TrendIcon
                                      direction={
                                        trader.trend_direction || "upward"
                                      }
                                    />
                                  </div>
                                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                    Profit (1M)
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {trader.copiers.toLocaleString()}
                                  </p>
                                  <div className="flex items-center justify-end gap-1 mt-0.5">
                                    <TrendIcon
                                      direction={
                                        trader.trend_direction || "upward"
                                      }
                                    />
                                  </div>
                                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                    Copiers
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* ========== RISING STARS (image3) ==========
                    Only rendered when at least one displayed trader is
                    actually tagged as a rising star — heading and
                    sub-heading disappear together with the grid when none
                    qualify, rather than showing an empty section. */}
                {risingStars.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Rising Stars
                    </h2>

                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Check new traders with great potential, grasp investment
                    opportunities
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {risingStars.map((trader) => (
                      <Link
                        key={trader.id}
                        href={`/explore-traders/${trader.id}`}
                        className="group tv-card rounded-xl hover:shadow-lg hover:border-[#00C9A7] transition-all overflow-hidden"
                      >
                        {/* Top section - Avatar and name */}
                        <div className="px-4 pt-4 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 shrink-0">
                              {trader.avatar_url ? (
                                <Image
                                  src={getAvatarUrl(
                                    trader.avatar_url,
                                    trader.name
                                  )}
                                  width={56}
                                  height={56}
                                  alt={trader.name}
                                  className="w-full h-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold text-xl">
                                  {trader.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                {trader.name}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Rising Star
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Stats row - gray background */}
                        <div className="mx-4 mb-3 tv-inner rounded-lg px-4 py-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-base font-bold text-gray-900 dark:text-white">
                                {formatGain(trader.gain)}%
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <TrendIcon
                                  direction={
                                    trader.trend_direction || "upward"
                                  }
                                />
                              </div>
                              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                Profit (1M)
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-base font-bold text-gray-900 dark:text-white">
                                {trader.copiers.toLocaleString()}
                              </p>
                              <div className="flex items-center justify-end gap-1 mt-0.5">
                                <TrendIcon
                                  direction={
                                    trader.trend_direction || "upward"
                                  }
                                />
                              </div>
                              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                Copiers
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Risk level */}
                        <div className="px-4 pb-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Risk level:
                          </p>
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                              <div
                                key={level}
                                className={`h-1.5 flex-1 rounded-full ${
                                  level <= trader.risk
                                    ? trader.risk <= 3
                                      ? "bg-green-400"
                                      : trader.risk <= 6
                                      ? "bg-yellow-400"
                                      : "bg-red-400"
                                    : "bg-gray-200 dark:bg-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Copy Trader button */}
                        <div className="px-4 pb-4 pt-3">
                          <div className="w-full py-2.5 border border-gray-200 dark:border-white/10 rounded-lg text-center text-sm font-semibold text-gray-900 dark:text-white group-hover:bg-gray-50 dark:group-hover:bg-[#0d3320] transition-colors">
                            Copy trader
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
                )}

                {/* ========== MOST COPIED BY CATEGORIES (image4) ========== */}
                <section>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Most copied by categories
                    </h2>
                    
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Explore traders that are copied the most based on our
                    categories
                  </p>

                  {/* Category Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                          activeCategory === cat.key
                            ? "border-gray-900 dark:border-white bg-transparent text-gray-900 dark:text-white"
                            : "border-gray-300 dark:border-white/10 bg-transparent text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/20"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Progress bar under tabs */}
                  <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((categories.findIndex(
                            (c) => c.key === activeCategory
                          ) +
                            1) /
                            categories.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  {/* Filtered traders list */}
                  {categorizedTraders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <Users className="w-7 h-7 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        No traders found in this category
                      </p>
                      <button
                        onClick={() => setActiveCategory("all")}
                        className="mt-3 text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-400 font-medium transition-colors"
                      >
                        View all categories
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categorizedTraders.map((trader, index) => (
                        <Link
                          key={trader.id}
                          href={`/explore-traders/${trader.id}`}
                          className="group flex items-center gap-3 sm:gap-4 tv-card rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-[#00C9A7] transition-all"
                        >
                          {/* Rank Number */}
                          <div className="shrink-0 w-8 sm:w-12">
                            <span
                              className={`text-3xl sm:text-5xl font-extrabold ${
                                index < 3
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            >
                              {index + 1}
                            </span>
                          </div>

                          {/* Avatar with green ring */}
                          <div className="relative shrink-0">
                            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full p-0.5 bg-linear-to-br from-lime-400 to-green-500">
                              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                                {trader.avatar_url ? (
                                  <Image
                                    src={getAvatarUrl(
                                      trader.avatar_url,
                                      trader.name
                                    )}
                                    width={56}
                                    height={56}
                                    alt={trader.name}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-lime-400 dark:bg-lime-500 text-gray-900 font-bold text-sm sm:text-lg">
                                    {trader.username.charAt(0)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Username */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {trader.username}
                            </h3>
                          </div>

                          {/* Profit */}
                          <div className="shrink-0 text-right">
                            <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
                              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                                {formatGain(trader.gain)}%
                              </span>
                              <TrendIcon
                                direction={
                                  trader.trend_direction || "upward"
                                }
                              />
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                              Profit (1M)
                            </p>
                          </div>

                          {/* Copiers */}
                          <div className="shrink-0 text-right">
                            <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
                              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                                {trader.copiers.toLocaleString()}
                              </span>
                              <TrendIcon
                                direction={
                                  trader.trend_direction || "upward"
                                }
                              />
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                              Copiers
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        ) : (
          /* How It Works - FAQ Section */
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Everything you need to know about copy trading
              </p>
            </div>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="tv-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-[#0d3320]/30 transition-all"
                >
                  <span className="text-sm font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
