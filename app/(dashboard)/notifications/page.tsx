"use client";

import { useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NOTIF_KEY } from "@/lib/swrKeys";

interface Notification {
  id: number;
  type: "trade" | "deposit" | "withdrawal" | "alert" | "system" | "news";
  title: string;
  message: string;
  full_details: string;
  created_at: string;
  read: boolean;
  metadata?: {
    amount?: string;
    stock?: string;
    status?: string;
  };
}

interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
}

export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "trade", label: "Trades" },
    { value: "deposit", label: "Deposits" },
    { value: "withdrawal", label: "Withdrawals" },
    { value: "alert", label: "Alerts" },
    { value: "system", label: "System" },
    { value: "news", label: "News" },
  ];

  // "all"/"unread" filter the full list client-side; specific types are
  // filtered server-side via ?type=. Either way the key changes with the
  // filter, so SWR fetches/caches each variant independently.
  const swrKey =
    filter !== "all" && filter !== "unread" ? `/notifications/?type=${filter}` : "/notifications/";
  const { data, error, isLoading, mutate } = useSWR<NotificationsResponse>(swrKey);
  const notifications = data?.success ? data.notifications : [];

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "trade":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        );
      case "deposit":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
        );
      case "withdrawal":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        );
      case "alert":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        );
      case "system":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      case "news":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "trade":
        return "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500";
      case "deposit":
        return "bg-green-600/10 dark:bg-green-500/20 text-green-600";
      case "withdrawal":
        return "bg-green-500/10 dark:bg-green-500/20 text-green-500";
      case "alert":
        return "bg-purple-500/10 dark:bg-purple-500/20 text-purple-500";
      case "system":
        return "bg-gray-500/10 dark:bg-gray-500/20 text-gray-500";
      case "news":
        return "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-500";
      default:
        return "bg-gray-500/10 dark:bg-gray-500/20 text-gray-500";
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await apiFetch(`/notifications/${id}/mark-read/`, {
        method: "PATCH",
      });

      if (response.ok) {
        mutate(
          (current) =>
            current?.success
              ? { ...current, notifications: current.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }
              : current,
          { revalidate: false }
        );
        // Keep the nav badge / dropdown (different SWR key) in sync too.
        globalMutate(NOTIF_KEY);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingAllRead(true);

      const response = await apiFetch("/notifications/mark-all-read/", {
        method: "POST",
      });

      if (response.ok) {
        mutate(
          (current) =>
            current?.success
              ? { ...current, notifications: current.notifications.map((n) => ({ ...n, read: true })) }
              : current,
          { revalidate: false }
        );
        globalMutate(NOTIF_KEY);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                Notifications
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Stay updated with your account activities and market alerts
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={markingAllRead}
                className="px-4 py-2 bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {markingAllRead ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Marking...</span>
                  </>
                ) : (
                  <>Mark all as read ({unreadCount})</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === option.value
                    ? "bg-[#16a34a] text-[#001a0f]"
                    : "tv-card text-gray-300 hover:opacity-80 border-[rgba(22,163,74,0.14)]"
                }`}
              >
                {option.label}
                {option.value === "unread" && unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 dark:bg-black/20 rounded-full text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">Failed to load notifications</p>
            <button
              onClick={() => mutate()}
              className="px-6 py-2 bg-[#16a34a] hover:opacity-90 text-[#001a0f] rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No notifications found
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`rounded-xl p-5 border transition-all duration-300 cursor-pointer ${
                      notification.read
                        ? "border-[rgba(22,163,74,0.14)] bg-[rgba(22,163,74,0.04)] hover:border-[rgba(22,163,74,0.3)]"
                        : "border-[#16a34a] bg-[rgba(22,163,74,0.08)] hover:border-[#16a34a]"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3
                            className={`text-sm font-semibold ${
                              notification.read
                                ? "text-gray-700 dark:text-gray-300"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {notification.message}
                        </p>

                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="flex flex-wrap gap-3 mb-3 text-xs">
                            {notification.metadata.stock && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded">
                                {notification.metadata.stock}
                              </span>
                            )}
                            {notification.metadata.amount && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded">
                                {notification.metadata.amount}
                              </span>
                            )}
                            {notification.metadata.status && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded">
                                {notification.metadata.status}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDate(notification.created_at)}
                          </span>
                          <span className="text-xs text-green-600 hover:text-green-700 font-medium">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/70 dark:bg-black/50 flex items-center justify-center p-4 z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <div
                className="rounded-2xl max-w-3xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl bg-white dark:bg-[#0b1a12] border border-gray-200 dark:border-[rgba(22,163,74,0.14)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity z-10 bg-gray-100 dark:bg-white/8"
                  aria-label="Close modal"
                >
                  <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 p-6 sm:p-8">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${getTypeColor(
                          selectedNotification.type
                        )}`}
                      >
                        {getNotificationIcon(selectedNotification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h2 className="text-base sm:text-sm font-bold text-gray-900 dark:text-white pr-12">
                            {selectedNotification.title}
                          </h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeColor(
                              selectedNotification.type
                            )}`}
                          >
                            {selectedNotification.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {new Date(selectedNotification.created_at).toLocaleString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>

                  {/* Metadata Cards */}
                  {selectedNotification.metadata && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                      {selectedNotification.metadata.stock && (
                        <div className="tv-inner p-4 rounded-lg">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Stock
                          </div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {selectedNotification.metadata.stock}
                          </div>
                        </div>
                      )}
                      {selectedNotification.metadata.amount && (
                        <div className="tv-inner p-4 rounded-lg">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Amount
                          </div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {selectedNotification.metadata.amount}
                          </div>
                        </div>
                      )}
                      {selectedNotification.metadata.status && (
                        <div className="tv-inner p-4 rounded-lg">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Status
                          </div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {selectedNotification.metadata.status}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Full Details */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Details
                    </h3>
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                      {selectedNotification.full_details
                        .split(". ")
                        .map((sentence, index) => (
                          <p key={index}>{sentence.trim()}.</p>
                        ))}
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="w-full py-3 bg-[#16a34a] hover:opacity-90 text-[#001a0f] font-semibold rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
