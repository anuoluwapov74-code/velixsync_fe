"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Shield,
  DollarSign,
  TrendingUp,
  Settings,
  Loader2,
} from "lucide-react";
import { PROFILE_KEY } from "@/lib/swrKeys";

interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  country: string;
  region: string;
  city: string;
  phone: string;
  dob: string;
  address: string;
  postal_code: string;
  country_calling_code: string;
  currency: string;
  account_id: string;
  email_verified: boolean;
  has_submitted_kyc: boolean;
  is_verified: boolean;
  balance: string;
  profit: string;
  formatted_balance: string;
}

interface ProfileResponse {
  success: boolean;
  user: UserProfile;
}

export default function ProfilePage() {
  const router = useRouter();
  // Shared key with the portfolio page, TopNav, etc. — one request serves all of them.
  const { data, isLoading: loading } = useSWR<ProfileResponse>(PROFILE_KEY);
  const profile = data?.success ? data.user : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View your account information and trading statistics
            </p>
          </div>
          <button
            onClick={() => router.push("/settings")}
            className="flex items-center gap-2 px-6 py-3 font-semibold rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: "#16a34a", color: "#001a0f" }}
          >
            <Settings className="w-4 h-4" />
            Edit Settings
          </button>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">
                Account Balance
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{profile.formatted_balance}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Total Profit</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">
              ${parseFloat(profile.profit).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-br ${
              profile.is_verified
                ? "from-emerald-500 to-emerald-600"
                : "from-amber-500 to-amber-600"
            } rounded-2xl p-6 text-white`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">
                Account Status
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">
              {profile.is_verified ? "Verified" : "Pending"}
            </p>
          </motion.div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="tv-card rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-600/10 dark:bg-green-500/20 rounded-lg">
                  <User className="w-5 h-5 text-green-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Full Name
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {profile.first_name} {profile.last_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-600/10 dark:bg-green-500/20 rounded-lg">
                  <Mail className="w-5 h-5 text-green-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Email Address
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white break-all">
                    {profile.email}
                  </p>
                  {profile.email_verified && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 text-green-600 text-xs font-medium rounded">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {profile.phone && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-600/10 dark:bg-green-500/20 rounded-lg">
                    <Phone className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Phone Number
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {profile.country_calling_code} {profile.phone}
                    </p>
                  </div>
                </div>
              )}

              {profile.dob && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-600/10 dark:bg-green-500/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Date of Birth
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {new Date(profile.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Location & Account Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="tv-card rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Location & Account
            </h2>

            <div className="space-y-4">
              {(profile.country || profile.city) && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-600/10 dark:bg-green-500/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Location
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {[profile.city, profile.region, profile.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {profile.address && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-600/10 dark:bg-green-500/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Address
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {profile.address}
                      {profile.postal_code && `, ${profile.postal_code}`}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-600/10 dark:bg-green-500/20 rounded-lg">
                  <Hash className="w-5 h-5 text-green-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Account ID
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white font-mono">
                    {profile.account_id}
                  </p>
                </div>
              </div>

              {profile.currency && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-600/10 dark:bg-green-500/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Preferred Currency
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {profile.currency}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* KYC Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 tv-card rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Verification Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 tv-inner rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Verification
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    profile.email_verified
                      ? "bg-green-500/20 text-green-600"
                      : "bg-amber-500/20 text-amber-600"
                  }`}
                >
                  {profile.email_verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>

            <div className="p-4 tv-inner rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  KYC Submission
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    profile.has_submitted_kyc
                      ? "bg-green-500/20 text-green-600"
                      : "bg-amber-500/20 text-amber-600"
                  }`}
                >
                  {profile.has_submitted_kyc ? "Submitted" : "Not Submitted"}
                </span>
              </div>
            </div>

            <div className="p-4 tv-inner rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Verification
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    profile.is_verified
                      ? "bg-green-500/20 text-green-600"
                      : "bg-amber-500/20 text-amber-600"
                  }`}
                >
                  {profile.is_verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {!profile.has_submitted_kyc && (
            <div className="mt-4 p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-600 mb-3">
                Complete your KYC verification to unlock all features and increase your trading limits.
              </p>
              <button
                onClick={() => router.push("/kyc")}
                className="px-4 py-2 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: "#16a34a", color: "#001a0f" }}
              >
                Complete KYC
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
