"use client";

import { motion } from "framer-motion";
import { Edit, Info, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface AuthUser {
  email: string;
  first_name: string;
  last_name: string;
  account_id: string;
}

interface UserProfileMenuProps {
  onClose: () => void;
  user: AuthUser | null;
}

export default function UserProfileMenu({
  onClose,
  user,
}: UserProfileMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch("/logout/", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    router.push("/login");
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 mt-2 w-64 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50 bg-white/97 border border-gray-200 dark:bg-[rgba(13,26,18,0.97)] dark:border-[rgba(0,201,167,0.14)]"
      >
        {/* User Info */}
        <div className="px-4 py-4 border-b border-[rgba(0,201,167,0.1)]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-semibold text-xs">
              {user
                ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
                : ""}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {user ? `${user.first_name} ${user.last_name}` : "User"}
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              router.push("/settings");
            }}
            className="flex items-center space-x-1.5 text-[11px] text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors font-medium"
          >
            <Edit className="w-3 h-3" />
            <span>Edit profile</span>
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <button
            onClick={() => {
              router.push("/");
            }}
            className="w-full px-4 py-2.5 flex items-center space-x-2.5 text-gray-700 dark:text-gray-300 hover:bg-[rgba(0,201,167,0.04)] transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">About VelixSync</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 flex items-center space-x-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}
