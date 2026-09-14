"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

/**
 * A single reusable dark/light switch — a sliding pill toggle with a
 * circular knob, not the old icon-only button. Used everywhere the app
 * lets a user flip the theme (site navbar, dashboard top nav, auth pages).
 */
export default function ThemeToggle({
  className = "",
  knobClassName = "",
}: {
  className?: string;
  knobClassName?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      className={`relative inline-flex h-7 w-13 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50 ${
        isDark ? "bg-[#1e2d3d]" : "bg-gray-200"
      } ${className}`}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
          isDark ? "translate-x-[26px]" : "translate-x-1"
        } ${knobClassName}`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-[#1e2d3d]" strokeWidth={2.5} />
        ) : (
          <Sun className="h-3 w-3 text-amber-500" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
}
