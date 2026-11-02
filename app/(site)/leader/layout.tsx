import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Leader Trader — VelifyTrades",
  description: "Share your trading expertise on VelifyTrades and earn from your followers. Apply to become a Leader Trader, set your strategy, and let others copy your success.",
  alternates: { canonical: "https://velifytrades.com/leader" },
  openGraph: {
    title: "Become a Leader Trader on VelifyTrades",
    description: "Share your trades, earn from followers, and grow your reputation on VelifyTrades.",
    url: "https://velifytrades.com/leader",
  },
};

export default function LeaderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
