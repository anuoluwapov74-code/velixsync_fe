import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your VelixSync Pro account and start copying expert traders in real time. Access your portfolio, manage positions, and grow with VelixSync Pro.",
  alternates: { canonical: "https://velixsyncpro.com/login" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Log In to VelixSync Pro",
    description: "Access your VelixSync Pro copy trading account.",
    url: "https://velixsyncpro.com/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
