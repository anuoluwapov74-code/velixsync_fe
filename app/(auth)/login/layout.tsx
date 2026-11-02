import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your VelifyTrades account and start copying expert traders in real time. Access your portfolio, manage positions, and grow with VelifyTrades.",
  alternates: { canonical: "https://velifytrades.com/login" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Log In to VelifyTrades",
    description: "Access your VelifyTrades copy trading account.",
    url: "https://velifytrades.com/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
