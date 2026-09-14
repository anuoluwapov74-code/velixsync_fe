"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Select, {
  FormatOptionLabelMeta,
  GroupBase,
  PropsValue,
} from "react-select";
import countryList from "react-select-country-list";
import { Eye, EyeOff, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";
import Link from "next/link";
import { PulseLoader } from "react-spinners";
import { BACKEND_URL } from "@/lib/constants";
import { apiFetch } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import PagePreloader from "@/components/PagePreloader";

// ----------------------
// Types
// ----------------------
interface CountryOption {
  value: string;
  label: string;
  flag: string;
}

// ----------------------
// Validation Schema
// ----------------------
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Use 8 or more characters")
    .regex(/[A-Z]/, "One uppercase character required")
    .regex(/[a-z]/, "One lowercase character required")
    .regex(/[0-9]/, "One number required")
    .regex(/[^A-Za-z0-9]/, "One special character required"),
  country: z
    .object({
      value: z.string(),
      label: z.string(),
      flag: z.string(),
    })
    .refine((val) => Boolean(val?.value && val?.label), {
      message: "Country is required",
    }),
  referralCode: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

// ----------------------
// Main Component wrapped in Suspense
// ----------------------
function RegisterPageContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referrerName, setReferrerName] = useState<string>("");
  const { theme } = useTheme();

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const watchedValues = watch();

  // Country options with flags
  const countryOptions: CountryOption[] = useMemo(() => {
    return countryList()
      .getData()
      .map((country) => ({
        value: country.value,
        label: country.label,
        flag: country.value.toLowerCase(),
      }));
  }, []);

  // ✅ Handle referral code from URL and store in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const refParam = searchParams.get("ref");

    if (refParam) {
      const upperRef = refParam.trim().toUpperCase();
      setReferralCode(upperRef);
      setValue("referralCode", upperRef);

      // Store in localStorage for persistence
      localStorage.setItem("referral_code", upperRef);

      // Validate referral code
      validateReferralCode(upperRef);
    } else {
      // Check localStorage for existing referral code
      const storedRef = localStorage.getItem("referral_code");
      if (storedRef) {
        setReferralCode(storedRef);
        setValue("referralCode", storedRef);
        validateReferralCode(storedRef);
      }
    }
  }, [searchParams, setValue]);

  // Validate referral code
  const validateReferralCode = async (code: string) => {
    if (!code) {
      setReferralValid(null);
      return;
    }

    try {
      const response = await apiFetch(
        `/referral/validate/?code=${code}`,
      );
      const data = await response.json();

      if (data.success && data.valid) {
        setReferralValid(true);
        setReferrerName(data.referrer.name);
      } else {
        setReferralValid(false);
        setReferrerName("");
      }
    } catch (error) {
      console.error("Error validating referral code:", error);
      setReferralValid(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function fetchCountry() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        const countryName = data.country_name;
        const countryCallingCode = data.country_calling_code; // e.g., "+234"

        // Store calling code in localStorage for KYC page
        if (countryCallingCode) {
          localStorage.setItem("country_calling_code", countryCallingCode);
        }

        const found = countryOptions.find(
          (c) => c.label.toLowerCase() === countryName?.toLowerCase(),
        );
        if (found) {
          setValue("country", found);
        }
      } catch (err) {
        console.warn("Could not auto-detect country:", err);
      }
    }
    fetchCountry();
  }, [countryOptions, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setMessage(null);

    try {
      const countryCallingCode =
        localStorage.getItem("country_calling_code") || "";

      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        country: data.country.label,
        referral_code: referralCode || undefined,
        country_calling_code: countryCallingCode,
      };

      const res = await apiFetch("/register/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        let errorMessage = "Registration failed. Please try again.";

        if (result?.error) {
          if (Array.isArray(result.error)) {
            errorMessage = result.error.join(" ");
          } else if (typeof result.error === "string") {
            errorMessage = result.error;
          }
        }

        throw new Error(errorMessage);
      }

      // Registration successful - cookie is set by backend
      setMessage("Registration successful! Redirecting...");

      if (typeof window !== "undefined") {
        if (result.user?.country_calling_code) {
          localStorage.setItem(
            "country_calling_code",
            result.user.country_calling_code,
          );
        }
        localStorage.removeItem("referral_code");
      }

      // Redirect directly to onboarding
      setTimeout(() => router.push("/onboarding"), 1500);
    } catch (error: unknown) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMessage(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => setMounted(true), []);

  const formatOptionLabel = (
    option: CountryOption,
    meta?: FormatOptionLabelMeta<CountryOption>,
  ) => {
    return (
      <div className="flex items-center gap-2">
        <span className={`fi fi-${option.flag}`}></span>
        <span>{option.label}</span>
      </div>
    );
  };

  return (
    <PagePreloader>
      <div className="min-h-screen flex flex-col lg:flex-row gap-10 bg-transparent text-black dark:text-white transition-colors duration-300">
      {/* Left side: Register Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-8 md:py-16 bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm space-y-6 flex flex-col"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex text-2xl md:text-4xl mb-10 font-extrabold self-center tracking-tight items-center gap-1"
          >
            <span className="text-green-600 dark:text-green-400">Velix</span><span className="text-gray-900 dark:text-white">Sync</span>
          </Link>

          {/* Theme toggle */}
          <ThemeToggle className="ml-auto fixed top-5 right-1" />

          {/* Referral Banner */}
          {referralCode && referralValid && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-full">
                  <Gift className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-900 dark:text-green-700">
                    🎉 Referred by {referrerName}!
                  </p>
                  <p className="text-xs text-green-800 dark:text-green-600">
                    You&apos;ll get special bonuses when you join
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {referralCode && referralValid === false && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-4"
            >
              <p className="text-sm text-red-700 dark:text-red-600">
                ❌ Invalid referral code
              </p>
            </motion.div>
          )}

          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 w-full">
              Join the Smart Community
            </h1>
            <p className="text-left text-sm mt-4">
              Already a member?{" "}
              <Link
                href="/login"
                className=" text-green-600 underline"
              >
                Sign In here
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First & Last Name */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName")}
                  className={`peer w-full border rounded-md px-3 pt-5 pb-2 bg-white dark:bg-[#0d3320]/50 focus:outline-none transition-all ${
                    errors.firstName
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600/50"
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="firstName"
                  className={`absolute left-3 text-gray-400 dark:text-gray-500 transition-all pointer-events-none ${
                    watchedValues.firstName
                      ? "text-xs top-1"
                      : "peer-focus:text-xs peer-focus:top-1 top-3"
                  }`}
                >
                  First Name
                </label>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message as string}
                  </p>
                )}
              </div>

              <div className="relative flex-1">
                <input
                  id="lastName"
                  type="text"
                  {...register("lastName")}
                  className={`peer w-full border rounded-md px-3 pt-5 pb-2 bg-white dark:bg-[#0d3320]/50 focus:outline-none transition-all ${
                    errors.lastName
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600/50"
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="lastName"
                  className={`absolute left-3 text-gray-400 dark:text-gray-500 transition-all pointer-events-none ${
                    watchedValues.lastName
                      ? "text-xs top-1"
                      : "peer-focus:text-xs peer-focus:top-1 top-3"
                  }`}
                >
                  Last Name
                </label>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
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
                  watchedValues.email
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

            {/* Country Dropdown */}
            <div className="relative">
              {mounted && (
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => {
                    const value = field.value as CountryOption | undefined;

                    return (
                      <Select<CountryOption, false, GroupBase<CountryOption>>
                        instanceId="country-select"
                        value={value ?? null}
                        options={countryOptions}
                        placeholder="Select Country"
                        formatOptionLabel={formatOptionLabel}
                        onChange={(selected: PropsValue<CountryOption>) => {
                          const sel = Array.isArray(selected)
                            ? (selected[0] as CountryOption)
                            : (selected as CountryOption);
                          field.onChange(sel);
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "transparent",
                            borderColor: errors.country ? "red" : "#9ca3af",
                            borderRadius: "0.375rem",
                            boxShadow: "none",
                            paddingTop: 8,
                            paddingBottom: 8,
                            color: theme === "dark" ? "#fff" : "#000",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: theme === "dark" ? "#fff" : "#000",
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 50,
                            backgroundColor:
                              theme === "dark" ? "#1e2d3d" : "#fff",
                            color: theme === "dark" ? "#fff" : "#000",
                          }),
                          option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isSelected
                              ? theme === "dark"
                                ? "#2a5298"
                                : "#dbeafe"
                              : isFocused
                                ? theme === "dark"
                                  ? "#1e3a5f"
                                  : "#f3f4f6"
                                : "transparent",
                            color:
                              isSelected || isFocused
                                ? theme === "dark"
                                  ? "#fff"
                                  : "#000"
                                : theme === "dark"
                                  ? "#d1d5db"
                                  : "#000",
                            cursor: "pointer",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: theme === "dark" ? "#9ca3af" : "#6b7280",
                          }),
                          input: (base) => ({
                            ...base,
                            color: theme === "dark" ? "#fff" : "#000",
                          }),
                        }}
                      />
                    );
                  }}
                />
              )}
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message as string}
                </p>
              )}
            </div>

            {/* Password */}
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
                  watchedValues.password
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

              {/* Password Requirements */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                {[
                  {
                    label: "Use 8 or more characters",
                    test: (v: string) => v.length >= 8,
                  },
                  {
                    label: "One Uppercase character",
                    test: (v: string) => /[A-Z]/.test(v),
                  },
                  {
                    label: "One special character (e.g: #[])",
                    test: (v: string) => /[^A-Za-z0-9]/.test(v),
                  },
                  {
                    label: "One Lowercase character",
                    test: (v: string) => /[a-z]/.test(v),
                  },
                  { label: "One Number", test: (v: string) => /[0-9]/.test(v) },
                ].map((rule) => {
                  const pass = watchedValues.password
                    ? rule.test(watchedValues.password)
                    : false;
                  return (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${pass ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      />
                      <span
                        className={`text-xs ${pass ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}
                      >
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hidden referral code field */}
            <input type="hidden" {...register("referralCode")} />

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 hover:bg-green-700 text-white py-6 rounded-md"
            >
              {!loading ? (
                <span>Create Account</span>
              ) : (
                <PulseLoader color="#fff" size={15} />
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600/50" />
              <span className="text-sm text-gray-400 dark:text-gray-500">
                or sign up with
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

            {/* <div className="text-left text-sm">
              <div className="">
                <Checkbox id="terms" className="inline-block mr-2" />
                By signing up you agree to{" "}
                <Link
                  href="/privacy-policy"
                  className="text-green-600 hover:underline"
                >
                  Terms and Condition
                </Link>{" "}
                &{" "}
                <Link
                  href="/privacy-policy"
                  className="text-green-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </div>
            </div> */}

            {message && (
              <p
                className={`text-center text-sm ${
                  message.startsWith("Registration")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </motion.div>
      </div>

      {/* Right side visual */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-[#071a0e] via-[#1e6e3c] to-[#071a0e] dark:from-[#071a0e] dark:via-[#0d3320] dark:to-[#071a0e] p-8 rounded-l-3xl">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md flex flex-col items-center text-center text-white space-y-6"
        >
          {/* <h2 className="text-2xl font-semibold">
            Join millions of traders worldwide
          </h2> */}
          <div className="relative w-full aspect-square overflow-hidden">
            {/* <Image
              src="/images/trusted.webp"
              alt="Trading Community"
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

// ----------------------
// Export with Suspense Wrapper
// ----------------------
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
