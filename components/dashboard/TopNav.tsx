"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Bell, ChevronDown, LayoutDashboard, Users } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NotificationDropdown from "./portfolio/NotificationDropdown";
import UserProfileMenu from "./portfolio/UserProfileMenu";
import ThemeToggle from "@/components/ui/theme-toggle";
import { NOTIF_KEY } from "@/lib/swrKeys";

interface NotificationsRecentResponse {
  success: boolean;
  unread_count: number;
}

const primaryLinks = [
  { name: "Dashboard",  href: "/portfolio",       icon: <LayoutDashboard size={15} strokeWidth={1.8} /> },
  { name: "Traders",    href: "/explore-traders",  icon: <Users size={15} strokeWidth={1.8} /> },
  { name: "Markets",    href: "/market",           icon: <CandlestickIcon /> },
  { name: "Session",    href: "/session",          icon: <ChartLineIcon /> },
  { name: "News",       href: "/market?tab=news",  icon: <NewsIcon /> },
];

const moreLinks = [
  { name: "Signals",       href: "/signals",       icon: <LightningIcon /> },
  { name: "Transactions",  href: "/transactions",  icon: <ReceiptIcon /> },
  { name: "Trade History", href: "/trade-history", icon: <HistoryIcon /> },
  { name: "Settings",      href: "/settings",      icon: <GearIcon /> },
];

interface AuthUser {
  email: string;
  first_name: string;
  last_name: string;
  account_id: string;
}

interface TopNavProps {
  onMenuClick: () => void;
  user: AuthUser | null;
}

export default function TopNav({ onMenuClick, user }: TopNavProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const pathname = usePathname();
  const moreRef = useRef<HTMLDivElement>(null);

  // Shared cache key with NotificationDropdown — when it marks notifications
  // read, this badge updates too without a separate fetch or callback prop.
  const { data: notifData } = useSWR<NotificationsRecentResponse>(NOTIF_KEY, { refreshInterval: 30000 });
  const notificationCount = notifData?.success ? notifData.unread_count : 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMoreActive = moreLinks.some((link) => pathname === link.href);

  return (
    <header
      className="h-14 backdrop-blur-xl border-b sticky top-0 z-30"
      style={isDark
        ? { background: "rgba(11,26,18,0.97)", borderColor: "rgba(0,201,167,0.1)" }
        : { background: "rgba(255,255,255,0.97)", borderColor: "rgba(0,0,0,0.08)" }
      }
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side - Logo + Nav */}
        <div className="flex items-center space-x-1 lg:space-x-6">
          {/* Hamburger - mobile only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <HamburgerIcon />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              <span className="text-green-600 dark:text-green-400">Velix</span>Sync
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-0.5">
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10"
                      : "text-gray-600 dark:text-[#8fa896] hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <span className={isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-[#4a6655]"}>
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setShowMore(!showMore)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isMoreActive || showMore
                    ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10"
                    : "text-gray-600 dark:text-[#8fa896] hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <span className={isMoreActive || showMore ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-[#4a6655]"}>
                  <MoreIcon />
                </span>
                <span>More</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${showMore ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-48 rounded-xl shadow-xl overflow-hidden py-1"
                    style={isDark
                      ? { background: "#0b1a12", border: "1px solid rgba(0,201,167,0.14)" }
                      : { background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }
                    }
                  >
                    {moreLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setShowMore(false)}
                          className={`flex items-center space-x-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                            isActive
                              ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10"
                              : "text-gray-600 dark:text-[#8fa896] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          <span className={isActive ? "text-green-700 dark:text-green-400" : "text-gray-500 dark:text-[#4a6655]"}>
                            {link.icon}
                          </span>
                          <span>{link.name}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-1.5">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
                setShowMore(false);
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <Bell className="w-4 h-4 text-gray-600 dark:text-[#8fa896]" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowMore(false);
              }}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-semibold text-[10px]">
                {user
                  ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
                  : ""}
              </div>
              <span className="hidden sm:block text-xs font-medium text-gray-700 dark:text-[#8fa896]">
                Hey, {user?.first_name || "User"}!
              </span>
              <ChevronDown className="hidden sm:block w-3 h-3 text-gray-500 dark:text-[#4a6655]" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <UserProfileMenu
                  onClose={() => setShowUserMenu(false)}
                  user={user}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Nav icons — matching VeltrixSync style (15×15, stroke 1.8) ── */

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function CandlestickIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6"  y1="3"  x2="6"  y2="6"  />
      <rect x="4"  y="6"  width="4" height="7" rx="0.5" />
      <line x1="6"  y1="13" x2="6"  y2="16" />
      <line x1="16" y1="5"  x2="16" y2="8"  />
      <rect x="14" y="8"  width="4" height="9" rx="0.5" />
      <line x1="16" y1="17" x2="16" y2="21" />
    </svg>
  );
}

function ChartLineIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,17 9,11 13,14 21,6" />
      <polyline points="17,6 21,6 21,10" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2V9" />
      <line x1="10" y1="7"  x2="18" y2="7"  />
      <line x1="10" y1="11" x2="18" y2="11" />
      <line x1="10" y1="15" x2="14" y2="15" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3"  y="12" width="4" height="9" />
      <rect x="10" y="7"  width="4" height="14" />
      <rect x="17" y="3"  width="4" height="18" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="5"  cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
