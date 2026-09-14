import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "Leader Trader Guide — VelixSync",
  description: "Everything you need to know about becoming a top Leader Trader on VelixSync. Set your strategy, manage copiers, and maximise your earnings as a VelixSync expert.",
  alternates: { canonical: "https://velixsync.com/leader-guide" },
  openGraph: {
    title: "VelixSync Leader Trader Guide",
    description: "How to become a top Leader Trader and earn on VelixSync.",
    url: "https://velixsync.com/leader-guide",
  },
};

export default function LeaderGuide() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Leader Guide
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your complete guide to becoming a successful signal leader on VelixSync
            </p>
          </div>
          <div className="space-y-12">
            {/* What is a Leader */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                What is a Leader?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                A Leader on VelixSync is an experienced trader who shares their trading signals with
                the community. When other users (followers) copy your trades, you earn commissions based
                on their activity. As a Leader, your trading performance is publicly visible, and your
                reputation grows as you demonstrate consistent results.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Leaders are the backbone of the VelixSync copy trading ecosystem. They provide the
                strategies and expertise that make copy trading possible for traders of all experience levels.
              </p>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Requirements to Become a Leader
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To qualify as a Leader on VelixSync, you must meet the following criteria:
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>A verified VelixSync account with completed KYC</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Minimum account balance as specified in the current program terms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Demonstrated trading history with a positive track record</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Agreement to the Leader Terms and Conditions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Commitment to maintaining responsible trading practices</span>
                </li>
              </ul>
            </section>

            {/* Setting Up Your Profile */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Setting Up Your Profile
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Your Leader profile is your public identity on VelixSync. A well-crafted profile
                attracts more followers and builds trust. Here is how to set it up:
              </p>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">1.</span>
                  <span><strong>Profile photo</strong> — Upload a professional photo or avatar that represents you</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">2.</span>
                  <span><strong>Display name</strong> — Choose a recognizable name or trading alias</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">3.</span>
                  <span><strong>Bio</strong> — Write a clear description of your trading style, experience, and strategy focus</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">4.</span>
                  <span><strong>Risk level</strong> — Set your risk classification so followers know what to expect</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">5.</span>
                  <span><strong>Trading instruments</strong> — Specify the markets and instruments you primarily trade</span>
                </li>
              </ol>
            </section>

            

            {/* Your Trading Performance */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your Trading Performance
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Your performance metrics are displayed publicly and are the primary factor followers
                consider when choosing who to copy. Key metrics include:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Win Rate</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Percentage of profitable trades</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Total Return</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Overall portfolio performance over time</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Max Drawdown</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Largest peak-to-trough decline</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Risk Score</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">AutoGuard&trade; risk assessment rating</p>
                </div>
              </div>
            </section>

           

            {/* Building Your Follower Base */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Building Your Follower Base
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Growing your follower count is key to maximizing your earnings. Here are proven strategies:
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Consistency</strong> — Trade regularly and maintain a steady performance. Followers value reliability.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Transparency</strong> — Be open about your strategy, risk tolerance, and expected drawdowns.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>Communication</strong> — Post updates about your market outlook and reasoning behind key trades.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span><strong>External promotion</strong> — Share your VelixSync profile on social media and trading communities.</span>
                </li>
              </ul>
            </section>

            {/* Earning as a Leader */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Earning as a Leader
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Leaders earn money through multiple channels on VelixSync:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Performance fees</strong> — Earn a percentage of profits generated for your followers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Volume-based commissions</strong> — Earn based on the trading volume your followers generate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span><strong>Your own trading</strong> — Continue to profit from your own successful trades</span>
                </li>
              </ul>
            </section>

            {/* Best Practices */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Best Practices
              </h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Always use stop-losses on your trades to protect both your capital and your followers&apos; capital</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Avoid over-leveraging — high-risk strategies may yield short-term gains but damage long-term trust</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Diversify your portfolio across instruments and time frames</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Keep a trading journal and share insights with your followers</span>
                </li>
              </ul>
            </section>

            {/* Risk Management */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Risk Management
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                As a Leader, responsible risk management is not just good practice — it is your
                responsibility. Your followers trust you with their capital, and VelixSync monitors
                leader behavior to protect the community.
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Never risk more than 2-5% of your account on a single trade</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Always set stop-losses and take-profit levels</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Monitor your AutoGuard&trade; risk score and keep it within acceptable levels</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">&#8226;</span>
                  <span>Be mindful of correlated positions that increase overall portfolio risk</span>
                </li>
              </ul>
            </section>

            {/* CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Start Leading Today
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Ready to share your trading expertise and earn from your skills? Apply to become
                a VelixSync Leader and start building your following today.
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
