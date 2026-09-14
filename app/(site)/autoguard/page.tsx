import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "AutoGuard™ — VelixSync Risk Management",
  description: "AutoGuard™ by VelixSync automatically applies stop-loss, trailing stops, and position-size limits to every copied trade. Protect your capital while you copy the best traders.",
  alternates: { canonical: "https://velixsync.com/autoguard" },
  openGraph: {
    title: "AutoGuard™ — VelixSync Risk Management",
    description: "Automatic risk protection built into every copied trade on VelixSync.",
    url: "https://velixsync.com/autoguard",
  },
};

export default function AutoGuard() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900/50 py-24 lg:py-36">
          {/* Subtle dotted background pattern using theme variable */}
          <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle,var(--dot-color)_1px,transparent_1px)] bg-size-[16px_16px]" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              Autoprotect your{" "}
              <span className="bg-linear-to-r from-green-700 to-green-500 dark:from-green-500 dark:to-emerald-400 bg-clip-text text-transparent">
                account
              </span>
            </h1>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-block rounded-md bg-primary px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover shadow-lg shadow-green-600/30 hover:shadow-green-600/50"
              >
                Create account &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Meet AutoGuard + How does it work */}
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
            {/* Meet AutoGuard Card */}
            <div className="rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/8 p-10 lg:p-12">
              {/* Icon */}
              <div className="mb-8 text-gray-400 dark:text-gray-500">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="12"
                    y="24"
                    width="40"
                    height="28"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M22 24V16a10 10 0 0 1 20 0v8"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="28" cy="40" r="2" fill="currentColor" />
                  <circle cx="32" cy="40" r="2" fill="currentColor" />
                  <circle cx="36" cy="40" r="2" fill="currentColor" />
                </svg>
              </div>
              <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
                Meet AutoGuard
              </h2>
              <p className="mb-5 leading-relaxed text-gray-600 dark:text-gray-400">
                AutoGuard&trade; is an account protection feature that monitors
                each Trader&apos;s behavior and automatically removes a Trader
                when detecting a trading strategy has deviated from its expected
                loss profile.
              </p>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                AutoGuard&trade; Capital Protection is available for all
                investors, and it&apos;s mandatory for the users residing in the
                EU using the EU SignalSync platform as it creates a protection
                shield for your investment capital!
              </p>
            </div>

            {/* How does it work Card */}
            <div className="rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/8 p-10 lg:p-12">
              {/* Icon */}
              <div className="mb-8 text-green-600 dark:text-green-400">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="38"
                    cy="20"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="24"
                    cy="36"
                    r="12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="44"
                    cy="40"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
                How does it work?
              </h2>
              <p className="mb-5 leading-relaxed text-gray-600 dark:text-gray-400">
                The AutoGuard&trade; automatically calculates a trading exit
                value for the trades opened in your account based on your
                specified capital protection amount. When your threshold is hit,
                AutoGuard&trade; stops all your trading works at open positions
                and disable the Leader instantly.
              </p>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                For detailed information about AutoGuard, please consult the
                autoguard guide.
              </p>
            </div>
          </div>
        </section>

        {/* Ready to Invest Smarter */}
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Ready to Invest Smarter?
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Card 1 */}
              <div className="flex flex-col items-center rounded-2xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200/50 dark:border-white/8 px-8 py-12 text-center">
                <div className="mb-6 text-green-700 dark:text-green-400">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="14"
                      y="8"
                      width="20"
                      height="32"
                      rx="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="24" cy="18" r="4" stroke="currentColor" strokeWidth="2" />
                    <circle cx="24" cy="30" r="2" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white lg:text-2xl">
                  Create Your Account.
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Join now to unlock options-focused copy trading.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col items-center rounded-2xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200/50 dark:border-white/8 px-8 py-12 text-center">
                <div className="mb-6 text-green-700 dark:text-green-400">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="20"
                      cy="24"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="30"
                      cy="20"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M26 14l3-3m0 0l3 3m-3-3v6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white lg:text-2xl">
                  Find Your Match
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Explore leaders known for success in
                  options&mdash;contracts, spreads, tickers&mdash;you name
                  it.
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col items-center rounded-2xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200/50 dark:border-white/8 px-8 py-12 text-center">
                <div className="mb-6 text-green-700 dark:text-green-400">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="10"
                      y="8"
                      width="24"
                      height="32"
                      rx="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect
                      x="14"
                      y="4"
                      width="16"
                      height="8"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M34 28l6-6m0 0l-4-1m4 1l-1 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-bold italic text-gray-900 dark:text-white lg:text-2xl">
                  Copy and grow
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Replicate trades, refine strategies, and
                  learn&mdash;all while staying in control.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/register"
                className="inline-block rounded-md bg-primary px-10 py-4 text-sm font-semibold text-white transition hover:bg-primary-hover shadow-lg shadow-green-600/30 hover:shadow-green-600/50"
              >
                Get started now &rarr;
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </PagePreloader>
  );
}
