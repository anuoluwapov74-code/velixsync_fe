"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, DollarSign, Shield, AlertCircle } from "lucide-react";

export default function LiveTradingPage() {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
            Live Trading Session
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              Real-time market data and trading opportunities
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Market Data</span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mb-6 bg-green-600/10 dark:bg-green-500/20 border border-green-600/30 dark:border-green-600/40 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-600 mb-1">
                Live Trading
              </h3>
              <p className="text-sm text-green-600">
                Access real-time trading opportunities. Click the button below
                to view the requirements for starting a live trading session.
              </p>
            </div>
          </div>
        </div>

        {/* Start Live Trading Button */}
        <div className="mb-8 flex justify-center">
          <motion.button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300 flex items-center gap-3"
            style={{ background: "#16a34a", color: "#001a0f" }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <TrendingUp className="w-6 h-6" />
            Start Live Trading
          </motion.button>
        </div>
      </div>

      {/* Threshold Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <div
                className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0b1a12] border border-gray-200 dark:border-[rgba(22,163,74,0.14)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="relative p-6 border-b border-gray-200 dark:border-white/10">
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-600/10 dark:bg-green-500/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        Live Trading Requirements
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Important information before you begin
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Intro */}
                  <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-600/20 rounded-xl p-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Thank you for your interest in our Live Trading feature! To ensure a
                      safe and compliant trading environment, we have established minimum
                      account requirements that must be met before you can participate in
                      live trading sessions.
                    </p>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Minimum Account Requirements
                    </h3>

                    <div className="space-y-3">
                      {/* Requirement 1 */}
                      <div className="flex items-start gap-3 p-4 tv-inner rounded-lg border border-[rgba(255,255,255,0.06)]">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Minimum Threshold
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your account must maintain the minimum threshold to
                            participate in live trading. This threshold ensures you have
                            sufficient capital to manage risk effectively and participate in
                            meaningful trading opportunities.
                          </p>
                        </div>
                      </div>

                      {/* Requirement 2 */}
                      <div className="flex items-start gap-3 p-4 tv-inner rounded-lg border border-[rgba(255,255,255,0.06)]">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Verified Account Status
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Complete KYC (Know Your Customer) verification to comply with
                            regulatory requirements. This includes submitting valid
                            identification documents and proof of address.
                          </p>
                        </div>
                      </div>

                      {/* Requirement 3 */}
                      <div className="flex items-start gap-3 p-4 tv-inner rounded-lg border border-[rgba(255,255,255,0.06)]">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          3
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Risk Acknowledgment
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Understand and acknowledge that live trading involves significant
                            risk. You should only trade with funds you can afford to lose.
                            Past performance does not guarantee future results.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Why These Requirements */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Why These Requirements?
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <p>
                        <strong className="text-gray-900 dark:text-white">
                          Risk Management:
                        </strong>{" "}
                        A minimum balance ensures you have adequate capital to diversify
                        trades and manage potential losses without depleting your entire
                        account.
                      </p>
                      <p>
                        <strong className="text-gray-900 dark:text-white">
                          Regulatory Compliance:
                        </strong>{" "}
                        Account verification helps us meet legal obligations and protect all
                        users from fraud and financial crimes.
                      </p>
                      <p>
                        <strong className="text-gray-900 dark:text-white">
                          Market Access:
                        </strong>{" "}
                        Many trading instruments and markets have minimum capital
                        requirements that we must comply with to provide you access.
                      </p>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-4 border border-green-200 dark:border-green-600/20">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Ready to Get Started?
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      If you meet these requirements, please contact our support team to
                      activate your live trading access. Our team will verify your account
                      status and guide you through the final steps.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">

                      <button
                        onClick={() => setShowModal(false)}
                        className="px-6 py-3 bg-white dark:bg-[#071a0e] hover:bg-gray-50 dark:hover:bg-[#0d3320]/50 text-gray-900 dark:text-white font-semibold rounded-lg transition-all border border-gray-200 dark:border-white/10"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-white/10">
                    <p>
                      <strong>Disclaimer:</strong> Trading financial instruments involves
                      risk and may not be suitable for all investors. The value of
                      investments can go down as well as up, and you may receive back less
                      than your original investment. VelixSync does not provide investment
                      advice, and you should seek independent financial advice if you are
                      unsure about the risks involved.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
