import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your VelifyTrades account.",
  alternates: { canonical: "https://velifytrades.com/reset-password" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Set a New VelifyTrades Password",
    description: "Create a new password for your VelifyTrades copy trading account.",
    url: "https://velifytrades.com/reset-password",
  },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
