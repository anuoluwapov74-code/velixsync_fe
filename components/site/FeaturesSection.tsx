"use client";

import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <ClockIcon />,
      title: "Transparent Options Copying",
      description:
        "See exactly what you're mirroring—ticker, strategy, side (call/put), strike, expiry, entry/exit premium, size, and timestamps—plus a clear history of each leader's performance and drawdowns.",
      gradient: "from-green-500 to-emerald-400",
      bgColor: "bg-green-50 dark:bg-green-500/10",
      iconColor: "text-green-700 dark:text-green-400",
    },
    {
      icon: <DocumentIcon />,
      title: "Advanced Tools for Contracts",
      description:
        "Dial in risk before you copy: per-trade caps, %-of-equity allocation, max contracts, slippage guard, chain filters, and auto-hedge toggles for volatile names.",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: <ShieldIcon />,
      title: "Innovative Execution for Multi-Legs",
      description:
        "Copy complex structures as a unit: verticals, calendars, iron condors, butterflies. We sync legs, preserve ratios, and apply best-effort routing.",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: <ChatIcon />,
      title: "Trader-Centric Support",
      description:
        "Human help when it matters—real people on chat, phone, and email for account linking, order settings, and contract-specific questions.",
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: <BookIcon />,
      title: "Learn While You Copy",
      description:
        "Leaders attach notes, rationale, and risk context to each trade. Use strategy tags and post-trade debriefs to sharpen your own playbook.",
      gradient: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50 dark:bg-teal-500/10",
      iconColor: "text-teal-700 dark:text-teal-400",
    },
    {
      icon: <CrownIcon />,
      title: "Unique Options Features",
      description:
        "AutoGuard™: optional auto-TP/SL by premium, % move, or delta. Smart protections built right into every trade you copy.",
      gradient: "from-amber-500 to-yellow-500",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <section id="features" className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Platform Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Why choose VelixSync
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
            The most advanced copy trading platform with enterprise-grade
            security and lightning-fast execution.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  bgColor: string;
  iconColor: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
  gradient,
  bgColor,
  iconColor,
}: FeatureCardProps) => (
  <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-white/8 bg-white/70 dark:bg-white/3 backdrop-blur-sm p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-600/5">
    {/* Gradient background on hover */}
    <div
      className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08]`}
    />

    <div className="relative z-10">
      {/* Icon */}
      <div
        className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${bgColor} transition-transform duration-300 group-hover:scale-110`}
      >
        <div className={iconColor}>{icon}</div>
      </div>

      <h3 className="mb-3 text-base font-bold leading-tight lg:text-lg">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>

    {/* Decorative glow */}
    <div
      className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-linear-to-br ${gradient} opacity-0 blur-3xl transition-all duration-300 group-hover:opacity-15`}
    />
  </div>
);

// Icon Components
const ClockIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const BookIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CrownIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l7 7 7-7M5 21h14M7 21V10l5 5 5-5v11" />
  </svg>
);

export default FeaturesSection;
