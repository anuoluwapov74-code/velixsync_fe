import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your VelixSync account.",
  alternates: { canonical: "https://velixsync.com/reset-password" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Set a New VelixSync Password",
    description: "Create a new password for your VelixSync copy trading account.",
    url: "https://velixsync.com/reset-password",
  },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
