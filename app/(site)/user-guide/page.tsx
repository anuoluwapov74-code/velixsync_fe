import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";
import FAQMajor from "@/components/site/FAQMajor";

export const metadata: Metadata = {
  title: "User Guide — Getting Started with VelixSync",
  description: "Learn how to use VelixSync: create your account, verify your identity, fund your wallet, choose a Leader Trader, and start copy trading in minutes.",
  alternates: { canonical: "https://velixsync.com/user-guide" },
  openGraph: {
    title: "VelixSync User Guide",
    description: "Step-by-step guide to getting started with copy trading on VelixSync.",
    url: "https://velixsync.com/user-guide",
  },
};

export default function UserGuide() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              User Guide
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Everything you need to know to get started with copy trading on VelixSync
            </p>
          </div>
          <div className="space-y-12">
            {/* Getting Started */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Getting Started
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Welcome to VelixSync! This guide will walk you through everything you need to know
                to start copy trading. Whether you are a complete beginner or an experienced trader
                looking to diversify, VelixSync makes it easy to follow top-performing traders and
                replicate their success.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By the end of this guide, you will know how to create your account, find traders
                to copy, set up copy trading, and manage your portfolio effectively.
              </p>
            </section>

            {/* Creating Your Account */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Creating Your Account
              </h2>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  <span>Visit the VelixSync registration page and enter your email address and a strong password</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  <span>Verify your email address by clicking the link sent to your inbox</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  <span>Complete the KYC verification process by uploading your identification documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  <span>Fund your account with your preferred deposit method</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">5</span>
                  <span>You are ready to start copy trading!</span>
                </li>
              </ol>
            </section>

            {/* Navigating the Dashboard */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Navigating the Dashboard
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Your dashboard is the central hub for all your trading activity. Here is what you will find:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Portfolio Overview</strong> — See your total balance, profit/loss, and active copy trades at a glance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Leader Board</strong> — Browse and discover top-performing traders to copy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Active Trades</strong> — Monitor all currently open positions across your copied leaders</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Trade History</strong> — Review past trades, including closed positions and their outcomes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Settings</strong> — Manage your account, security, and notification preferences</span>
                </li>
              </ul>
            </section>

           

            {/* Finding Traders to Copy */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Finding Traders to Copy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                VelixSync provides powerful tools to help you find the right traders to copy:
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Filter by performance</strong> — Sort leaders by return, win rate, drawdown, and risk score</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Review trading history</strong> — Examine a leader&apos;s past trades and performance charts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Check the risk score</strong> — AutoGuard&trade; assigns risk scores to help you choose appropriate leaders</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Read profiles</strong> — Understand each leader&apos;s strategy, preferred instruments, and trading style</span>
                </li>
              </ul>
            </section>

            {/* Setting Up Copy Trading */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Setting Up Copy Trading
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Once you have found a leader you want to copy, here is how to set it up:
              </p>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">1.</span>
                  <span>Click <strong>&quot;Copy&quot;</strong> on the leader&apos;s profile page</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">2.</span>
                  <span>Set the <strong>amount</strong> you want to allocate to copying this leader</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">3.</span>
                  <span>Configure your <strong>AutoGuard&trade; settings</strong> — stop-loss, max drawdown, and position sizing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">4.</span>
                  <span>Confirm and <strong>start copying</strong> — all future trades by this leader will be replicated in your account</span>
                </li>
              </ol>
            </section>

            

            {/* Managing Your Portfolio */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Managing Your Portfolio
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Once you are copying one or more leaders, managing your portfolio is straightforward:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Monitor overall performance from your dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Adjust allocation amounts for individual leaders at any time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Pause or stop copying a leader without affecting open positions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Diversify by copying multiple leaders with different strategies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Close individual copied trades manually if needed</span>
                </li>
              </ul>
            </section>

            {/* Deposits and Withdrawals */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Deposits and Withdrawals
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                VelixSync supports multiple funding methods for your convenience:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Bank transfer</strong> — Direct deposits and withdrawals via wire transfer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Credit/Debit card</strong> — Instant deposits using Visa or Mastercard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Cryptocurrency</strong> — Deposit and withdraw using supported cryptocurrencies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>E-wallets</strong> — Use popular e-wallet services for quick transactions</span>
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Deposits are typically processed instantly. Withdrawals are processed within 1-5
                business days depending on the method selected.
              </p>
            </section>

            {/* Account Security */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Account Security
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Protecting your account is our top priority. Here are security features and recommendations:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Enable <strong>two-factor authentication (2FA)</strong> for an extra layer of security</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Use a strong, unique password that you do not reuse elsewhere</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Review your login history regularly for any suspicious activity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Never share your login credentials or 2FA codes with anyone</span>
                </li>
              </ul>
            </section>

            {/* Getting Help */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Getting Help
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you need assistance at any point, VelixSync offers multiple support channels:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Live chat</strong> — Available 24/7 from your dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Email support</strong> — Reach us at support@velixsync.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Help center</strong> — Browse our comprehensive FAQ and knowledge base</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Community</strong> — Join our trading community for peer support and discussions</span>
                </li>
              </ul>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Browse answers by category or visit the <Link href="/faq" className="text-green-600 hover:underline font-medium">full FAQ page</Link>.
              </p>
              <FAQMajor showHeader={false} />
            </section>

            {/* CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Start Copy Trading?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Create your VelixSync account today and start copying top-performing traders.
                It only takes a few minutes to get started.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-green-600/30 hover:shadow-green-600/50">
                  Get Started
                </Link>
                <Link href="/" className="inline-block bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300">
                  Go Back Home
                </Link>
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </main>
    </PagePreloader>
  );
}
