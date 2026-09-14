import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "Privacy Policy — VelixSync",
  description: "Read the VelixSync Privacy Policy to understand how we collect, use, and protect your personal data when you use our copy trading platform.",
  alternates: { canonical: "https://velixsync.com/privacy-policy" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Privacy Policy — VelixSync",
    description: "How VelixSync collects, uses, and protects your personal data.",
    url: "https://velixsync.com/privacy-policy",
  },
};

export default function PrivacyPolicy() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Last Updated: February 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Personal Information */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                1. Personal Information We Collect
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                VelixSync is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information
                when you use our platform and services. We collect the following types of
                personal information:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Application Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                When you open an account with VelixSync, we collect personal information
                such as your full name, date of birth, residential address, email address,
                phone number, nationality, employment status, annual income, net worth,
                and trading experience. This information is required to comply with
                regulatory obligations and to assess the suitability of our services for
                you.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Transaction Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We collect information about your trading activity, including deposits,
                withdrawals, trade history, account balances, and payment methods. This
                data is essential for providing our services, processing transactions, and
                maintaining accurate financial records.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Verification Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To comply with anti-money laundering (AML) and know-your-customer (KYC)
                regulations, we may collect copies of government-issued identification
                documents, proof of address, proof of income or source of funds, selfie
                photographs for identity verification, and other documents as required by
                applicable regulations.
              </p>
            </section>

            {/* Security Technology */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                2. Security Technology
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                VelixSync employs industry-standard security measures to protect your
                personal information from unauthorized access, alteration, disclosure, or
                destruction. Our security measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  256-bit SSL/TLS encryption for all data transmitted between your device
                  and our servers
                </li>
                <li>
                  Advanced firewalls and intrusion detection systems to prevent
                  unauthorized access
                </li>
                <li>
                  Regular security audits and penetration testing by independent third
                  parties
                </li>
                <li>
                  Multi-factor authentication (MFA) options for account access
                </li>
                <li>
                  Encrypted storage of sensitive data with strict access controls
                </li>
                <li>
                  Employee training programs on data protection and information security
                  best practices
                </li>
              </ul>
            </section>

            {/* Sharing Information with Our Affiliates */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                3. Sharing Information with Our Affiliates
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync may share your personal information with our affiliated
                companies and subsidiaries for the purposes of providing and improving our
                services, ensuring regulatory compliance across jurisdictions, conducting
                internal analytics and research, and managing risk across our group of
                companies. All affiliates are bound by the same privacy and data
                protection standards outlined in this policy.
              </p>
            </section>

            {/* Sharing Information with Third Parties */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                4. Sharing Information with Third Parties
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may share your personal information with third parties in the following
                circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  Payment processors and banking partners to facilitate deposits and
                  withdrawals
                </li>
                <li>
                  Identity verification and fraud prevention service providers
                </li>
                <li>
                  Cloud hosting and technology infrastructure providers
                </li>
                <li>
                  Professional advisors including lawyers, auditors, and consultants
                </li>
                <li>
                  Analytics and marketing service providers to improve our services
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                All third-party service providers are contractually obligated to protect
                your information and may only use it for the specific purposes for which
                it was shared.
              </p>
            </section>

            {/* Regulatory Disclosure */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                5. Regulatory Disclosure
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync may be required to disclose your personal information to
                regulatory authorities, law enforcement agencies, or other governmental
                bodies in response to lawful requests, subpoenas, court orders, or as
                otherwise required by applicable law. We will only disclose the minimum
                amount of information necessary to comply with such legal obligations and
                will notify you of such disclosures where legally permitted.
              </p>
            </section>

            {/* Opt Out */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                6. Opt Out
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You have the right to opt out of certain data collection and communication
                practices. You may:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  Unsubscribe from marketing communications by clicking the unsubscribe
                  link in any promotional email
                </li>
                <li>
                  Request the deletion of your personal data, subject to regulatory
                  retention requirements
                </li>
                <li>
                  Disable non-essential cookies through your browser settings or our
                  cookie preferences panel
                </li>
                <li>
                  Request access to, correction of, or restriction of processing of your
                  personal data
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Please note that opting out of certain data processing activities may
                limit your ability to use some features of our platform. To exercise any
                of these rights, please contact us at{" "}
                <span className="text-green-600">support@velixsync.com</span>.
              </p>
            </section>

            {/* Contact CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Questions?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about our Privacy Policy or how we handle your
                personal information, please reach out to our data protection team. We
                take your privacy seriously and are committed to addressing your concerns
                promptly.
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
