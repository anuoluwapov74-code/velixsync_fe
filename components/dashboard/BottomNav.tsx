"use client";

import { Home, Target, TrendingUp, Repeat, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

// Mirrors the "Arctic White" mockup's bottom nav 1:1.
const items = [
  { name: "Dashboard", href: "/portfolio", icon: Home },
  { name: "Session", href: "/session", icon: Target },
  { name: "Markets", href: "/market", icon: TrendingUp },
  { name: "Copy Trading", href: "/explore-traders", icon: Repeat },
  { name: "Profile", href: "/profile", icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 backdrop-blur-2xl"
      style={{
        background: isDark ? "rgba(11,26,18,0.85)" : "rgba(255,255,255,0.65)",
        borderTop: isDark ? "1px solid rgba(22,163,74,0.14)" : "1px solid rgba(255,255,255,0.9)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="grid grid-cols-5 px-2 py-2.5">
        {items.map(({ name, href, icon: Icon }) => {
          const active = href !== null && pathname === href;
          const color = active
            ? (isDark ? "#16a34a" : "#16a34a")
            : (isDark ? "rgba(255,255,255,0.45)" : "#64748b");

          const content = (
            <div className="flex flex-col items-center gap-1 py-1">
              <Icon size={22} strokeWidth={2} color={color} />
              <span className="text-[10px] font-medium" style={{ color }}>
                {name}
              </span>
            </div>
          );

          return href ? (
            <Link key={name} href={href} className="flex flex-col items-center">
              {content}
            </Link>
          ) : (
            <div key={name} className="flex flex-col items-center opacity-70">
              {content}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
