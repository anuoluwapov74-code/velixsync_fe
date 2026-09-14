import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "VelixSync Affiliate Programme",
  description: "Earn commissions by referring traders to VelixSync. Join the VelixSync affiliate programme, get your unique link, and grow your income by sharing the best copy trading platform.",
  alternates: { canonical: "https://velixsync.com/affiliate" },
  openGraph: {
    title: "VelixSync Affiliate Programme",
    description: "Refer traders to VelixSync and earn commissions on every referral.",
    url: "https://velixsync.com/affiliate",
  },
};

export default function AffiliateProgram() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Affiliate Program
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Earn commissions by referring traders to VelixSync
            </p>
          </div>
          <div className="space-y-12">
            {/* Program Overview */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Program Overview
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The VelixSync Affiliate Program rewards you for introducing new traders to our
                platform. Whether you are a content creator, financial educator, trading community
                leader, or simply someone with a network of potential traders, our program offers
                a straightforward way to earn passive income.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Every time someone registers through your unique referral link and makes their first
                deposit, you earn a commission. It is that simple — no complicated tier structures,
                no hidden conditions.
              </p>
            </section>

            {/* Commission Structure */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Commission Structure
              </h2>
              <div className="bg-green-600/10 border border-green-500/20 rounded-xl p-6 mb-6">
                <p className="text-3xl font-bold text-green-600 mb-2">10% Referral Bonus</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Earn 10% of every referred user&apos;s first deposit, credited directly to your account.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Credit</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Commissions are credited to your account as soon as your referral&apos;s deposit is
                    confirmed. No waiting periods or delays.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lifetime Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Once a user registers through your link, they are permanently associated with
                    your affiliate account. Our 90-day cookie ensures attribution.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Minimum Threshold</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    There is no minimum earning threshold for withdrawals. Withdraw your commissions
                    at any time, regardless of the amount.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unlimited Referrals</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    There is no cap on the number of referrals you can make. The more you refer,
                    the more you earn — without limits.
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0">1</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Sign Up</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Create your VelixSync account and apply for the Affiliate Program through your dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0">2</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Get Your Link</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Once approved, you receive a unique referral link with full tracking capabilities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0">3</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Share and Promote</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Share your referral link across social media, blogs, email, trading communities,
                      and any other channels you have access to.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0">4</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Earn Commissions</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      When your referrals register and make their first deposit, you earn 10% instantly.
                      Track everything from your affiliate dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            
            {/* Affiliate Benefits */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Affiliate Benefits
              </h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Competitive 10% commission on all first deposits with instant credit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Dedicated affiliate dashboard with real-time tracking and analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Professional marketing materials including banners, landing pages, and copy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Flexible withdrawal options with no minimum threshold</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Dedicated affiliate manager for personalized support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>90-day tracking cookie for maximum attribution coverage</span>
                </li>
              </ul>
            </section>

            {/* Program Rules and Guidelines */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Program Rules and Guidelines
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To maintain the integrity of our program, all affiliates must adhere to these guidelines:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Do not make misleading claims about guaranteed profits or returns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Always disclose your affiliate relationship when promoting VelixSync</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Do not use spam, unsolicited messages, or deceptive tactics to acquire referrals</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Self-referrals and fraudulent registrations are strictly prohibited</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Do not bid on VelixSync branded keywords in paid advertising</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Comply with all applicable laws and regulations in your jurisdiction</span>
                </li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We believe in making payments as simple and transparent as possible:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Commissions are credited instantly upon deposit confirmation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Withdrawals can be requested at any time with no minimum amount</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Payment methods include bank transfer, cryptocurrency, and e-wallets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Processing times range from 1-5 business days depending on method</span>
                </li>
              </ul>
            </section>

            {/* Program Termination */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Program Termination
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                VelixSync reserves the right to terminate affiliate partnerships under the following
                circumstances:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Violation of program rules, including fraudulent activity or self-referrals</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Use of misleading, deceptive, or spammy promotional methods</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Failure to comply with applicable advertising and disclosure regulations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Inactivity for an extended period (12+ months with no referral activity)</span>
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Upon termination, any pending commissions that have been legitimately earned will
                still be paid out in accordance with our terms.
              </p>
            </section>

            {/* CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Join the VelixSync Affiliate Program today. Sign up, get your referral link,
                and start earning commissions on every qualified referral.
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
