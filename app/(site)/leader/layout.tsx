import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Leader Trader — VelixSync Pro",
  description: "Share your trading expertise on VelixSync Pro and earn from your followers. Apply to become a Leader Trader, set your strategy, and let others copy your success.",
  alternates: { canonical: "https://velixsyncpro.com/leader" },
  openGraph: {
    title: "Become a Leader Trader on VelixSync Pro",
    description: "Share your trades, earn from followers, and grow your reputation on VelixSync Pro.",
    url: "https://velixsyncpro.com/leader",
  },
};

export default function LeaderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
