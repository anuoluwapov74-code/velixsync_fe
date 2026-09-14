import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "Broker Integrations — VelixSync",
  description: "VelixSync integrates with E-Trade, Webull, TD Ameritrade, Interactive Brokers, Schwab, and more. Connect your existing broker account and start copy trading instantly.",
  alternates: { canonical: "https://velixsync.com/broker" },
  openGraph: {
    title: "Broker Integrations — VelixSync",
    description: "Connect E-Trade, Webull, Schwab, and more to start copy trading on VelixSync.",
    url: "https://velixsync.com/broker",
  },
};

export default function BrokerPartnership() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        {/* Hero Section (img4) */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900/50 py-24 lg:py-36">
          <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle,var(--dot-color)_1px,transparent_1px)] bg-size-[16px_16px]" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl italic">
              Rewrite the Rules of{" "}
              <span className="bg-linear-to-r from-green-700 to-green-500 dark:from-green-500 dark:to-emerald-400 bg-clip-text text-transparent">
                Brokerage
              </span>
            </h1>
            <p className="mt-6 text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto">
              You can be the first brokerage industry innovation. With
              VelixSync, alongside your Traders and restart your profits
              manifold.
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-block rounded-md bg-primary px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover shadow-lg shadow-green-600/30 hover:shadow-green-600/50"
              >
                Book a meeting with us &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Why Partner With SignalSync (img5) */}
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Why Partner With{" "}
                <span className="bg-linear-to-r from-green-700 to-green-500 dark:from-green-500 dark:to-emerald-400 bg-clip-text text-transparent">
                  Signalsync
                </span>
                ?
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Adaptation and Acquisitions are the best formula for automated
                solutions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 dark:bg-white/10 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
              {/* Card 1 - Boost Trading Volume */}
              <div className="bg-white dark:bg-gray-900/80 p-10">
                <div className="mb-5 text-green-600 dark:text-green-400">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 24l8-8 4 4 12-12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 8h8v8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Boost Trading Volume
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Increase trading volume by 100% and tap into new revenue
                  streams.
                </p>
              </div>

              {/* Card 2 - Enhance Client Retention */}
              <div className="bg-white dark:bg-gray-900/80 p-10">
                <div className="mb-5 text-green-600 dark:text-green-400">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 6l3.09 6.26L26 13.27l-5 4.87L22.18 26 16 22.27 9.82 26 11 18.14l-5-4.87 6.91-1.01L16 6z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Enhance Client Retention
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Reduce client churn by 60% with our platform.
                </p>
              </div>

              {/* Card 3 - Expand Your Offerings */}
              <div className="bg-white dark:bg-gray-900/80 p-10">
                <div className="mb-5 text-green-600 dark:text-green-400">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 20l8-8M24 12l-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 16h24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Expand Your Offerings
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add social and signals trading alongside your existing trading
                  capabilities.
                </p>
              </div>

              {/* Card 4 - Lower Acquisition Cost */}
              <div className="bg-white dark:bg-gray-900/80 p-10">
                <div className="mb-5 text-green-600 dark:text-green-400">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Lower Acquisition Cost
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Cut down acquisition expenses by up to 40%.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works (img6) */}
        <section className="bg-gray-100 dark:bg-gray-800/30 px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-16">
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
              <div>
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                  1
                </span>
                <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  Technical Setup
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                  7-9 days
                </p>
              </div>
              <div>
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                  2
                </span>
                <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  Launch Preparation
                </h3>
                <Link
                  href="/register"
                  className="mt-2 inline-block text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium transition"
                >
                  Become an affiliate &rarr;
                </Link>
              </div>
              <div>
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                  3
                </span>
                <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  Go Live
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Our B2B Solutions (img7) */}
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-12">
              Our B2B Solutions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* API Integration */}
              <div className="flex flex-col items-center rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/8 px-8 py-12 text-center shadow-sm">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 dark:bg-green-500/10">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-green-700 dark:text-green-400"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                  API Integration
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Seamlessly incorporate our technology into your existing
                  trading infrastructure whilst ensuring you get the complete
                  copy trading capabilities.
                </p>
              </div>

              {/* Custom Development */}
              <div className="flex flex-col items-center rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/8 px-8 py-12 text-center shadow-sm">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 dark:bg-green-500/10">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-green-700 dark:text-green-400"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect
                      x="8"
                      y="8"
                      width="8"
                      height="8"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                  Custom Development
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  We tailor our solutions specifically to your business needs,
                  providing you with the freedom to achieve your goals.
                </p>
              </div>

              {/* Marketing and Sales Support */}
              <div className="flex flex-col items-center rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/8 px-8 py-12 text-center shadow-sm">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 dark:bg-green-500/10">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-green-700 dark:text-green-400"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                  Marketing and Sales Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  We offer you the benefit of our expertise in social trader
                  acquisition and retention to help you maximize your customer
                  base effectively.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to transform your Brokerage + Contact Us (img9) */}
        <section className="bg-gray-100 dark:bg-gray-800/30 px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl italic">
              Ready to transform your{" "}
              <span className="bg-linear-to-r from-green-700 to-green-500 dark:from-green-500 dark:to-emerald-400 bg-clip-text text-transparent">
                Brokerage
              </span>
              ?
            </h2>
            <p className="mt-5 text-gray-600 dark:text-gray-400 leading-relaxed">
              Join the leading brokers who have already partnered with
              VelixSync. Let&apos;s grow together.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-block rounded-md bg-primary px-10 py-4 text-sm font-semibold text-white transition hover:bg-primary-hover shadow-lg shadow-green-600/30 hover:shadow-green-600/50"
              >
                Get started now &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Have questions about our broker partnership program? Reach out to
              our partnerships team and we&apos;ll get back to you within 24
              hours.
            </p>
            <Link
              href="mailto:support@velixsync.com"
              className="text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition"
            >
              support@velixsync.com
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </PagePreloader>
  );
}
