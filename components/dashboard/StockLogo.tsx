"use client";

import { useState } from "react";

const FALLBACK_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6",
  "#f59e0b", "#10b981", "#3b82f6", "#f43f5e",
];

interface StockLogoProps {
  logoUrl?: string | null;
  /** Company website domain (e.g. "apple.com") — used as a Clearbit-logo fallback when logoUrl is missing. */
  domain?: string | null;
  name: string;
  size?: number;
  rounded?: string;
}

export default function StockLogo({ logoUrl, domain, name, size = 44, rounded = "rounded-lg" }: StockLogoProps) {
  const [failed, setFailed] = useState(false);
  const color = FALLBACK_COLORS[(name.charCodeAt(0) || 0) % FALLBACK_COLORS.length];
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const fontSize = Math.round(size * 0.36);
  const src = logoUrl || (domain ? `https://logo.clearbit.com/${domain}` : "");

  if (!src || failed) {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: color, fontSize }}
        className={`flex items-center justify-center font-bold text-white shrink-0 ${rounded}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size, overflow: "hidden" }}
      className={`flex items-center justify-center bg-white shrink-0 ${rounded}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ objectFit: "contain", width: size, height: size, padding: 4 }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
