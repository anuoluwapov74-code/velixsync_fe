"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeftRight, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: () => void;
}

const TEAL = "#00C9A7";

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

export default function AccountsModal({ isOpen, onClose, onDeposit }: AccountsModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleTransfer = () => {
    onClose();
    router.push("/transfer");
  };

  const handleDeposit = () => {
    onClose();
    onDeposit();
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
                className="w-full text-left rounded-xl p-4 bg-[rgba(0,201,167,0.06)] dark:bg-[rgba(0,201,167,0.04)] border border-[rgba(0,201,167,0.2)] dark:border-[rgba(0,201,167,0.14)] transition-opacity hover:opacity-90"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(0,201,167,0.12)" }}>
                    <ArrowLeftRight className="w-4.5 h-4.5" style={{ color: TEAL }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 dark:text-white">Transfer</p>
                    <p className="text-[11px] text-gray-500 dark:text-white/40">Move funds between accounts</p>
                  </div>
                </div>
              </button>

              {/* Deposit */}
              <button
                onClick={handleDeposit}
                className="w-full text-left rounded-xl p-4 bg-[rgba(0,201,167,0.06)] dark:bg-[rgba(0,201,167,0.04)] border border-[rgba(0,201,167,0.2)] dark:border-[rgba(0,201,167,0.14)] transition-opacity hover:opacity-90"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(0,201,167,0.12)" }}>
                    <Wallet className="w-4.5 h-4.5" style={{ color: TEAL }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 dark:text-white">Deposit</p>
                    <p className="text-[11px] text-gray-500 dark:text-white/40">Add funds to your account</p>
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
