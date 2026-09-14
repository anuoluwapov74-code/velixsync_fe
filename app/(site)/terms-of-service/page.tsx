import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "Terms of Service — VelixSync",
  description: "Read the VelixSync Terms of Service governing your use of our copy trading platform, including account terms, trading rules, and user obligations.",
  alternates: { canonical: "https://velixsync.com/terms-of-service" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Terms of Service — VelixSync",
    description: "The terms governing your use of the VelixSync copy trading platform.",
    url: "https://velixsync.com/terms-of-service",
  },
};

export default function TermsOfService() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Last Updated: February 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                By accessing or using the VelixSync platform, website, mobile applications, and any
                associated services (collectively, the &ldquo;Services&rdquo;), you acknowledge that you have
                read, understood, and agree to be bound by these Terms of Service
                (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you must not access or use our
                Services.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                These Terms constitute a legally binding agreement between you
                (&ldquo;User,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and VelixSync and its affiliated entities
                (&ldquo;VelixSync,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By using our Services, you
                represent and warrant that you are at least 18 years of age and have the
                legal capacity to enter into this agreement.
              </p>
            </section>

            {/* Account Registration and Security */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                2. Account Registration and Security
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To access certain features of our Services, you must register for an
                account. When registering, you agree to provide accurate, current, and
                complete information and to update such information as necessary to
                maintain its accuracy.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You are solely responsible for maintaining the confidentiality of your
                account credentials, including your username and password. You agree to
                notify VelixSync immediately of any unauthorized use of your account or
                any other breach of security. VelixSync will not be liable for any loss or
                damage arising from your failure to protect your account information.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You may not transfer, sell, or otherwise assign your account to any third
                party without prior written consent from VelixSync. We reserve the right to
                suspend or terminate any account that we reasonably believe has been
                compromised or is being used in violation of these Terms.
              </p>
            </section>

            {/* Trading Services */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                3. Trading Services
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                VelixSync provides access to a range of financial trading services,
                including but not limited to copy trading, futures trading, options trading,
                and contracts for difference (CFDs). These services are provided on an
                &ldquo;as available&rdquo; basis and may be subject to market conditions, regulatory
                requirements, and system availability.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Copy trading allows users to automatically replicate the trading
                strategies of other traders on the platform. By using copy trading
                features, you acknowledge that past performance is not indicative of future
                results and that you bear full responsibility for any trades executed on
                your behalf.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync does not provide investment advice, and no content on our
                platform should be construed as such. All trading decisions are made at
                your own discretion and risk. You should consult with a qualified financial
                advisor before making any investment decisions.
              </p>
            </section>

            {/* Risk Disclosure */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                4. Risk Disclosure
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Trading in financial instruments, including futures, options, and
                contracts, carries a high level of risk and may not be suitable for all
                investors. You may sustain a total loss of your initial investment and, in
                some cases, may be required to deposit additional funds to cover margin
                requirements.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The value of your investments can go down as well as up, and you should
                only trade with funds you can afford to lose. VelixSync strongly recommends
                that you seek independent financial advice before engaging in any trading
                activity on our platform. For full details, please review our{" "}
                <Link
                  href="/risk-disclaimer"
                  className="text-green-600 hover:underline"
                >
                  Risk Disclaimer
                </Link>
                .
              </p>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                5. Prohibited Activities
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You agree not to engage in any of the following prohibited activities
                while using our Services:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  Market manipulation, including spoofing, layering, or wash trading
                </li>
                <li>
                  Using automated systems, bots, or scripts to exploit the platform
                  without prior authorization
                </li>
                <li>
                  Engaging in money laundering, terrorist financing, or any other
                  financial crime
                </li>
                <li>
                  Accessing or attempting to access another user&rsquo;s account without
                  authorization
                </li>
                <li>
                  Interfering with or disrupting the integrity or performance of the
                  Services
                </li>
                <li>
                  Violating any applicable local, national, or international law or
                  regulation
                </li>
                <li>
                  Reverse engineering, decompiling, or disassembling any part of the
                  platform
                </li>
                <li>
                  Distributing malware, viruses, or any other harmful software through the
                  platform
                </li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                All content, features, and functionality of the VelixSync platform,
                including but not limited to text, graphics, logos, icons, images, audio
                clips, digital downloads, data compilations, and software, are the
                exclusive property of VelixSync or its licensors and are protected by
                international copyright, trademark, patent, and other intellectual
                property laws.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You are granted a limited, non-exclusive, non-transferable, and revocable
                license to access and use the Services for personal, non-commercial
                purposes. You may not reproduce, distribute, modify, create derivative
                works from, publicly display, or otherwise exploit any content from the
                platform without prior written permission from VelixSync.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To the fullest extent permitted by applicable law, VelixSync and its
                directors, officers, employees, agents, and affiliates shall not be liable
                for any indirect, incidental, special, consequential, or punitive damages,
                including but not limited to loss of profits, data, use, goodwill, or
                other intangible losses, resulting from your access to or use of (or
                inability to access or use) the Services.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync shall not be liable for any losses arising from market
                volatility, system failures, third-party service interruptions, or any
                other circumstances beyond our reasonable control. Our total aggregate
                liability to you for any claims arising out of or relating to these Terms
                or the Services shall not exceed the amount of fees paid by you to
                VelixSync in the twelve (12) months preceding the claim.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                8. Termination
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                VelixSync reserves the right to suspend or terminate your access to the
                Services at any time, with or without cause and with or without notice. You
                may also terminate your account at any time by contacting our support
                team.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Upon termination, your right to use the Services will immediately cease.
                Any provisions of these Terms that by their nature should survive
                termination shall continue in full force and effect, including but not
                limited to intellectual property provisions, warranty disclaimers,
                indemnity obligations, and limitations of liability.
              </p>
            </section>

            {/* Modifications to Terms */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                9. Modifications to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync reserves the right to modify these Terms at any time. We will
                notify you of any material changes by posting the updated Terms on our
                website and updating the &ldquo;Last Updated&rdquo; date. Your continued use of the
                Services after any changes to the Terms constitutes your acceptance of the
                revised Terms. We encourage you to review these Terms periodically.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                10. Governing Law
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws
                of the jurisdiction in which the applicable VelixSync entity is
                incorporated, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                VelixSync operates through several regulated entities worldwide:
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

            {/* Contact CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Questions?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions or concerns about these Terms of Service, please
                do not hesitate to contact our support team. We are here to help and will
                respond to your inquiry as soon as possible.
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
