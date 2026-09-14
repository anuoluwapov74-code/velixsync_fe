import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Sign up for VelixSync and start copy trading futures, options, and contracts from expert traders. Create your free account in minutes — zero commission.",
  alternates: { canonical: "https://velixsync.com/register" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Create a VelixSync Account",
    description: "Join VelixSync and start copy trading from expert traders — zero commission.",
    url: "https://velixsync.com/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
