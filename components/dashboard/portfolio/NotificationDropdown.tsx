"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { NOTIF_KEY } from "@/lib/swrKeys";

interface NotificationDropdownProps {
  onClose: () => void;
}

interface Notification {
  id: number;
  type: "trade" | "deposit" | "withdrawal" | "alert" | "system" | "news";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface NotificationsRecentResponse {
  success: boolean;
  notifications: Notification[];
  unread_count: number;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<NotificationsRecentResponse>(NOTIF_KEY, { revalidateOnMount: true });
  const notifications = data?.success ? data.notifications : [];
  const unreadCount = data?.success ? data.unread_count : 0;
  const loading = isLoading;

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const response = await apiFetch("/notifications/mark-all-read/", {
        method: "POST",
      });

      if (response.ok) {
        // Optimistically update the shared cache — TopNav's badge (same key)
        // updates immediately too, no separate callback/refetch needed.
        mutate(
          (current) =>
            current?.success
              ? { ...current, notifications: current.notifications.map((n) => ({ ...n, read: true })), unread_count: 0 }
              : current,
          { revalidate: false }
        );
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "trade":
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case "deposit":
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        );
      case "withdrawal":
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      case "alert":
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case "system":
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "news":
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "trade":
        return { bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600" };
      case "deposit":
        return { bg: "bg-green-100 dark:bg-green-500/20", text: "text-green-700" };
      case "withdrawal":
        return { bg: "bg-green-100 dark:bg-green-500/20", text: "text-green-600" };
      case "alert":
        return { bg: "bg-purple-100 dark:bg-purple-500/20", text: "text-purple-600" };
      case "system":
        return { bg: "bg-gray-100 dark:bg-gray-500/20", text: "text-gray-600" };
      case "news":
        return { bg: "bg-cyan-100 dark:bg-cyan-500/20", text: "text-cyan-600" };
      default:
        return { bg: "bg-gray-100 dark:bg-gray-500/20", text: "text-gray-600" };
    }
  };

  const handleViewAll = () => {
    router.push("/notifications");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-16 sm:top-auto sm:mt-2 sm:w-96 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50 bg-white/97 border border-gray-200 dark:bg-[rgba(13,26,18,0.97)] dark:border-[rgba(0,201,167,0.14)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,201,167,0.1)]">
          <div className="flex items-center space-x-2">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 bg-green-700 text-white text-[10px] font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[10px] sm:text-xs text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-400 font-medium transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-72 sm:max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2"
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
              <p className="text-xs text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification, index) => {
              const colors = getTypeColor(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-3 hover:bg-[rgba(0,201,167,0.04)] transition-colors cursor-pointer"
                  onClick={handleViewAll}
                >
                  <div className="flex items-start space-x-2.5">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center`}>
                      <div className={colors.text}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-0.5">
                        <p className="text-[11px] sm:text-xs font-semibold text-gray-900 dark:text-white truncate pr-2">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-1.5 h-1.5 bg-green-700 rounded-full ml-2 mt-1 flex-shrink-0" />
                        )}
                      </div>
                      {notification.message && (
                        <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 mb-1 line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[rgba(0,201,167,0.1)]">
          <button
            onClick={handleViewAll}
            className="w-full text-center text-[10px] sm:text-xs text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-400 font-medium transition-colors"
          >
            View all notifications
          </button>
        </div>
      </motion.div>
    </>
  );
}

