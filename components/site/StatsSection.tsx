"use client";

import { useEffect, useState, useRef } from "react";

// Animated counter hook
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return { count, ref };
};

const StatsSection = () => {
  return (
    <section className="relative py-4 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Globally Regulated Badge */}
        <div className="mb-6 flex items-center justify-center gap-3 lg:mb-16">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10 lg:h-14 lg:w-14">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-green-700 dark:text-green-400 lg:h-7 lg:w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight lg:text-3xl xl:text-4xl">
            Globally Regulated
          </span>
        </div>

        {/* Stats Grid - Always Horizontal */}
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-0 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900/50">
          <StatCard value={118} suffix="+" label="Active Traders" />
          <StatCard value={10} suffix="M+" label="Total Volume" hasBorders />
          <StatCard value={1} suffix="M+" label="Users" />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  value,
  suffix,
  label,
  hasBorders,
}: {
  value: number;
  suffix: string;
  label: string;
  hasBorders?: boolean;
}) => {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center px-3 py-6 text-center sm:px-6 sm:py-8 lg:px-8 lg:py-12 ${
        hasBorders ? "border-x border-gray-200 dark:border-white/10" : ""
      }`}
    >
      <div className="mb-1 text-2xl font-bold leading-none tracking-tight bg-gradient-to-r from-green-700 to-green-500 dark:from-green-500 dark:to-emerald-400 bg-clip-text text-transparent sm:text-3xl sm:mb-2 lg:text-5xl">
        {count}
        {suffix}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm lg:text-base">
        {label}
      </div>
    </div>
  );
};

export default StatsSection;
