import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your VelixSync account and start copy trading.",
  alternates: { canonical: "https://velixsync.com/verify-email" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Verify Your VelixSync Email",
    description: "Activate your VelixSync account by verifying your email address.",
    url: "https://velixsync.com/verify-email",
  },
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
