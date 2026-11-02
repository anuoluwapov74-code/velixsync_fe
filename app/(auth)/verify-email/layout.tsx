import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your VelifyTrades account and start copy trading.",
  alternates: { canonical: "https://velifytrades.com/verify-email" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Verify Your VelifyTrades Email",
    description: "Activate your VelifyTrades account by verifying your email address.",
    url: "https://velifytrades.com/verify-email",
  },
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
