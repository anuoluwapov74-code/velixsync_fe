"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StocksTab from "@/components/dashboard/market/StocksTab";
import TreemapTab from "@/components/dashboard/market/TreemapTab";
import NewsTab from "@/components/dashboard/market/NewsTab";

type Tab = "stocks" | "treemap" | "news";

const TABS: { key: Tab; label: string }[] = [
  { key: "stocks",  label: "Stocks" },
  { key: "treemap", label: "Treemap" },
  { key: "news",    label: "News Edge" },
];

function isTab(value: string | null): value is Tab {
  return value === "stocks" || value === "treemap" || value === "news";
}

function MarketPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<Tab>(isTab(initialTab) ? initialTab : "stocks");

  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    router.replace(tab === "stocks" ? "/market" : `/market?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
          Markets
        </h1>

        <div className="flex gap-1 border-b border-gray-200 dark:border-white/10">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => selectTab(key)}
              className={`px-4 py-2.5 -mb-px text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-[#00C9A7] text-[#00C9A7]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "stocks" && <StocksTab />}
      {activeTab === "treemap" && <TreemapTab />}
      {activeTab === "news" && <NewsTab />}
    </div>
  );
}

export default function MarketPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <MarketPageInner />
    </Suspense>
  );
}
