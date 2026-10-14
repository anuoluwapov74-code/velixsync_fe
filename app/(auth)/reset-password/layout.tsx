import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your VelixSync Pro account.",
  alternates: { canonical: "https://velixsyncpro.com/reset-password" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Set a New VelixSync Pro Password",
    description: "Create a new password for your VelixSync Pro copy trading account.",
    url: "https://velixsyncpro.com/reset-password",
  },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
