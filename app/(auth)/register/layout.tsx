import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Sign up for VelixSync Pro and start copy trading futures, options, and contracts from expert traders. Create your free account in minutes — zero commission.",
  alternates: { canonical: "https://velixsyncpro.com/register" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Create a VelixSync Pro Account",
    description: "Join VelixSync Pro and start copy trading from expert traders — zero commission.",
    url: "https://velixsyncpro.com/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
