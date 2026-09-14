"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Newspaper, ChevronLeft, ChevronRight, ExternalLink, User, Calendar } from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */

type Category = "All" | "Stocks" | "Technology" | "Economy" | "Cryptocurrency" | "Commodities" | "Forex";
type Impact = "positive" | "negative" | "neutral";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  category: string;
  source: string;
  author: string;
  published_at: string;
  image_url: string | null;
  source_url: string | null;
  tags: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface NewsListResponse {
  results: NewsItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface NewsDetailResponse {
  success: boolean;
  article: NewsItem & { content: string };
}

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════ */

const CATEGORIES: Category[] = ["All", "Stocks", "Technology", "Economy", "Cryptocurrency", "Commodities", "Forex"];

// Distinguishing accent per category — kept in velixsync's own tonal range
// (mint/teal accent + neutral supporting hues), not the source design's palette.
const CATEGORY_COLORS: Record<string, string> = {
  Stocks: "#3b82f6",
  Technology: "#06b6d4",
  Economy: "#f59e0b",
  Cryptocurrency: "#8b5cf6",
  Commodities: "#f97316",
  Forex: "#00C9A7",
};

const SOURCE_COLORS = ["#3b82f6", "#06b6d4", "#f59e0b", "#8b5cf6", "#f97316", "#00C9A7", "#ec4899"];

const POSITIVE_WORDS = [
  "surge", "soar", "rally", "jump", "gain", "rise", "record", "beat", "strong",
  "boom", "bullish", "approved", "launch", "partnership", "invest", "growth",
];
const NEGATIVE_WORDS = [
  "crash", "drop", "fall", "plunge", "decline", "loss", "bear", "weak", "cut",
  "fail", "ban", "warning", "risk", "concern", "lawsuit", "fraud", "hack", "sued",
];

const PAGE_SIZE = 13; // 1 featured + 12 grid on page 1; 13 grid on later pages
const SEARCH_PAGE_SIZE = 50; // backend caps page_size at 50

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

function deriveImpact(title: string): Impact {
  const t = title.toLowerCase();
  if (POSITIVE_WORDS.some((w) => t.includes(w))) return "positive";
  if (NEGATIVE_WORDS.some((w) => t.includes(w))) return "negative";
  return "neutral";
}

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "#00C9A7";
}

function sourceColor(source: string) {
  let hash = 0;
  for (let i = 0; i < source.length; i++) hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  return SOURCE_COLORS[hash % SOURCE_COLORS.length];
}

