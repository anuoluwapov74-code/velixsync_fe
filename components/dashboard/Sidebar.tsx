"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Home,
  Users,
  Receipt,
  X,
  Wallet,
  History,
  BarChart3,
  Radio,
  Newspaper,
  Bell,
  Link2,
  LineChart,
  TrendingUp,
  Settings,
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const overviewSection = [
  { name: "Dashboard", href: "/portfolio", icon: Home },
];

const walletSection = [
  { name: "Connect Wallet", href: "/connect-wallet", icon: Wallet },
];

const tradingSection = [
  { name: "Markets", href: "/market", icon: BarChart3 },
  { name: "Session", href: "/session", icon: Radio },
  { name: "Signals", href: "/signals", icon: TrendingUp },
  { name: "Trade History", href: "/trade-history", icon: History },
  { name: "Calendar", href: "/calendar", icon: Calendar },
];

const investmentSection = [
  { name: "Traders", href: "/explore-traders", icon: Users },
  { name: "News", href: "/market?tab=news", icon: Newspaper },
  { name: "Referral", href: "/referral", icon: Link2 },
];

const accountSection = [
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function SidebarGrid({
  items,
  pathname,
  onClose,
}: {
  items: NavItem[];
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className={`
              flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl text-center
              transition-all duration-200
              ${
                isActive
                  ? "text-[#16a34a] bg-[rgba(22,163,74,0.08)] border border-[rgba(22,163,74,0.2)]"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] border border-transparent"
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-72 z-50 shadow-2xl overflow-y-auto"
        style={isDark ? { background: "#0b1a12" } : { background: "#ffffff" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-between p-5 border-b ${isDark ? "border-[rgba(22,163,74,0.12)]" : "border-gray-200"}`}>
            <Link href="/portfolio" className="flex items-center">
              <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                <span className="text-green-600">Velix</span>Sync
              </span>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-white" />
            </button>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
            {/* OVERVIEW Section */}
            <div>
              <h3 className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
                Overview
              </h3>
              <SidebarGrid
                items={overviewSection}
                pathname={pathname}
                onClose={onClose}
              />
            </div>

            {/* WALLET Section */}
            <div>
              <h3 className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
                Wallet
              </h3>
              <SidebarGrid
                items={walletSection}
                pathname={pathname}
                onClose={onClose}
              />
            </div>

            {/* TRADING Section */}
            <div>
              <h3 className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
                Trading
              </h3>
              <SidebarGrid
                items={tradingSection}
                pathname={pathname}
                onClose={onClose}
              />
            </div>

            {/* INVESTMENT Section */}
            <div>
              <h3 className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
                Investment
              </h3>
              <SidebarGrid
                items={investmentSection}
                pathname={pathname}
                onClose={onClose}
              />
            </div>

            {/* ACCOUNT Section */}
            <div>
              <h3 className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
                Account
              </h3>
              <SidebarGrid
                items={accountSection}
                pathname={pathname}
                onClose={onClose}
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className={`p-3 border-t ${isDark ? "border-[rgba(22,163,74,0.12)]" : "border-gray-200"}`}>
            <div className="px-3 py-2.5 rounded-lg tv-inner">
              <p className="text-[10px] font-medium text-gray-600 dark:text-gray-300 mb-0.5">
                Need help?
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-400">
                Contact our support team
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
