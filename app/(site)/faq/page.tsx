import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import PagePreloader from "@/components/PagePreloader";
import FAQMajor from "@/components/site/FAQMajor";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Find answers to common questions about digital options trading, deposits, withdrawals, account verification, and more on VelixSync.",
  alternates: { canonical: "https://velixsync.com/faq" },
  openGraph: {
    title: "VelixSync FAQ",
    description: "Answers to the most frequently asked questions about trading, accounts, and verification on VelixSync.",
    url: "https://velixsync.com/faq",
  },
};

export default function FAQPage() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <FAQMajor showHeader={true} />
        <Footer />
      </main>
    </PagePreloader>
  );
}
