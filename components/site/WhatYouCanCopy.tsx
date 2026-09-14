"use client";

import React from "react";

const WhatYouCanCopy = () => {
  const copyOptions = [
    {
      icon: <StocksIcon />,
      title: "Stocks & ETFs",
      description:
        "Full-share orders or fractional allocations, instantaneous entry/exit mirroring, price-based T/P and S/L.",
      accentColor: "blue",
    },
    {
      icon: <OptionsIcon />,
      title: "Single-Leg Options (Calls & Puts)",
      description:
        "Replicate trade by trade: ticker, strike, expiry, premium, quantity, and timestamp.",
      accentColor: "cyan",
    },
    {
      icon: <MultiLegIcon />,
      title: "Multi-Leg Options Strategies",
      description:
        "Copy complex structures as a single unit: verticals, iron condors, butterflies, calendars, ratio spreads. We preserve leg ratios and timing.",
      accentColor: "indigo",
    },
  ];

  return (
    <section className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Instruments
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            What you can copy
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {copyOptions.map((option, index) => (
            <CopyCard key={index} {...option} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CopyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
}

const CopyCard = ({ icon, title, description, accentColor }: CopyCardProps) => {
  const getAccentClasses = () => {
    switch (accentColor) {
      case "blue":
        return {
          iconBg: "bg-green-50 dark:bg-green-500/10",
          iconColor: "text-green-700 dark:text-green-400",
          border: "group-hover:border-green-500/30",
          glow: "group-hover:shadow-green-600/5",
        };
      case "cyan":
        return {
          iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
          iconColor: "text-emerald-700 dark:text-emerald-400",
          border: "group-hover:border-emerald-500/30",
          glow: "group-hover:shadow-emerald-500/5",
        };
      case "indigo":
        return {
          iconBg: "bg-teal-50 dark:bg-teal-500/10",
          iconColor: "text-teal-700 dark:text-teal-400",
          border: "group-hover:border-teal-500/30",
          glow: "group-hover:shadow-teal-500/5",
        };
      default:
        return {
          iconBg: "bg-green-50 dark:bg-green-500/10",
          iconColor: "text-green-700 dark:text-green-400",
          border: "group-hover:border-green-500/30",
          glow: "group-hover:shadow-green-600/5",
        };
    }
  };

  const classes = getAccentClasses();

  return (
    <div
      className={`group flex flex-col items-center rounded-2xl border border-gray-200/80 dark:border-white/8 bg-white/70 dark:bg-white/3 backdrop-blur-sm p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${classes.border} ${classes.glow} lg:p-10`}
    >
      <div
        className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${classes.iconBg} transition-transform duration-300 group-hover:scale-110`}
      >
        <div className={classes.iconColor}>{icon}</div>
      </div>

      <h3 className="mb-3 text-base font-bold lg:text-lg">{title}</h3>

      <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

// Icon Components
const StocksIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const OptionsIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const MultiLegIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
  </svg>
);

export default WhatYouCanCopy;
