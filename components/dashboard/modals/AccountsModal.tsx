"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeftRight, Copy, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface AccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FollowingTrader {
  trader_id: number;
}

interface FollowingResponse {
  success: boolean;
  traders: FollowingTrader[];
}

const TEAL = "#16a34a";

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gray-100 dark:bg-white/8 hover:opacity-80 transition-opacity"
    >
      <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
    </button>
  );
}

export default function AccountsModal({ isOpen, onClose }: AccountsModalProps) {
  const router = useRouter();
  const [mirroringLoading, setMirroringLoading] = useState(false);

  if (!isOpen) return null;

  const handleTransfer = () => {
    onClose();
    router.push("/transfer");
  };

  const handleMirroring = async () => {
    if (mirroringLoading) return;
    setMirroringLoading(true);
    try {
      const res = await apiFetch("/copy-trader/following/");
      const data: FollowingResponse = await res.json();
      const traderId = data?.success ? data.traders[0]?.trader_id : undefined;

      if (!traderId) {
        toast.error("Not Copying Any Trader", {
          description: "You aren't currently copying a trader's portfolio.",
        });
        return;
      }

      onClose();
      router.push(`/explore-traders/${traderId}?tab=portfolio`);
    } catch {
      toast.error("Something went wrong", {
        description: "Couldn't check your copied trader. Please try again.",
      });
    } finally {
      setMirroringLoading(false);
    }
  };

  const handleReferral = () => {
    onClose();
    router.push("/referral");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-[360px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0b1a12]"
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Accounts</h3>
              <CloseBtn onClick={onClose} />
            </div>

            <div className="h-px mb-4 bg-gray-200 dark:bg-white/7" />

            <div className="space-y-3">
              {/* Transfer */}
              <button
                onClick={handleTransfer}
                className="w-full text-left rounded-xl p-4 bg-[rgba(22,163,74,0.06)] dark:bg-[rgba(22,163,74,0.04)] border border-[rgba(22,163,74,0.2)] dark:border-[rgba(22,163,74,0.14)] transition-opacity hover:opacity-90"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(22,163,74,0.12)" }}>
                    <ArrowLeftRight className="w-4.5 h-4.5" style={{ color: TEAL }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 dark:text-white">Transfer</p>
                    <p className="text-[11px] text-gray-500 dark:text-white/40">Move funds between accounts</p>
                  </div>
                </div>
              </button>

              {/* Stock Portfolio Mirroring */}
              <button
                onClick={handleMirroring}
                disabled={mirroringLoading}
                className={`w-full text-left rounded-xl p-4 bg-[rgba(22,163,74,0.06)] dark:bg-[rgba(22,163,74,0.04)] border border-[rgba(22,163,74,0.2)] dark:border-[rgba(22,163,74,0.14)] transition-opacity hover:opacity-90 ${mirroringLoading ? "opacity-60 cursor-wait" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(22,163,74,0.12)" }}>
                    <Copy className="w-4.5 h-4.5" style={{ color: TEAL }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 dark:text-white">Stock Portfolio Mirroring</p>
                    <p className="text-[11px] text-gray-500 dark:text-white/40">Mirror an expert&apos;s stock portfolio</p>
                  </div>
                </div>
              </button>

              {/* Referral */}
              <button
                onClick={handleReferral}
                className="w-full text-left rounded-xl p-4 bg-[rgba(22,163,74,0.06)] dark:bg-[rgba(22,163,74,0.04)] border border-[rgba(22,163,74,0.2)] dark:border-[rgba(22,163,74,0.14)] transition-opacity hover:opacity-90"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(22,163,74,0.12)" }}>
                    <Gift className="w-4.5 h-4.5" style={{ color: TEAL }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 dark:text-white">Referral</p>
                    <p className="text-[11px] text-gray-500 dark:text-white/40">Invite friends and earn rewards</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
