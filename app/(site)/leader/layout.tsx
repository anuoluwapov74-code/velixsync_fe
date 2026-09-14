import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Leader Trader — VelixSync",
  description: "Share your trading expertise on VelixSync and earn from your followers. Apply to become a Leader Trader, set your strategy, and let others copy your success.",
  alternates: { canonical: "https://velixsync.com/leader" },
  openGraph: {
    title: "Become a Leader Trader on VelixSync",
    description: "Share your trades, earn from followers, and grow your reputation on VelixSync.",
    url: "https://velixsync.com/leader",
  },
};

export default function LeaderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
