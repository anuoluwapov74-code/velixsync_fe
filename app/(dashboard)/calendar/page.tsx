"use client";

import { useState } from "react";
import { CalendarDays, ListOrdered, LineChart } from "lucide-react";
import CalendarTab from "./_components/CalendarTab";
import TradeLogTab from "./_components/TradeLogTab";
import StatsTab from "./_components/StatsTab";

type Tab = "calendar" | "log" | "stats";

const TABS: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "log", label: "Trade Log", icon: ListOrdered },
  { id: "stats", label: "Stats", icon: LineChart },
];

export default function CalendarPage() {
  const [tab, setTab] = useState<Tab>("calendar");

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-gray-200 dark:border-white/10 mb-4 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  active
                    ? "border-[#16a34a] text-[#16a34a]"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>

        {tab === "calendar" && <CalendarTab />}
        {tab === "log" && <TradeLogTab />}
        {tab === "stats" && <StatsTab />}
      </div>
    </div>
  );
}
