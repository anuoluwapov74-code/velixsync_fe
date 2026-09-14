"use client";

import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up in minutes and verify your identity to get started with our secure platform.",
    },
    {
      number: "02",
      title: "Set Your Investment Amount",
      description:
        "Choose how much you want to invest and set your risk management preferences.",
    },
    {
      number: "03",
      title: "Choose Strategy",
      description:
        "Browse through successful traders and select strategies that match your goals.",
    },
    {
      number: "04",
      title: "Track & Grow Your Profits",
      description:
        "Monitor your investments in real-time and watch your portfolio grow automatically.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-8 lg:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)] mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
            Getting started with copy trading is simple. Follow these four easy
            steps to begin your investment journey today.
          </p>
        </div>

        {/* Steps Grid with connecting line */}
        <div className="relative mt-6 lg:mt-10">
          {/* Connecting line - desktop only */}
          <div className="absolute top-12 left-0 right-0 hidden lg:block">
            <div className="mx-auto max-w-3xl h-px bg-linear-to-r from-transparent via-green-400 dark:via-green-500/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard = ({ number, title, description }: StepCardProps) => (
  <div className="group relative rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-600/[0.06] hover:border-[var(--primary)]/30">
    {/* Step number badge */}
    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-green-600 to-green-700 text-sm font-bold text-white shadow-lg shadow-green-600/25 transition-transform duration-300 group-hover:scale-110">
      {number}
    </div>
    <h3 className="text-base font-bold lg:text-lg mb-2">
      {title}
    </h3>
    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
      {description}
    </p>
  </div>
);

// Trader Card Component (kept for compatibility)
interface TraderCardProps {
  name: string;
  role: string;
  avatar: string;
  status: string;
}

const TraderCard = ({ name, role, avatar, status }: TraderCardProps) => (
  <div className="relative flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-all hover:border-[var(--primary)] dark:border-[rgba(39,174,96,0.2)]">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[var(--primary)] to-[var(--primary-hover)] text-sm font-bold text-white">
      {avatar}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-semibold truncate">{name}</div>
      <div className="text-xs text-[var(--foreground-muted)] truncate">{role}</div>
    </div>
    {status === "online" && (
      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--background)]">
        <div className="h-3 w-3 rounded-full bg-[var(--primary)]">
          <div className="h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-75"></div>
        </div>
      </div>
    )}
  </div>
);

export default HowItWorks;
