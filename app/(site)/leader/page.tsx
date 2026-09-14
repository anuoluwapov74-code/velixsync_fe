"use client";

import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";
import { useState } from "react";
import Image from "next/image";

const leaderTabs = [
  {
    label: "Research",
    heading:
      "Oversee the market and instruments, research news and updates regularly.",
    description:
      "Leaders are always researching their preferred products, historical performance and news daily. They need to understand the risks and investment needed before moving forward with their actions.",
  },
  {
    label: "Interact",
    heading:
      "Engage with investors and share insights to build trust and grow your following.",
    description:
      "Leaders interact with their followers by sharing market analysis, trade rationale, and performance updates. Building strong relationships with investors is key to long-term success.",
  },
  {
    label: "Broadcast",
    heading:
      "Share your trading signals and strategies with investors in real-time.",
    description:
      "Leaders broadcast their trades automatically to all connected investors. Every position you open or close is instantly replicated across your followers' accounts based on their settings.",
  },
];

const faqItems = [
  {
    question: "Can anyone become a VelixSync Leader?",
    answer:
      "Yes, anyone with trading experience and a verified account can apply to become a VelixSync Leader. We review all applications to ensure quality and consistency for our investors.",
  },
  {
    question: "Can I become a Leader without being a VelixSync?",
    answer:
      "You need to have a VelixSync account to become a Leader. The registration process is quick and free, and you can apply for the Leaders Program as part of the signup process.",
  },
  {
    question: "What are the general trading hours for all the instruments?",
    answer:
      "Trading hours vary by instrument. Forex markets are open 24/5, while stock CFDs follow their respective exchange hours. Cryptocurrency markets are available 24/7.",
  },
  {
    question: "How will I become a successful Leader?",
    answer:
      "Success as a Leader comes from consistent performance, responsible risk management, and active engagement with your followers. Focus on building a strong track record over time.",
  },
  {
    question: "What are the charges for me as a new Leader with VelixSync?",
    answer:
      "There are no charges to become a Leader. You only pay your regular trading costs. You earn commissions from investors who copy your trades — there are no hidden fees.",
  },
  {
    question:
      "Is there a minimum amount for me to start trading with VelixSync?",
    answer:
      "The minimum deposit depends on the broker you choose to trade with. VelixSync works with multiple regulated brokers, each with their own minimum requirements.",
  },
];


