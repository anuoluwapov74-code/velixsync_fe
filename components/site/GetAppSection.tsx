"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Apple, MoreVertical, Share, Smartphone, X } from "lucide-react";
import { canPromptNatively, triggerNativeInstall } from "@/lib/pwaInstall";

const SITE_URL = "velixsync.com";

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/15 text-[11px] font-bold text-[var(--primary)]">
        {n}
      </span>
      <span className="text-sm text-[var(--foreground-muted)]">{children}</span>
    </li>
  );
}

function InstallModal({ onClose }: { onClose: () => void }) {
  const handleDownloadNow = async () => {
    if (canPromptNatively()) {
      await triggerNativeInstall();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-[420px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[var(--surface)] border border-[var(--border)]"
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-[19px] font-bold leading-snug">
                Install the VelixSync App
              </h3>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/8 hover:opacity-80 transition-opacity"
              >
                <X className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
              </button>
            </div>
            <p className="text-sm text-[var(--foreground-muted)] mb-5">
              Add {SITE_URL} to your home screen and use it like a native app — no app store required.
            </p>

            <div className="space-y-3 mb-6">
              <div className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center gap-2 mb-3 font-semibold text-sm">
                  <Apple className="w-4 h-4" />
                  iOS (Safari)
                </div>
                <ul className="space-y-2.5">
                  <Step n={1}>
                    Open <span className="text-[var(--primary)]">{SITE_URL}</span> in Safari
                  </Step>
                  <Step n={2}>
                    Tap the Share <Share className="inline w-3.5 h-3.5 -mt-0.5" /> icon in the toolbar
                  </Step>
                  <Step n={3}>
                    Select <strong>Add to Home Screen</strong>, then tap Add
                  </Step>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center gap-2 mb-3 font-semibold text-sm">
                  <MoreVertical className="w-4 h-4" />
                  Android (Chrome)
                </div>
                <ul className="space-y-2.5">
                  <Step n={1}>
                    Open <span className="text-[var(--primary)]">{SITE_URL}</span> in Chrome
                  </Step>
                  <Step n={2}>
                    Tap the menu <MoreVertical className="inline w-3.5 h-3.5 -mt-0.5" /> in the top-right corner
                  </Step>
                  <Step n={3}>
                    Select <strong>Install app</strong> (or Add to Home screen), then confirm
                  </Step>
                </ul>
              </div>
            </div>

            <button
              onClick={handleDownloadNow}
              className="w-full h-12 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors text-white font-bold flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Download Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function GetAppSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="block sm:hidden">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider">Get App</p>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors px-5 py-2.5 text-sm font-bold text-white"
      >
        <Smartphone className="w-4 h-4" />
        Download App
      </button>

      {showModal && <InstallModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
