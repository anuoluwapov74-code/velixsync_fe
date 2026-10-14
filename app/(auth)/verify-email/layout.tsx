import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your VelixSync Pro account and start copy trading.",
  alternates: { canonical: "https://velixsyncpro.com/verify-email" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Verify Your VelixSync Pro Email",
    description: "Activate your VelixSync Pro account by verifying your email address.",
    url: "https://velixsyncpro.com/verify-email",
  },
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
