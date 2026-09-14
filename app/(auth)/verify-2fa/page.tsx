"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { PulseLoader } from "react-spinners";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

function Verify2FAContent() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 4) {
      toast.error("Please enter the full 4-digit code");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please log in again.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/verify-2fa/", {
        method: "POST",
        body: JSON.stringify({ email, code: fullCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.error || "Verification failed. Please try again.");
        return;
      }

      toast.success("2FA verification successful!");
      setTimeout(() => {
        router.push("/portfolio");
      }, 1000);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Please log in again.");
      router.push("/login");
      return;
    }

    setResending(true);
    try {
      const response = await apiFetch("/resend-2fa/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.error || "Failed to resend code");
        return;
      }

      toast.success("2FA code resent! Please check your email.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <PagePreloader>
      <div className="min-h-screen flex items-center justify-center bg-transparent px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-6 text-center"
        >
          {/* Logo */}
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              <span className="text-green-600 dark:text-green-400">Velix</span>Sync
            </span>
          </Link>

          <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-10 h-10 text-green-700 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Two-Factor Authentication
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-sm">
            We&apos;ve sent a 4-digit verification code to{" "}
            <strong>{email || "your email"}</strong>. Enter it below to complete
            your login.
          </p>

          {/* Code Input */}
          <div className="flex justify-center gap-3 my-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg bg-white dark:bg-[#0d3320]/50 border-gray-300 dark:border-gray-600/50 text-gray-900 dark:text-white focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/30 transition-all"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-6 bg-green-800 hover:bg-green-700 text-white rounded-md"
          >
            {!loading ? (
              <span>Verify &amp; Sign In</span>
            ) : (
              <PulseLoader color="#fff" size={15} />
            )}
          </Button>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-green-600 hover:underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
          </p>

          <Link
            href="/login"
            className="inline-flex items-center text-sm text-green-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>
        </motion.div>
      </div>
    </PagePreloader>
  );
}

export default function Verify2FAPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <PulseLoader color="#27ae60" size={15} />
        </div>
      }
    >
      <Verify2FAContent />
    </Suspense>
  );
}
