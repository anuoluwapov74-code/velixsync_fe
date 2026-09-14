"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { PulseLoader } from "react-spinners";
import PagePreloader from "@/components/PagePreloader";

const resetPasswordSchema = z
  .object({
    new_password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPasswordValue = watch("new_password");
  const confirmPasswordValue = watch("confirm_password");

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!uid || !token) {
        toast.error("Invalid reset link");
        setValidating(false);
        return;
      }

      try {
        const response = await apiFetch("/password-reset/validate/", {
          method: "POST",
          body: JSON.stringify({ uid, token }),
        });

        const result = await response.json();

        if (response.ok && result.valid) {
          setTokenValid(true);
          setUserEmail(result.user?.email || "");
        } else {
          toast.error(result.error || "Invalid or expired reset link");
          setTokenValid(false);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to validate reset link");
        setTokenValid(false);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [uid, token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!uid || !token) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch("/password-reset/confirm/", {
        method: "POST",
        body: JSON.stringify({
          uid,
          token,
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(result?.error)
          ? result.error.join(" ")
          : result?.error || "Failed to reset password";
        toast.error(errorMessage);
        return;
      }

      setResetSuccess(true);
      toast.success("Password reset successful!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (validating) {
    return (
      <PagePreloader>
        <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <PulseLoader color="#27ae60" size={15} />
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Validating reset link...
          </p>
        </div>
        </div>
      </PagePreloader>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <PagePreloader>
        <div className="min-h-screen flex items-center justify-center bg-transparent px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center space-y-6"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">❌</span>
          </div>

          <h1 className="text-2xl font-bold text-black dark:text-white">
            Invalid Reset Link
          </h1>

          <p className="text-gray-600 dark:text-gray-300">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>

          <div className="space-y-3">
            <Link href="/forgot-password">
              <Button className="w-full bg-green-800 hover:bg-green-700 mb-4">
                Request New Reset Link
              </Button>
            </Link>

            <Link href="/login">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </motion.div>
        </div>
      </PagePreloader>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <PagePreloader>
        <div className="min-h-screen flex items-center justify-center bg-transparent px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-700" />
          </div>

          <h1 className="text-2xl font-bold text-black dark:text-white">
            Password Reset Successful!
          </h1>

          <p className="text-gray-600 dark:text-gray-300">
            Your password has been reset successfully. You can now log in with
            your new password.
          </p>

          <div className="pt-4">
            <Link href="/login">
              <Button className="w-full bg-green-800 hover:bg-green-700">
                Continue to Login
              </Button>
            </Link>
          </div>
        </motion.div>
        </div>
      </PagePreloader>
    );
  }

  // Reset password form
  return (
    <PagePreloader>
      <div className="min-h-screen flex items-center justify-center bg-transparent px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0">
          <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            <span className="text-green-600 dark:text-green-400">Velix</span>Sync
          </span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Reset Your Password
          </h1>

          {userEmail && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Resetting password for: <strong>{userEmail}</strong>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password Input */}
          <div className="relative">
            <input
              id="new_password"
              type={showPassword ? "text" : "password"}
              {...register("new_password")}
              className={`peer w-full border rounded-md px-3 pt-5 pb-2 bg-white dark:bg-[#0d3320]/50 text-black dark:text-white focus:outline-none transition-all ${
                errors.new_password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600/50"
              }`}
              placeholder=" "
            />
            <label
              htmlFor="new_password"
              className={`absolute left-3 text-gray-500 dark:text-gray-400 transition-all pointer-events-none ${
                newPasswordValue
                  ? "text-xs top-1"
                  : "peer-focus:text-xs peer-focus:top-1 top-3"
              }`}
            >
              New Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-500 dark:text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.new_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.new_password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              id="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirm_password")}
              className={`peer w-full border rounded-md px-3 pt-5 pb-2 bg-white dark:bg-[#0d3320]/50 text-black dark:text-white focus:outline-none transition-all ${
                errors.confirm_password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600/50"
              }`}
              placeholder=" "
            />
            <label
              htmlFor="confirm_password"
              className={`absolute left-3 text-gray-500 dark:text-gray-400 transition-all pointer-events-none ${
                confirmPasswordValue
                  ? "text-xs top-1"
                  : "peer-focus:text-xs peer-focus:top-1 top-3"
              }`}
            >
              Confirm New Password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-4 text-gray-500 dark:text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="w-full py-6 bg-green-800 hover:bg-green-700 text-white rounded-md"
          >
            {!loading ? (
              <span>Reset Password</span>
            ) : (
              <PulseLoader color="#fff" size={15} />
            )}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link href="/login" className="text-green-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
      </div>
    </PagePreloader>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-transparent">
          <PulseLoader color="#27ae60" size={15} />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
