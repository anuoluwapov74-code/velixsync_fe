import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "Risk Disclaimer — VelixSync",
  description: "Important risk information for VelixSync users. Copy trading and derivatives involve substantial risk of loss. Read this disclaimer before using VelixSync.",
  alternates: { canonical: "https://velixsync.com/risk-disclaimer" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Risk Disclaimer — VelixSync",
    description: "Important risk information for VelixSync copy trading users.",
    url: "https://velixsync.com/risk-disclaimer",
  },
};

export default function RiskDisclaimer() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Risk Disclaimer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Last Updated: February 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* About VelixSync */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                1. About VelixSync
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                VelixSync is a globally recognized financial services provider offering
                access to a wide range of trading instruments and investment services.
                VelixSync operates through several regulated entities across multiple
                jurisdictions:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  VelixSync (Europe) Ltd. authorised by CySEC under license #109/10
                </li>
                <li>
                  VelixSync (UK) Ltd authorised by FCA under FRN 583263
                </li>
                <li>
                  VelixSync (USA) Ltd authorised by SEC# 801-69167; CRD # 147179
                </li>
                <li>
                  VelixSync (ME) Limited licensed by ADGM&rsquo;s FSRA under Permission
                  Number 220073
                </li>
              </ul>
            </section>

            {/* Full Disclaimer */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                2. Full Disclaimer
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The information and services provided by VelixSync are intended for
                educational and informational purposes only and should not be construed as
                investment advice, financial advice, trading advice, or any other type of
                advice. VelixSync does not recommend that any financial instrument should
                be bought, sold, or held by you.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Trading in financial instruments involves substantial risk and is not
                appropriate for every investor. The high degree of leverage that is often
                obtainable in financial trading can work against you as well as for you.
                The use of leverage can lead to large losses as well as gains.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Before deciding to trade any financial instrument, you should carefully
                consider your investment objectives, level of experience, and risk
                appetite. The possibility exists that you could sustain a loss of some or
                all of your initial investment. You should seek advice from an independent
                financial advisor if you have any doubts.
              </p>
            </section>

            {/* Performance Results and Limitations */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                3. Performance Results and Limitations
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Past performance is not necessarily indicative of future results. Any
                performance data, statistics, or results presented on the VelixSync
                platform are provided for informational purposes only and should not be
                relied upon as a guarantee of future performance.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Hypothetical or simulated performance results have inherent limitations.
                Unlike actual trading records, simulated results do not represent actual
                trading. Since trades have not actually been executed, results may have
                under- or over-compensated for the impact of certain market factors, such
                as lack of liquidity.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Simulated trading programs are generally designed with the benefit of
                hindsight. No representation is being made that any account will or is
                likely to achieve profits or losses similar to those shown. There are
                numerous other factors related to the markets in general or to the
                implementation of any specific trading program which cannot be fully
                accounted for in the preparation of hypothetical performance results.
              </p>
            </section>

            {/* Risk Warning */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                4. Risk Warning
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Trading foreign exchange, contracts for difference (CFDs), futures,
                options, and other leveraged products carries a significant level of risk
                and may not be suitable for all investors. You should be aware of the
                following risks:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  You may lose all of your invested capital. You should not invest money
                  that you cannot afford to lose.
                </li>
                <li>
                  Leveraged trading can amplify both gains and losses. A small market
                  movement can result in proportionally larger losses.
                </li>
                <li>
                  Market conditions, including volatility, liquidity, and geopolitical
                  events, can change rapidly and without warning.
                </li>
                <li>
                  Stop-loss orders may not always be executed at the specified price due to
                  market gaps or slippage.
                </li>
                <li>
                  Technology failures, system outages, and internet connectivity issues may
                  affect your ability to manage positions.
                </li>
                <li>
                  Copy trading carries additional risks, as past performance of copied
                  traders is not a guarantee of future results.
                </li>
              </ul>
            </section>

            {/* Important Notice */}
            <section className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 border-2 border-red-200 dark:border-red-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-red-900 dark:text-red-400 mb-4">
                5. Important Notice
              </h2>
              <p className="text-red-800 dark:text-red-300 leading-relaxed mb-4">
                CFDs are complex instruments and come with a high risk of losing money
                rapidly due to leverage. A significant percentage of retail investor
                accounts lose money when trading CFDs. You should consider whether you
                understand how CFDs work and whether you can afford to take the high risk
                of losing your money.
              </p>
              <p className="text-red-800 dark:text-red-300 leading-relaxed mb-4">
                The content on the VelixSync platform is not directed at residents of any
                country or jurisdiction where such distribution or use would be contrary
                to local law or regulation. It is your responsibility to ensure that your
                use of the VelixSync platform complies with all applicable laws and
                regulations in your jurisdiction.
              </p>
              <p className="text-red-800 dark:text-red-300 leading-relaxed">
                VelixSync does not accept liability for any loss or damage, including
                without limitation any loss of profit, which may arise directly or
                indirectly from use of or reliance on the information provided on our
                platform. You are solely responsible for evaluating the merits and risks
                associated with using any information, products, or services provided
                through VelixSync.
              </p>
            </section>

            {/* Contact CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Questions?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions regarding this Risk Disclaimer or need further
                clarification on the risks involved in trading, please contact our
                support team. We strongly encourage all users to understand the risks
                before engaging in any trading activity.
              </p>
              <Link
                href="/"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-green-600/30 hover:shadow-green-600/50"
              >
                Go Back Home
              </Link>
            </section>
          </div>
        </div>
        <Footer />
      </main>
    </PagePreloader>
  );
}
