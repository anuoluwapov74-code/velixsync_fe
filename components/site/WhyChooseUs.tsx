"use client";

import React from "react";
import Link from "next/link";

const WhyChooseUs = () => {
  return (
    <section className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            The Problem & Solution
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            You should know...
          </h2>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left Column - The Problem */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-white/8 bg-white/70 dark:bg-white/3 backdrop-blur-sm p-8 lg:p-10 transition-all duration-300 hover:shadow-xl hover:shadow-green-600/5">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/[0.06] dark:bg-red-500/[0.08] blur-3xl" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 dark:bg-red-500/10 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">The Challenge</span>
              </div>
              <h3 className="text-xl font-bold lg:text-2xl mb-4">
                Studying the market takes time
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
                Building and maintaining a trading strategy is hard. Options
                require timing, strategy, and discipline. Only 11-26% of manual
                investors succeed on their own. With VelixSync, you can replicate
                successful trades from seasoned options traders to tilt the odds
                in your favor.
              </p>
            </div>
          </div>

          {/* Right Column - The Solution */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-white/8 bg-white/70 dark:bg-white/3 backdrop-blur-sm p-8 lg:p-10 transition-all duration-300 hover:shadow-xl hover:shadow-green-600/5">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-green-500/[0.06] dark:bg-green-500/[0.08] blur-3xl" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-500/10 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">The Solution</span>
              </div>
              <h3 className="text-xl font-bold lg:text-2xl mb-4">
                Beat the odds with Copy Trading
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base mb-6">
                Proven Success Rate. Over 73% of investors generate profits by
                copying top leaders—especially in dynamic options markets.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-green-600/25 hover:-translate-y-0.5"
              >
                Start copy trading
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
