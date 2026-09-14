import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your VelixSync account and start copying expert traders in real time. Access your portfolio, manage positions, and grow with VelixSync.",
  alternates: { canonical: "https://velixsync.com/login" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Log In to VelixSync",
    description: "Access your VelixSync copy trading account.",
    url: "https://velixsync.com/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
