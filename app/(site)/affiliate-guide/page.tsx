import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "Affiliate Guide — How to Earn with VelixSync",
  description: "Step-by-step guide to earning commissions as a VelixSync affiliate. Learn how to share your referral link, track conversions, and maximise your affiliate income.",
  alternates: { canonical: "https://velixsync.com/affiliate-guide" },
  openGraph: {
    title: "VelixSync Affiliate Guide",
    description: "How to earn commissions as a VelixSync affiliate — step-by-step.",
    url: "https://velixsync.com/affiliate-guide",
  },
};

export default function AffiliateGuide() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Affiliate Guide
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Everything you need to know to succeed as a VelixSync affiliate
            </p>
          </div>
          <div className="space-y-12">
            {/* Welcome */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to the Affiliate Program
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Thank you for joining the VelixSync Affiliate Program. As an affiliate, you play a
                crucial role in growing our community of traders. This guide will walk you through
                everything you need to know — from setting up your account to maximizing your earnings.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our program is designed to be simple, transparent, and rewarding. You earn a commission
                on every qualified referral, and we provide you with all the tools and resources to succeed.
              </p>
            </section>

            {/* Getting Started */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Getting Started
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Follow these steps to begin earning as a VelixSync affiliate:
              </p>
              <ol className="space-y-4 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  <span><strong>Create your VelixSync account</strong> — Sign up at VelixSync and complete the verification process.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  <span><strong>Apply for the Affiliate Program</strong> — Navigate to the Affiliate section in your dashboard and submit your application.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  <span><strong>Get your unique referral link</strong> — Once approved, you will receive a personalized referral link and tracking code.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  <span><strong>Start promoting</strong> — Share your link across your channels and start earning commissions on every qualified referral.</span>
                </li>
              </ol>
            </section>

            {/* Your Dashboard */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your Dashboard
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Your affiliate dashboard is your command center. From here you can:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>View your referral link and generate custom tracking URLs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Monitor real-time clicks, sign-ups, and conversions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Track your commission earnings and payment history</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Access promotional materials including banners, copy, and landing pages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Request withdrawals of your earned commissions</span>
                </li>
              </ul>
            </section>

          
            {/* Promoting VelixSync */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Promoting VelixSync
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Here are some tips and best practices to maximize your referral earnings:
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Be authentic</strong> — Share your own experience with VelixSync. Genuine recommendations convert better than generic pitches.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Educate your audience</strong> — Create content that explains how copy trading works and how VelixSync makes it accessible.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Use multiple channels</strong> — Promote on social media, blogs, YouTube, email newsletters, and trading communities.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Leverage our materials</strong> — Use the banners, landing pages, and copy we provide in your dashboard.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Stay compliant</strong> — Always disclose your affiliate relationship and never make guarantees about trading profits.</span>
                </li>
              </ul>
            </section>

            {/* Commission Structure */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Commission Structure
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our commission structure is straightforward and generous:
              </p>
              <div className="bg-green-600/10 border border-green-500/20 rounded-xl p-6 mb-4">
                <p className="text-2xl font-bold text-green-600 mb-2">10% of First Deposit</p>
                <p className="text-gray-700 dark:text-gray-300">
                  You earn 10% of every referred user&apos;s first deposit. There is no cap on the number
                  of referrals you can make, and commissions are credited instantly once the deposit is confirmed.
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For example, if you refer a user who deposits $1,000, you earn $100 in commission. Refer
                ten users with similar deposits and you have earned $1,000 — it is that simple.
              </p>
            </section>

            {/* Tracking and Analytics */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Tracking and Analytics
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We provide comprehensive tracking so you always know how your campaigns are performing:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Click tracking</strong> — See exactly how many people click your referral links</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Conversion tracking</strong> — Monitor sign-ups, verifications, and first deposits</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Sub-ID tracking</strong> — Use custom sub-IDs to track different campaigns and channels</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Historical reports</strong> — Access detailed reports for any date range</span>
                </li>
              </ul>
            </section>

            

            {/* Withdrawal of Earnings */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Withdrawal of Earnings
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Withdrawing your affiliate earnings is simple and flexible:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Commissions are available for withdrawal once confirmed (typically within 24-48 hours)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Withdraw via bank transfer, cryptocurrency, or to your VelixSync trading account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>No minimum withdrawal threshold — withdraw any amount at any time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Withdrawal processing times vary by method (1-5 business days)</span>
                </li>
              </ul>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How long does the referral cookie last?</h3>
                  <p className="text-gray-700 dark:text-gray-300">Our tracking cookies last for 90 days. If a user clicks your link and registers within 90 days, you receive credit for the referral.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I refer myself or my own accounts?</h3>
                  <p className="text-gray-700 dark:text-gray-300">No. Self-referrals are not permitted and will result in removal from the affiliate program.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Is there a limit to how many people I can refer?</h3>
                  <p className="text-gray-700 dark:text-gray-300">There is no limit. Refer as many users as you can and earn commissions on every qualified referral.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What counts as a qualified referral?</h3>
                  <p className="text-gray-700 dark:text-gray-300">A qualified referral is a new user who registers through your link, completes account verification, and makes their first deposit.</p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Join the VelixSync Affiliate Program today and start earning commissions on every
                referral. It only takes a few minutes to get set up.
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
