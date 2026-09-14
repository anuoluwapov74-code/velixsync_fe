"use client";

import { useState } from "react";
import useSWR from "swr";
import { Loader2, ChevronRight, Lock, Shield, Award, Star, Crown, Gem, Zap, Trophy } from "lucide-react";
import DepositModal from "@/components/dashboard/modals/DepositModal";

/* ════════════════════════════════════════════════════════════════
 ROYALTY PROGRAM — ported from hagocapitals' dashboard sidebar card +
 info modal, merged into one flowing tab here since it's a full page
 section rather than a compact card. Tier auto-upgrades server-side
 whenever a deposit is approved; this tab is read-only, just reflects
 whatever the backend reports.

 Gated by the admin-controlled `visible` flag (backed by the user's
 `make_royalty_program_visible` field): while false, the content below
 is still rendered but blurred out from under a locked notice card,
 rather than hidden — so the shape of the feature stays visible, just
 inaccessible until the trader/admin unlocks it.
════════════════════════════════════════════════════════════════ */

interface Tier {
  key: string;
  name: string;
  min_deposit: number;
  referral_bonus: number;
  rank_bonus: number;
}

interface LoyaltyTiersResponse {
  tiers: Tier[];
  current_tier: string;
  next_tier: string;
  total_deposits: number;
  next_amount_to_upgrade: number;
  visible: boolean;
}

const TIER_ORDER = ["iron", "bronze", "silver", "gold", "platinum", "diamond", "elite"];

const TIER_STYLES: Record<string, { gradient: string; icon: React.ReactNode }> = {
  iron:     { gradient: "from-slate-400 to-slate-500",   icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> },
  bronze:   { gradient: "from-amber-600 to-amber-700",   icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" /> },
  silver:   { gradient: "from-gray-300 to-gray-400",     icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" /> },
  gold:     { gradient: "from-yellow-400 to-yellow-500", icon: <Crown className="w-4 h-4 sm:w-5 sm:h-5" /> },
  platinum: { gradient: "from-cyan-400 to-cyan-500",     icon: <Gem className="w-4 h-4 sm:w-5 sm:h-5" /> },
  diamond:  { gradient: "from-blue-400 to-indigo-400",   icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> },
  elite:    { gradient: "from-purple-400 to-pink-400",   icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5" /> },
};

export default function LoyaltyTab() {
  const [showDeposit, setShowDeposit] = useState(false);
  const { data, isLoading } = useSWR<LoyaltyTiersResponse>("/loyalty-tiers/");

  const currentIndex = data ? TIER_ORDER.indexOf(data.current_tier) : 0;
  const isMax = data?.current_tier === "elite";
  const pct = data && data.next_amount_to_upgrade > 0
    ? Math.min(100, (data.total_deposits / data.next_amount_to_upgrade) * 100)
    : 100;
  const locked = !!data && !data.visible;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Royalty Program</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Deposit more to increase your royalty rank and unlock bigger referral bonuses.
      </p>

      {isLoading || !data ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#16a34a]" />
        </div>
      ) : (
        <div className="relative">
          {/* Locked overlay — glassy blur + centered notice card, shown in
              place of interaction (not in place of the content) while the
              admin hasn't flagged this user as eligible yet. */}
          {locked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
              <div className="max-w-sm rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-xl shadow-xl p-5 sm:p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-[#16a34a]" />
                </div>
                <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-100">
                  Hello, the Royalty Programme becomes available once your capital meets
                  the required threshold. After approval, you&apos;ll be able to access the
                  Royalty Programme to gain greater control over your assets and unlock
                  the rewards and benefits assigned to your trading account. For details
                  on the specific requirements, please reach out directly to the trader
                  whose account you&apos;re copying.
                </p>
              </div>
            </div>
          )}

          <div className={locked ? "blur-sm select-none pointer-events-none" : undefined}>
            {/* Your progress */}
            <div className="tv-card rounded-2xl p-4 sm:p-5 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                  Your tier: {data.current_tier}
                </span>
                <span className="text-sm font-semibold text-[#16a34a]">
                  ${data.total_deposits.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  {!isMax && ` / $${data.next_amount_to_upgrade.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#16a34a] to-[#22c55e] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {isMax ? (
                  "You've reached the highest tier — thank you for being a top member!"
                ) : (
                  <>
                    Deposit{" "}
                    <span className="font-semibold text-[#16a34a]">
                      ${Math.max(0, data.next_amount_to_upgrade - data.total_deposits).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>{" "}
                    more to reach <span className="capitalize font-semibold text-gray-700 dark:text-gray-200">{data.next_tier}</span>.
                  </>
                )}
              </p>
            </div>

            {/* Tier list */}
            <div className="flex flex-col gap-2.5">
              {data.tiers.map((tier, i) => {
                const style = TIER_STYLES[tier.key] ?? TIER_STYLES.iron;
                const isCurrent = tier.key === data.current_tier;
                const isUnlocked = i <= currentIndex;
                return (
                  <div
                    key={tier.key}
                    className={`relative rounded-2xl border p-3.5 transition-opacity tv-card ${
                      isCurrent ? "border-[#16a34a]" : "border-gray-200 dark:border-white/10"
                    } ${!isUnlocked ? "opacity-60" : ""}`}
                  >
                    {isCurrent && (
                      <span className="absolute -top-2 right-3 px-2 py-0.5 bg-[#16a34a] text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                        Current
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br ${style.gradient} text-white`}>
                        {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{tier.name}</span>
                          {isUnlocked && !isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#16a34a]/10 text-[#16a34a] font-medium">
                              Unlocked
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[10.5px] text-gray-500 dark:text-gray-400">
                          <span>Min. Deposit: <span className="font-semibold text-gray-700 dark:text-gray-300">${tier.min_deposit.toLocaleString()}</span></span>
                          <span>Referral: <span className="font-semibold text-gray-700 dark:text-gray-300">{tier.referral_bonus}%</span></span>
                          <span>Rank Bonus: <span className="font-semibold text-gray-700 dark:text-gray-300">${tier.rank_bonus.toLocaleString()}</span></span>
                        </div>
                      </div>
                      {!isUnlocked && <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowDeposit(true)}
              className="w-full h-11 mt-5 rounded-full text-sm font-bold text-white bg-[#16a34a] hover:opacity-90 transition-opacity"
            >
              Make a Deposit
            </button>
          </div>
        </div>
      )}

      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
    </div>
  );
}
