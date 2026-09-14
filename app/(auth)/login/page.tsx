"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import PagePreloader from "@/components/PagePreloader";

type FormValues = {
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  const onSubmit = async (data: FormValues) => {
    const newData = { email: data.email, password: data.password };

    try {
      setLoading(true);

      const response = await apiFetch("/login/", {
        method: "POST",
        body: JSON.stringify(newData),
      });

      const result = await response.json();

      if (!response.ok) {
        const backendError =
          result?.error || "Something went wrong. Please try again.";
        toast.error(backendError);
        return;
      }

      // Login - cookie is set by backend
      toast.success("Login successful");

      // Redirect based on KYC status
      if (result?.user?.has_submitted_kyc) {
        router.push("/portfolio");
      } else {
        router.push("/kyc");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PagePreloader>
      <div className="min-h-screen flex flex-col lg:flex-row gap-10 bg-transparent text-black dark:text-white transition-colors duration-300">
      {/* Left side: Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-6 bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm space-y-6 flex flex-col"
        >
          <Link
            href="/"
            className="flex text-2xl md:text-4xl mb-10 font-extrabold self-center tracking-tight items-center gap-1"
          >
            <span className="text-green-600 dark:text-green-400">Velix</span><span className="text-gray-900 dark:text-white">Sync</span>
          </Link>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold flex items-center gap-2">
              <Link href={"/"}>
                <ArrowLeft />
              </Link>
              Login
            </h1>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
          <div className="">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Welcome back, Amigo!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`peer w-full border rounded-md px-3 pt-5 pb-2 bg-white dark:bg-[#0d3320]/50 focus:outline-none transition-all ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600/50"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={`absolute left-3 text-gray-400 dark:text-gray-500 transition-all pointer-events-none ${
                  emailValue
                    ? "text-xs top-1"
                    : "peer-focus:text-xs peer-focus:top-1 top-3"
                }`}
              >
                Email
              </label>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`peer w-full border rounded-md px-3 pt-5 pb-2 bg-white dark:bg-[#0d3320]/50 focus:outline-none transition-all ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600/50"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="password"
                className={`absolute left-3 text-gray-400 dark:text-gray-500 transition-all pointer-events-none ${
                  passwordValue
                    ? "text-xs top-1"
                    : "peer-focus:text-xs peer-focus:top-1 top-3"
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400 dark:text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <div className="text-sm text-green-600 hover:underline cursor-pointer">
              <Link
                href="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full py-6 bg-green-800 hover:bg-green-700 text-white rounded-md"
            >
              {!loading ? (
                <span>Login</span>
              ) : (
                <PulseLoader color="#fff" size={15} />
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600/50" />
              <span className="text-sm text-gray-400 dark:text-gray-500">
                or sign in with
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600/50" />
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 dark:border-gray-600/50 rounded-md bg-white dark:bg-[#0d3320]/50 hover:bg-gray-50 dark:hover:bg-[#0d3320]/80 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Google
              </span>
            </button>

            <p className="text-center text-sm">
              New to this community?{" "}
              <a href="/register" className="text-green-600 underline">
                Sign up here
              </a>
            </p>
          </form>

          
          <div className="text-center mt-1 text-sm space-y-2.5">
            <p className="text-gray-400 dark:text-white">
              Copyright &copy; {new Date().getFullYear()} VelixSync
            </p>
            {/* <div className="flex items-center justify-center gap-4">
              <Link className="text-green-600 hover:underline" href={"/"}>
                Privacy Policy
              </Link>
              <Link className="text-green-600 hover:underline" href={"/"}>
                Terms of service
              </Link>
            </div> */}
            {/* Google Translate will be here */}
          </div>
        </motion.div>
      </div>

      {/* Right side: Visual section */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-[#071a0e] via-[#1e6e3c] to-[#071a0e] dark:from-[#071a0e] dark:via-[#0d3320] dark:to-[#071a0e] p-8 rounded-l-3xl">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md flex flex-col items-center text-center text-white space-y-6"
        >
          {/* <h2 className="text-2xl font-semibold">
            Trusted by millions of traders worldwide
          </h2> */}

          {/* Full image */}
          <div className="relative w-full aspect-square overflow-hidden">
            {/* <Image
              src="/images/trusted.webp"
              alt="Trustpilot and Awards Section"
              width={825}
              height={770}
              className="object-cover"
            /> */}
          </div>
        </motion.div>
      </div>
      </div>
    </PagePreloader>
  );
}
