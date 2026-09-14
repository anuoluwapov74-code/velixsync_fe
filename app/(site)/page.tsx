import type { Metadata } from "next";
import CTASection from "@/components/site/CTASection";
import FAQSection from "@/components/site/Faqsection";
import FeaturesSection from "@/components/site/FeaturesSection";
import Footer from "@/components/site/Footer";
import HeroSection from "@/components/site/HeroSection";
import HowItWorks from "@/components/site/HowItWorks";
import LiquidityProvidersSection from "@/components/site/LiquidityProvidersSection";
import Navbar from "@/components/site/Navbar";
import StatsSection from "@/components/site/StatsSection";
// import TeamSection from "@/components/site/TeamSection";
import TradersSection from "@/components/site/TradersSecion";
import TrustSection from "@/components/site/TrustSection";
import WhatYouCanCopy from "@/components/site/WhatYouCanCopy";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "Copy Futures, Options & Contracts with Precision",
  description:
    "VelixSync lets you mirror real-time stock, futures, and options trades from top-performing experts. AutoGuard™ protection, AI signals, zero commission — start copy trading today.",
  alternates: { canonical: "https://velixsync.com" },
  openGraph: {
    title: "VelixSync — Copy Futures, Options & Contracts with Precision",
    description:
      "Mirror real-time trades from top experts. AutoGuard™ risk management, AI signals, zero commission.",
    url: "https://velixsync.com",
    images: [{ url: "https://velixsync.com/opengraph-image.png", width: 1200, height: 630, alt: "VelixSync Copy Trading Platform" }],
  },
};

export default function Home() {
  return (
    <PagePreloader>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://velixsync.com/#organization",
                name: "VelixSync",
                url: "https://velixsync.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://velixsync.com/android-chrome-512x512.png",
                },
                sameAs: [],
                description:
                  "VelixSync is a copy trading platform for futures, options, and contracts. Mirror trades from top-performing experts with real-time precision.",
              },
              {
                "@type": "WebSite",
                "@id": "https://velixsync.com/#website",
                url: "https://velixsync.com",
                name: "VelixSync",
                publisher: { "@id": "https://velixsync.com/#organization" },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://velixsync.com/explore-traders?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "WebPage",
                "@id": "https://velixsync.com/#webpage",
                url: "https://velixsync.com",
                name: "VelixSync — Copy Futures, Options & Contracts with Precision",
                isPartOf: { "@id": "https://velixsync.com/#website" },
                about: { "@id": "https://velixsync.com/#organization" },
                description:
                  "Mirror real-time stock and options trades from top-performing traders. Precision, flexibility, and transparency — straight to your fingertips.",
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What is VelixSync?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "VelixSync is a copy trading platform that lets you mirror real-time trades from top-performing expert traders across futures, options, and contracts.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How does copy trading work on VelixSync?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Sign up, choose an expert trader, set your investment amount, and VelixSync automatically mirrors every trade they make in your portfolio in real time.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What is AutoGuard™?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "AutoGuard™ is VelixSync's proprietary risk management system that applies automatic stop-loss, trailing stops, and position-size limits to every copied trade.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Does VelixSync charge commission?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No. VelixSync charges zero commission on US equity trades. There are no per-trade fees and no hidden charges.",
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <WhyChooseUs />
        <TradersSection />
        <FeaturesSection />
        <WhatYouCanCopy />
        <FAQSection />
        {/* <TeamSection /> */}
        <TrustSection />
        <CTASection />
        <LiquidityProvidersSection />
        <Footer />
      </main>
    </PagePreloader>
  );
}