function sourceInitials(source: string) {
  return (
    source
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "NW"
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function contentToParagraphs(content: string): string[] {
  if (!content) return [];
  const byNewline = content.split(/\n{2,}/).map((p) => p.replace(/\n/g, " ").trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;
  const words = content.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 200) chunks.push(words.slice(i, i + 200).join(" "));
  return chunks.filter(Boolean);
}

function impactStyles(impact: Impact) {
  if (impact === "positive")
    return { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", dot: "bg-green-500", label: "Bullish" };
  if (impact === "negative")
    return { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", dot: "bg-red-500", label: "Bearish" };
  return { bg: "bg-gray-500/10", text: "text-gray-500 dark:text-gray-400", dot: "bg-gray-400", label: "Neutral" };
}

/* ══════════════════════════════════════════════════════════════
   IMAGE (graceful fallback)
══════════════════════════════════════════════════════════════ */

function NewsImage({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-white/5 ${className ?? ""}`}>
        <Newspaper className="w-8 h-8 text-gray-400 dark:text-gray-600" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`object-cover ${className ?? ""}`} onError={() => setFailed(true)} />
  );
}

/* ══════════════════════════════════════════════════════════════
   SKELETON
══════════════════════════════════════════════════════════════ */

function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-white/10 ${className ?? ""}`} />;
}

function NewsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="tv-card rounded-2xl p-6 lg:p-8">
        <div className="flex gap-2 mb-4">
          <Sk className="h-5 w-16" /><Sk className="h-5 w-20" />
        </div>
        <Sk className="h-7 w-3/4 mb-3" />
        <Sk className="h-4 w-full mb-2" /><Sk className="h-4 w-5/6 mb-6" />
        <div className="flex justify-between">
          <div className="flex gap-2"><Sk className="h-6 w-12" /><Sk className="h-6 w-12" /></div>
          <Sk className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="tv-card rounded-2xl p-4">
            <div className="flex justify-between mb-3"><Sk className="h-5 w-16" /><Sk className="h-5 w-12" /></div>
            <Sk className="h-5 w-full mb-2" /><Sk className="h-5 w-4/5 mb-2" /><Sk className="h-5 w-3/5 mb-4" />
            <Sk className="h-4 w-full mb-1" /><Sk className="h-4 w-5/6 mb-4" />
            <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-white/5">
              <Sk className="h-4 w-20" /><Sk className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURED CARD
══════════════════════════════════════════════════════════════ */

function FeaturedCard({ article, onClick }: { article: NewsItem; onClick: () => void }) {
  const color = categoryColor(article.category);
  const imp = impactStyles(deriveImpact(article.title));

  return (
    <button onClick={onClick} className="w-full text-left group">
      <div className="tv-card rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:border-[#00C9A7] transition-colors">
        <div className="w-full h-1.5 sm:w-1.5 sm:h-auto shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 p-5 lg:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full"
              style={{ backgroundColor: `${color}1a`, color }}
            >
              {article.category}
            </span>
            <span className={`flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${imp.bg} ${imp.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${imp.dot}`} />
              {imp.label}
            </span>
            {article.is_featured && (
              <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-yellow-500/15 text-yellow-600 dark:text-yellow-400">
                Featured
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-[#00C9A7] transition-colors">
            {article.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5 line-clamp-2">
            {article.summary}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                style={{ backgroundColor: sourceColor(article.source) }}
              >
                {sourceInitials(article.source)}
              </div>
              <span>{article.source}</span>
              <span>&middot;</span>
              <span>{relativeTime(article.published_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   NEWS CARD (grid)
══════════════════════════════════════════════════════════════ */

function NewsCard({ article, onClick }: { article: NewsItem; onClick: () => void }) {
  const color = categoryColor(article.category);
  const imp = impactStyles(deriveImpact(article.title));

  return (
    <button
      onClick={onClick}
      className="tv-card rounded-2xl overflow-hidden hover:border-[#00C9A7] transition-colors text-left flex flex-col w-full"
    >
      <div className="relative h-40">
        <NewsImage src={article.image_url} alt={article.title} className="w-full h-full" />
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full"
            style={{ backgroundColor: `${color}1a`, color }}
          >
            {article.category}
          </span>
          <span className={`flex items-center gap-1 text-[10px] font-bold ${imp.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${imp.dot}`} />
            {imp.label}
          </span>
        </div>
        <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-3">
          {article.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
          {article.summary}
        </p>
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((t) => (
              <span key={t} className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 rounded">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
            style={{ backgroundColor: sourceColor(article.source) }}
          >
            {sourceInitials(article.source)}
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{article.source}</span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 ml-auto shrink-0">{relativeTime(article.published_at)}</span>
        </div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════════════ */

function NewsModal({
  article,
  content,
  contentLoading,
  onClose,
}: {
  article: NewsItem;
  content: string | null;
  contentLoading: boolean;
  onClose: () => void;
}) {
  const color = categoryColor(article.category);
  const imp = impactStyles(deriveImpact(article.title));
  const body = content ? contentToParagraphs(content) : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-[#0b1a12] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        >
          <div className="h-1 w-full shrink-0" style={{ backgroundColor: color }} />
          <div className="overflow-y-auto flex-1">
            <div className="px-5 sm:px-8 pt-6 pb-5 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full"
                    style={{ backgroundColor: `${color}1a`, color }}
                  >
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {relativeTime(article.published_at)} &middot; {estimateReadTime(content || article.summary)}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white leading-tight mb-3">
                {article.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{article.summary}</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${imp.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${imp.dot}`} />
                  <span className={`text-xs font-bold ${imp.text}`}>{imp.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                    style={{ backgroundColor: sourceColor(article.source) }}
                  >
                    {sourceInitials(article.source)}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{article.source}</span>
                </div>
                {article.author && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <User className="w-3.5 h-3.5" />
                    {article.author}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </div>

            {article.image_url && <NewsImage src={article.image_url} alt={article.title} className="w-full max-h-[260px]" />}

            <div className="px-5 sm:px-8 py-6 space-y-4">
              {contentLoading && body.length === 0 ? (
                <div className="space-y-3">
                  <Sk className="h-4 w-full" /><Sk className="h-4 w-5/6" /><Sk className="h-4 w-4/6" />
                </div>
              ) : body.length > 0 ? (
                body.map((para, i) => (
                  <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-[1.8]">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-[1.8]">{article.summary}</p>
              )}
            </div>

            <div className="px-5 sm:px-8 pb-6 pt-2 border-t border-gray-100 dark:border-white/5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {article.tags.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                      Affected Assets
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((t) => (
                        <span key={t} className="px-3 py-1 text-xs font-mono font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {article.source_url ? (
                  <a
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-bold text-[#001a0f] bg-[#00C9A7] hover:opacity-90 transition-opacity shrink-0"
                  >
                    Read full article
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */

export default function NewsTab() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Debounce free-text search before it hits the API
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const isSearching = searchQuery.length > 0;

  // Reset to page 1 when the category or search changes (adjust during render, not in an effect)
  const [prevFilters, setPrevFilters] = useState({ activeCategory, searchQuery });
  if (prevFilters.activeCategory !== activeCategory || prevFilters.searchQuery !== searchQuery) {
    setPrevFilters({ activeCategory, searchQuery });
    if (page !== 1) setPage(1);
  }

  const params = new URLSearchParams();
  params.set("page", String(isSearching ? 1 : page));
  params.set("page_size", String(isSearching ? SEARCH_PAGE_SIZE : PAGE_SIZE));
  if (activeCategory !== "All") params.set("category", activeCategory);
  if (searchQuery) params.set("search", searchQuery);

  const { data, error, isLoading } = useSWR<NewsListResponse>(`/news/?${params.toString()}`);
  const { data: detailData, isLoading: detailLoading } = useSWR<NewsDetailResponse>(
    selectedId ? `/news/${selectedId}/` : null
  );

  const articles = useMemo(() => data?.results ?? [], [data]);
  const selectedArticle = articles.find((a) => a.id === selectedId) ?? null;
  const selectedContent = detailData?.success ? detailData.article.content : null;

  const totalPages = data?.total_pages ?? 1;
  const showFeatured = page === 1 && !isSearching;
  const featured = showFeatured ? articles[0] ?? null : null;
  const rest = showFeatured ? articles.slice(1) : articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search news, assets, sources..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[rgba(0,201,167,0.04)] text-gray-900 dark:text-white rounded-lg border-2 border-[rgba(0,201,167,0.14)] focus:border-[#00C9A7] focus:outline-none transition-colors placeholder:text-gray-500"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-6">
        {CATEGORIES.map((cat) => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                active ? "" : "tv-card text-gray-500 dark:text-gray-400 hover:opacity-80"
              }`}
              style={active ? { background: "#00C9A7", color: "#001a0f" } : undefined}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <NewsSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-sm">Failed to load news. Please try again later.</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">No results found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Try a different keyword or category</p>
        </div>
      ) : (
        <>
          {featured && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7]" />
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Top Story
                </span>
              </div>
              <FeaturedCard article={featured} onClick={() => setSelectedId(featured.id)} />
            </div>
          )}

          {rest.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Latest News</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Real-time market intelligence</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {isSearching ? `${articles.length} results` : `${data?.total ?? 0} articles`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map((article) => (
                  <NewsCard key={article.id} article={article} onClick={() => setSelectedId(article.id)} />
                ))}
              </div>

              {!isSearching && totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg tv-card text-gray-400 disabled:opacity-40 hover:border-[#00C9A7] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg tv-card text-gray-400 disabled:opacity-40 hover:border-[#00C9A7] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {selectedArticle && (
        <NewsModal
          article={selectedArticle}
          content={selectedContent}
          contentLoading={detailLoading}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
