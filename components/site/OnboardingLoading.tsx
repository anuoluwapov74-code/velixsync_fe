"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const OnboardingLoading = () => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const phases = [
    {
      label: "Initializing secure connection",
      icon: Shield,
    },
    {
      label: "Configuring trading environment",
      icon: BarChart3,
    },
    {
      label: "Loading market instruments",
      icon: Globe,
    },
    {
      label: "Finalizing account setup",
      icon: Zap,
    },
  ];

  // Smooth progress bar that moves through phases
  useEffect(() => {
    if (isComplete) return;

    const totalDuration = 12000; // 12 seconds total
    const interval = 50;
    const increment = 100 / (totalDuration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isComplete]);

  // Update phase based on progress
  useEffect(() => {
    const phaseIndex = Math.min(
      Math.floor(progress / (100 / phases.length)),
      phases.length - 1,
    );
    setCurrentPhase(phaseIndex);
  }, [progress, phases.length]);

  const handleComplete = () => {
    router.push("/kyc");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a1628] flex items-center justify-center p-6 transition-colors duration-500 overflow-hidden relative">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-600/10 dark:bg-green-600/5 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[128px]" />

      <div className="relative z-10 max-w-lg w-full">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Brand */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  <span className="text-green-600">VELIX</span>SYNC
                </h1>
              </motion.div>

              {/* Animated icon */}
              <motion.div
                className="mb-10 flex justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.3 }}
              >
                <div className="relative">
                  {/* Rotating ring */}
                  <motion.div
                    className="absolute inset-0 border-2 border-green-500/20 rounded-full"
                    style={{ width: 100, height: 100, margin: "-10px" }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-600 rounded-full" />
                  </motion.div>

                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/25">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Progress percentage */}
              <motion.div
                className="mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {Math.round(progress)}%
                </span>
              </motion.div>

              {/* Current phase text */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-500 dark:text-gray-400 mb-8"
                >
                  {phases[currentPhase].label}
                </motion.p>
              </AnimatePresence>

              {/* Progress bar */}
              <div className="max-w-xs mx-auto mb-10">
                <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>

              {/* Phase indicators */}
              <motion.div
                className="flex justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {phases.map((phase, index) => {
                  const Icon = phase.icon;
                  const isActive = index === currentPhase;
                  const isDone = index < currentPhase;

                  return (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center gap-2"
                      animate={{
                        opacity: isDone ? 0.4 : isActive ? 1 : 0.25,
                      }}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isDone
                            ? "bg-green-600/10 dark:bg-green-500/10"
                            : isActive
                              ? "bg-green-600/15 dark:bg-green-600/15 ring-2 ring-green-600/30"
                              : "bg-gray-100 dark:bg-gray-800/50"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Icon
                            className={`w-5 h-5 ${
                              isActive
                                ? "text-green-600"
                                : "text-gray-400 dark:text-gray-600"
                            }`}
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              {/* Success icon */}
              <motion.div
                className="mb-8 flex justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  bounce: 0.5,
                  delay: 0.2,
                }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-green-600/20 rounded-full blur-2xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ width: 128, height: 128, margin: "-16px" }}
                  />
                  <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-xl shadow-green-600/30">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Success text */}
              <motion.h2
                className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Account configured
              </motion.h2>

              <motion.p
                className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Your trading environment is ready. Complete identity
                verification to unlock full platform access.
              </motion.p>

              {/* CTA */}
              <motion.button
                onClick={handleComplete}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-green-600/25 hover:shadow-green-600/40"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue to Verification
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.p
                className="mt-6 text-xs text-gray-400 dark:text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                This usually takes 2-3 minutes
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingLoading;
