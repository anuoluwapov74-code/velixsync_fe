"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


interface TraderData {
  id: number;
  name: string;
  username: string;
  badge: string;
  gain: string;
  copiers: number;
  risk: number;
}

const TradersSection = () => {
  const [traders, setTraders] = useState<TraderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_ORIGIN}/traders/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          // Limit to first 3 traders
          setTraders(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching traders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTraders();
  }, []);

  if (loading) {
    return (
      <section className="relative py-8 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              Top Performers
            </p>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Copy from the best traders
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
              Loading traders...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Top Performers
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Copy from the best traders
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
            Our top-performing traders have consistently delivered exceptional
            results. Choose from a diverse range of trading strategies.
          </p>
        </div>

        {/* Traders Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-8">
          {traders.map((trader, index) => (
            <TraderCard
              key={index}
              name={trader.name}
              username={trader.username}
              role={trader.badge === "gold" ? "Expert" : trader.badge === "silver" ? "Advanced" : "Trader"}
              copiers={trader.copiers}
              profit={`${parseFloat(trader.gain).toFixed(2)}%`}
              profitPeriod="1M"
              totalCopiers={trader.copiers}
              riskLevel={trader.risk <= 3 ? "Low Risk" : trader.risk <= 6 ? "Balanced Risk" : "High Risk"}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 flex justify-center lg:mt-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-white/20 bg-transparent px-8 py-3 text-sm font-semibold transition-all hover:border-primary hover:text-primary hover:-translate-y-0.5"
          >
            View All Traders
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Trader Card Component
interface TraderCardProps {
  name: string;
  username: string;
  role: string;
  copiers: number;
  profit: string;
  profitPeriod: string;
  totalCopiers: number;
  riskLevel: string;
}

const TraderCard = ({
  name,
  role,
  copiers,
  profit,
  profitPeriod,
  totalCopiers,
  riskLevel,
}: TraderCardProps) => (
  <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 dark:border-white/8 bg-white/70 dark:bg-white/3 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-600/[0.06]">
    {/* Header with Avatar */}
    <div className="border-b border-gray-100 dark:border-white/[0.06] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-600 to-green-700 text-base font-bold text-white shadow-md shadow-green-600/20">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="truncate text-sm font-bold">{name}</div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="truncate text-xs text-gray-500 dark:text-gray-400">
              {role}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="p-6">
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        {/* Copiers */}
        <div>
          <div className="mb-1 flex items-center justify-center gap-1">
            <span className="text-lg font-bold">{copiers.toLocaleString()}</span>
            <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Copiers</div>
        </div>

        {/* Profit */}
        <div>
          <div className="mb-1 flex items-center justify-center gap-1">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{profit}</span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Profit ({profitPeriod})
          </div>
        </div>

        {/* Total Copiers */}
        <div>
          <div className="mb-1 flex items-center justify-center gap-1">
            <span className="text-lg font-bold">{totalCopiers.toLocaleString()}</span>
            <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Total</div>
        </div>
      </div>

      {/* Risk Level */}
      <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-50 dark:bg-white/[0.04] px-4 py-2.5">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Risk level</span>
        <span className="rounded-full bg-green-100 dark:bg-green-600/15 px-3 py-0.5 text-xs font-semibold text-green-800 dark:text-green-300">
          {riskLevel}
        </span>
      </div>

      {/* Copy Button */}
      <Link href="/login" className="flex items-center justify-center w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-green-600/25 hover:-translate-y-0.5">
        Copy Trader
      </Link>
    </div>
  </div>
);

export default TradersSection;
