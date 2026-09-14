"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  X,
  Loader2,
  Lock,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface EditModalData {
  type:
    | "name"
    | "phone"
    | "country"
    | "password"
    | "disable2fa"
    | "deleteAccount"
    | null;
}

interface UserSettings {
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string;
    region: string;
    city: string;
    account_id: string;
    is_verified: boolean;
    account_status: string;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [editModal, setEditModal] = useState<EditModalData>({ type: null });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 2FA state
  const [toggling2FA, setToggling2FA] = useState(false);

  // User settings data
  const { data: userSettings, error: settingsFetchError, isLoading: loading, mutate: mutateSettings } = useSWR<UserSettings>("/settings/");
  const { data: twoFAStatus, mutate: mutate2FAStatus } = useSWR<{ two_factor_enabled: boolean }>("/2fa-status/");
  const twoFactorEnabled = twoFAStatus?.two_factor_enabled ?? false;

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    disable2faPassword: "",
    deleteAccountPassword: "",
  });
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (settingsFetchError) setError("Failed to load settings. Please try again.");
  }, [settingsFetchError]);

  const handleEnable2FA = async () => {
    try {
      setToggling2FA(true);
      setError(null);
      setSuccessMessage(null);

      const response = await apiFetch("/enable-2fa/", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enable 2FA");
      }

      mutate2FAStatus({ two_factor_enabled: true }, { revalidate: false });
      setSuccessMessage(
        "Two-factor authentication enabled! You'll receive a code via email on your next login."
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error enabling 2FA:", err);
        setError(err.message);
      } else {
        setError("Failed to enable 2FA. Please try again.");
      }
    } finally {
      setToggling2FA(false);
    }
  };

  const openDisable2FAModal = () => {
    setFormData({ ...formData, disable2faPassword: "" });
    setEditModal({ type: "disable2fa" });
  };

  const handleDisable2FA = async () => {
    if (!formData.disable2faPassword) {
      setError("Password is required to disable 2FA");
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      setSuccessMessage(null);

      const response = await apiFetch("/disable-2fa/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.disable2faPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to disable 2FA");
      }

      mutate2FAStatus({ two_factor_enabled: false }, { revalidate: false });
      setSuccessMessage("Two-factor authentication disabled successfully");

      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error disabling 2FA:", err);
        setError(err.message);
      } else {
        setError("Failed to disable 2FA. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteAccountModal = () => {
    setFormData({ ...formData, deleteAccountPassword: "" });
    setEditModal({ type: "deleteAccount" });
  };

  const handleDeleteAccount = async () => {
    if (!formData.deleteAccountPassword) {
      setError("Password is required to delete your account");
      return;
    }

    try {
      setDeletingAccount(true);
      setError(null);
      setSuccessMessage(null);

      const response = await apiFetch("/settings/delete-account/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.deleteAccountPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      // Account is flagged deleted and cookies are cleared server-side —
      // nothing left to do here but send them to login.
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error deleting account:", err);
        setError(err.message);
      } else {
        setError("Failed to delete account. Please try again.");
      }
    } finally {
      setDeletingAccount(false);
    }
  };

  const openEditModal = (type: EditModalData["type"]) => {
    if (!userSettings) return;

    switch (type) {
      case "name":
        setFormData({
          ...formData,
          firstName: userSettings.profile.first_name,
          lastName: userSettings.profile.last_name,
        });
        break;
      case "phone":
        setFormData({ ...formData, phone: userSettings.profile.phone });
        break;
      case "country":
        setFormData({ ...formData, country: userSettings.profile.country });
        break;
      case "password":
        setFormData({
          ...formData,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        break;
    }
    setEditModal({ type });
  };

  const closeModal = () => {
    setEditModal({ type: null });
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      country: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      disable2faPassword: "",
      deleteAccountPassword: "",
    });
    setSuccessMessage(null);
    setError(null);
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setError(null);
      setSuccessMessage(null);

      let endpoint = "";
      let body = {};

      switch (editModal.type) {
        case "name":
          endpoint = "/settings/profile/";
          body = {
            first_name: formData.firstName,
            last_name: formData.lastName,
          };
          break;
        case "phone":
          endpoint = "/settings/profile/";
          body = { phone: formData.phone };
          break;
        case "country":
          endpoint = "/settings/profile/";
          body = { country: formData.country };
          break;
        case "password":
          endpoint = "/settings/password/";
          body = {
            old_password: formData.oldPassword,
            new_password: formData.newPassword,
            confirm_password: formData.confirmPassword,
          };
          break;
        default:
          return;
      }

      const method = editModal.type === "password" ? "POST" : "PATCH";

      const response = await apiFetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update");
      }

      setSuccessMessage(data.message || "Updated successfully");

      await mutateSettings();

      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error updating:", err);
        setError(err.message);
      } else {
        setError("Failed to update. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error && !userSettings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
        <button
          onClick={() => mutateSettings()}
          className="px-6 py-2 bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!userSettings) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 px-6 py-3 tv-card text-gray-900 dark:text-white font-semibold rounded-lg transition-colors hover:opacity-80"
          >
            <Eye className="w-4 h-4" />
            View Profile
          </button>
        </div>

        {/* Global Success/Error Messages */}
        <AnimatePresence>
          {successMessage && editModal.type === null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <p className="text-green-600 text-sm">
                {successMessage}
              </p>
            </motion.div>
          )}
          {error && editModal.type === null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile section */}
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-4">
            Account Information
          </h2>

          <div className="space-y-3">
              {/* Full Name */}
              <div className="tv-card p-5 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Full Name
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {userSettings.profile.first_name}{" "}
                      {userSettings.profile.last_name || ""}
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal("name")}
                    className="px-4 py-2 text-sm bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg transition-colors self-start sm:self-auto"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="tv-card p-5 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Email
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {userSettings.profile.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="tv-card p-5 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Phone
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {userSettings.profile.phone || "Not provided"}
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal("phone")}
                    className="px-4 py-2 text-sm bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg transition-colors self-start sm:self-auto"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Country */}
              <div className="tv-card p-5 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Country
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {userSettings.profile.country || "Not provided"}
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal("country")}
                    className="px-4 py-2 text-sm bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg transition-colors self-start sm:self-auto"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Account Status */}
              <div className="tv-card p-5 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Account Status
                    </div>
                    <div
                      className={`text-lg font-semibold ${
                        userSettings.profile.is_verified
                          ? "text-green-500"
                          : "text-amber-500"
                      }`}
                    >
                      {userSettings.profile.account_status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trading ID */}
              <div className="tv-card p-5 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Trading ID
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white font-mono truncate">
                      {userSettings.profile.account_id || "Not assigned"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Security section */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2">
              Security Settings
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage your account security and authentication methods.
            </p>

            <div className="space-y-3">
              {/* Login Email */}
              <div className="tv-card p-5 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Login Email
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {userSettings.profile.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="tv-card p-5 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Password
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      ••••••••
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal("password")}
                    className="px-4 py-2 text-sm bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="tv-card p-5 rounded-lg">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-600/10 dark:bg-green-500/20 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Two-Factor Authentication (2FA)
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Add an extra layer of security to your account.
                        You&apos;ll receive a verification code via email each
                        time you log in.
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          twoFactorEnabled
                            ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400"
                        }`}
                      >
                        {twoFactorEnabled ? "Enabled" : "Disabled"}
                      </div>
                      {twoFactorEnabled && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Lock className="w-3 h-3" />
                          <span>Protected</span>
                        </div>
                      )}
                    </div>

                    {!twoFactorEnabled ? (
                      <button
                        onClick={handleEnable2FA}
                        disabled={toggling2FA}
                        className="px-4 py-2 text-sm bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap self-start sm:self-auto"
                      >
                        {toggling2FA ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enabling...
                          </span>
                        ) : (
                          "Enable 2FA"
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={openDisable2FAModal}
                        className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
                      >
                        Disable 2FA
                      </button>
                    )}
                  </div>

                  {twoFactorEnabled && (
                    <div className="bg-green-600/5 dark:bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-xs text-green-600">
                        <strong>Tip:</strong> Keep your email secure as it will
                        be used to receive 2FA codes during login.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Delete Account — danger zone */}
              <div className="border-2 border-red-500/30 bg-red-500/5 dark:bg-red-500/10 p-5 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-500/10 dark:bg-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Delete Account
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      This deactivates your account and signs you out everywhere —
                      it does not erase your data. If you change your mind, contact
                      support to have it reactivated.
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-3 border-t border-red-500/20">
                  <button
                    onClick={openDeleteAccountModal}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Modals */}
      <AnimatePresence>
        {editModal.type && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-xl max-w-md w-full p-6 shadow-2xl bg-white dark:bg-[#0b1a12] border border-gray-200 dark:border-[rgba(22,163,74,0.14)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={closeModal}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Messages */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <p className="text-green-600 text-sm">
                      {successMessage}
                    </p>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Disable 2FA Modal */}
              {editModal.type === "disable2fa" && (
                <>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                    Disable Two-Factor Authentication
                  </h3>
                  <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-amber-600 dark:text-amber-400 text-sm">
                      Disabling 2FA will reduce your account security.
                      You&apos;ll only need your password to log in.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                      Enter your password to confirm:
                    </label>
                    <input
                      type="password"
                      value={formData.disable2faPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          disable2faPassword: e.target.value,
                        })
                      }
                      placeholder="Enter your password"
                      className="w-full px-3 py-2.5 text-sm bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                    />
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleDisable2FA}
                      disabled={updating}
                      className="flex-1 py-2.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Disabling...
                        </span>
                      ) : (
                        "Disable 2FA"
                      )}
                    </button>
                    <button
                      onClick={closeModal}
                      disabled={updating}
                      className="flex-1 py-2.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* Name Edit Modal */}
              {editModal.type === "name" && (
                <>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                    Edit Name
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                        First Name:
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 text-sm bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                        Last Name:
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 text-sm bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleUpdate}
                      disabled={updating}
                      className="flex-1 py-2.5 text-sm bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        "Update"
                      )}
                    </button>
                    <button
                      onClick={closeModal}
                      disabled={updating}
                      className="flex-1 py-2.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* Phone Edit Modal */}
              {editModal.type === "phone" && (
                <>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                    Edit Phone Number
                  </h3>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone:
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2.5 text-sm bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                    />
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleUpdate}
                      disabled={updating}
                      className="flex-1 py-2.5 text-sm bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        "Update"
                      )}
                    </button>
                    <button
                      onClick={closeModal}
                      disabled={updating}
                      className="flex-1 py-2.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* Country Edit Modal */}
              {editModal.type === "country" && (
                <>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                    Edit Country
                  </h3>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                      Country:
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full px-3 py-2.5 text-sm bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                    />
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleUpdate}
                      disabled={updating}
                      className="flex-1 py-2.5 text-sm bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        "Update"
                      )}
                    </button>
                    <button
                      onClick={closeModal}
                      disabled={updating}
                      className="flex-1 py-2.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* Password Edit Modal */}
              {editModal.type === "password" && (
                <>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                        Current Password:
                      </label>
                      <input
                        type="password"
                        value={formData.oldPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            oldPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 text-sm bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                        New Password:
                      </label>
                      <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 text-sm bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                        Confirm Password:
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 text-sm bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleUpdate}
                      disabled={updating}
                      className="flex-1 py-2.5 text-sm bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                    <button
                      onClick={closeModal}
                      disabled={updating}
                      className="flex-1 py-2.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* Delete Account Modal */}
              {editModal.type === "deleteAccount" && (
                <>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                    Delete Account
                  </h3>
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      You will be signed out immediately and won&apos;t be able to
                      log back in. Your data isn&apos;t erased — contact support if
                      you want the account reactivated.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                      Enter your password to confirm:
                    </label>
                    <input
                      type="password"
                      value={formData.deleteAccountPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deleteAccountPassword: e.target.value,
                        })
                      }
                      placeholder="Enter your password"
                      className="w-full px-3 py-2.5 text-sm bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                    />
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deletingAccount}
                      className="flex-1 py-2.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingAccount ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </span>
                      ) : (
                        "Delete My Account"
                      )}
                    </button>
                    <button
                      onClick={closeModal}
                      disabled={deletingAccount}
                      className="flex-1 py-2.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
