"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { PulseLoader } from "react-spinners";
import PagePreloader from "@/components/PagePreloader";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);

    try {
      const response = await apiFetch("/password-reset/request/", {
        method: "POST",
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.error || "Failed to send reset email");
        return;
      }

      setEmailSent(true);
      toast.success("Password reset link sent! Check your email.");
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <PagePreloader>
        <div className="min-h-screen flex items-center justify-center bg-transparent px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-10 h-10 text-green-700" />
          </div>

          <h1 className="text-2xl font-bold text-black dark:text-white">
            Check Your Email
          </h1>

          <p className="text-gray-600 dark:text-gray-300">
            We&apos;ve sent a password reset link to{" "}
            <strong>{emailValue}</strong>. Please check your inbox and spam
            folder.
          </p>

          <div className="pt-4">
            <Link href="/login">
              <Button className="w-full p-5 bg-green-800 hover:bg-green-700">
                Back to Login
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Didn&apos;t receive the email?{" "}
            <button
              onClick={() => setEmailSent(false)}
              className="text-green-600 hover:underline"
            >
              Try again
            </button>
          </p>
        </motion.div>
        </div>
      </PagePreloader>
    );
  }

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
        <Link
          href="/"
          className="flex text-2xl md:text-4xl font-extrabold justify-center"
        >
          <span className="text-green-600 dark:text-green-400">Velix</span><span className="text-gray-900 dark:text-white">Sync</span>
        </Link>

        <div className="space-y-2">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-green-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>

          <h1 className="text-3xl font-bold text-black dark:text-white">
            Forgot Password?
          </h1>

          <p className="text-gray-600 dark:text-gray-300">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`peer w-full border rounded-md px-3 pt-5 pb-2 bg-white dark:bg-[#0d3320]/50 text-black dark:text-white focus:outline-none transition-all ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600/50"
              }`}
              placeholder=" "
            />
            <label
              htmlFor="email"
              className={`absolute left-3 text-gray-500 dark:text-gray-400 transition-all pointer-events-none ${
                emailValue
                  ? "text-xs top-1"
                  : "peer-focus:text-xs peer-focus:top-1 top-3"
              }`}
            >
              Email Address
            </label>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="w-full py-6 bg-green-800 hover:bg-green-700 text-white rounded-md"
          >
            {!loading ? (
              <span>Send Reset Link</span>
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