export default function BecomeALeader() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
  };

  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        {/* Hero Section - img1 */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Become a Leader with{" "}
              <span className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-400 bg-clip-text text-transparent">
                VelixSync
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto text-sm lg:text-base">
              VelixSync is one of the most transparent social trading platforms
              in the world, where our goal is to support investors and traders
              in their investment goals. Our Leader Program is open for
              individual traders who possess trading skills. Become a Leader
              today by sharing profitable signals and strategies without
              investors, to follow these and earn additional income.
            </p>
            <Link
              href="/register"
              className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-green-600/25 hover:-translate-y-0.5"
            >
              Create account &rarr;
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/10" />

        {/* What Does a Leader Do? - img2 */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              What Does a Leader Do?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Tabs */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                {leaderTabs.map((tab, index) => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(index)}
                    className={`w-full text-left px-6 py-5 text-base font-medium transition-all duration-200 border-b border-gray-200 dark:border-white/10 last:border-b-0 ${
                      activeTab === index
                        ? "bg-green-50 dark:bg-green-500/10 text-[var(--primary)]"
                        : "bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-snug">
                  {leaderTabs[activeTab].heading}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 text-sm lg:text-base">
                  {leaderTabs[activeTab].description}
                </p>
                <Link
                  href="/register"
                  className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-green-600/25 hover:-translate-y-0.5"
                >
                  Open account &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/10" />

        {/* How to Become a Leader in 3 Simple Steps - img3 */}
        <section className="py-16 lg:py-24 px-6 bg-green-50/60 dark:bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-16 text-center">
              How to Become a Leader in 3 Simple Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 mb-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full border-2 border-[var(--primary)] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Join VelixSync as a Leader
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Access the Leaders Program page and signup using our free form
                  to fast-track your approval.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full border-2 border-[var(--primary)] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Complete the Registration Process & Start Trading
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Fill your information on our Online Application Form plus.
                  Gain access to the system and choose. &ldquo;Become a
                  Leader&rdquo;, to start trading.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full border-2 border-[var(--primary)] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Investors Copy your Strategy & you Get Rewarded
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Investors copy your signals according to their capital and
                  risk management. You get paid 30% commission for every
                  successful payment systems.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/register"
                className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-green-600/25 hover:-translate-y-0.5"
              >
                Open account &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Trading Platforms - img4 + img5 */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-16 text-center">
              Trading Platforms
            </h2>

            {/* MT4 & MT5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 mb-12">
              {/* MT4 */}
              <div>
                <div className="aspect-video rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 overflow-hidden border border-gray-200 dark:border-white/10">
                  {imageErrors["mt4"] ? (
                    <span className="text-gray-400 text-sm">
                      MT4 Platform Image
                    </span>
                  ) : (
                    <Image
                      src="/images/mt4.png"
                      alt="MetaTrader 4 Platform"
                      width={600}
                      height={340}
                      className="w-full h-full object-contain p-4"
                      onError={() => handleImageError("mt4")}
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  MetaTrader 4 (MT4) Platform
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  MetaTrader 4 is a powerful trading platform designed for Forex
                  and CFD trading. MT4 offers superior charting capabilities,
                  Expert Advisors (EA) for automated trading, and a
                  user-friendly interface that&apos;s trusted by millions of
                  traders worldwide. MetaTrader 4 is a diverse platform for
                  brokers trading multiple multiple shares in the Indices
                  brokers and markets trading securities. The free version that
                  is offered here in various capabilities including alerts that
                  uses add to MT4 allowing to create views in the VelixSync
                  network.
                </p>
              </div>

              {/* MT5 */}
              <div>
                <div className="aspect-video rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 overflow-hidden border border-gray-200 dark:border-white/10">
                  {imageErrors["mt5"] ? (
                    <span className="text-gray-400 text-sm">
                      MT5 Platform Image
                    </span>
                  ) : (
                    <Image
                      src="/images/mt5.png"
                      alt="MetaTrader 5 Platform"
                      width={600}
                      height={340}
                      className="w-full h-full object-contain p-4"
                      onError={() => handleImageError("mt5")}
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  MetaTrader 5 (MT5) Platform
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  MetaTrader 5 is the evolution of our industry-leading MT4
                  platform, designed for traders who want more sophisticated
                  tools and enhanced trading capabilities. MT5 offers advanced
                  trading functionality and expanded features while being one
                  trading platform that takes place in the if VelixSync&apos;s
                  trading pace on the live market live.
                </p>
              </div>
            </div>

            {/* Divider within section */}
            <div className="border-t border-gray-200 dark:border-white/10 my-12" />

            {/* XOH & ActTrader */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
              {/* XOH */}
              <div>
                <div className="aspect-video rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 overflow-hidden border border-gray-200 dark:border-white/10">
                  {imageErrors["xoh"] ? (
                    <span className="text-gray-400 text-sm">
                      XOH Platform Image
                    </span>
                  ) : (
                    <Image
                      src="/images/xoh.png"
                      alt="XOH Trading Platform"
                      width={600}
                      height={340}
                      className="w-full h-full object-contain p-4"
                      onError={() => handleImageError("xoh")}
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  XOH Trading Platform
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  XOH Trading Platform is our proprietary web-based platform
                  designed specifically for social trading and copy trading.
                  This platform offers real-time copy trades for novice and
                  expert traders alike, with features like portfolio management,
                  risk management, risk and speed trade portfolio management,
                  leveraged and stop-market and portfolio management. Platform
                  in the option.
                </p>
              </div>

              {/* ActTrader */}
              <div>
                <div className="aspect-video rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 overflow-hidden border border-gray-200 dark:border-white/10">
                  {imageErrors["acttrader"] ? (
                    <span className="text-gray-400 text-sm">
                      ActTrader Platform Image
                    </span>
                  ) : (
                    <Image
                      src="/images/actrader.png"
                      alt="ActTrader Platform"
                      width={600}
                      height={340}
                      className="w-full h-full object-contain p-4"
                      onError={() => handleImageError("acttrader")}
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  ActTrader
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  ActTrader Platform is our modern copy trading platform that is
                  superior web is technology. This Platform is available
                  provides the market with fast execution, an intuitive
                  interface and comprehensive charting tools. ActTrader is built
                  with real time market management specifically for online for
                  online trading needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/10" />

        {/* Reasons to Become a Leader - img6 */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white max-w-md leading-tight">
                Reasons to Become a Leader with VelixSync
              </h2>
              <Link
                href="/register"
                className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-green-600/25 hover:-translate-y-0.5 self-start md:self-center shrink-0"
              >
                Open account &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  No Hidden Costs and No Monthly Payout Limits
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  There are no costs when you become a Leader and there are also
                  no limits to payout support. You only pay your day-to-day for
                  the commission you earn.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Broker-Agnostic Platform
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Our platform works with multiple regulated brokers worldwide.
                  You can choose the one that suits you most and start your
                  journey with the investments.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Verified Track Record
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  All Leaders are verified and all our trading strategies and
                  positions are monitored in real-time to ensure for integrity.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Dedicated Leaders Desk
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  We provide you with a live chat for traders and a dedicated
                  VIP and support number.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/10" />

        {/* FAQ Section - img7 */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Your Questions, answered
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base max-w-xl mx-auto">
                Have questions about being a Leader? Find answers to the most
                common questions our members ask.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 dark:border-white/10 bg-green-50/50 dark:bg-white/[0.03] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                    <span
                      className={`text-[var(--primary)] text-xl font-light shrink-0 transition-transform duration-200 ${
                        openFaq === index ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 pb-5 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </PagePreloader>
  );
}
