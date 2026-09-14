import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "Declaration of Consent — VelixSync",
  description: "VelixSync's declaration of consent document covering data processing, marketing communications, and user rights under applicable privacy regulations.",
  alternates: { canonical: "https://velixsync.com/declaration-of-consent" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Declaration of Consent — VelixSync",
    description: "VelixSync consent document for data processing and user rights.",
    url: "https://velixsync.com/declaration-of-consent",
  },
};

export default function DeclarationOfConsent() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Declaration of Consent
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Last Updated: February 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Your Consent Matters */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                1. Your Consent Matters
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                At VelixSync, we believe in transparency and informed consent. This
                Declaration of Consent outlines the specific consents you provide when
                you register for an account, use our services, and interact with our
                platform. By using VelixSync, you acknowledge and agree to the consents
                described below. We encourage you to read this document carefully and
                contact us if you have any questions.
              </p>
            </section>

            {/* Consent to Terms and Policies */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                2. Consent to Terms and Policies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By creating an account with VelixSync, you confirm that you have read,
                understood, and agree to be bound by our{" "}
                <Link
                  href="/terms-of-service"
                  className="text-green-600 hover:underline"
                >
                  Terms of Service
                </Link>
                ,{" "}
                <Link
                  href="/privacy-policy"
                  className="text-green-600 hover:underline"
                >
                  Privacy Policy
                </Link>
                ,{" "}
                <Link
                  href="/cookies-policy"
                  className="text-green-600 hover:underline"
                >
                  Cookies Policy
                </Link>
                ,{" "}
                <Link
                  href="/risk-disclaimer"
                  className="text-green-600 hover:underline"
                >
                  Risk Disclaimer
                </Link>
                , and all other applicable policies and agreements. You acknowledge that
                these documents form a legally binding agreement between you and
                VelixSync.
              </p>
            </section>

            {/* Consent to Data Processing */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                3. Consent to Data Processing
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You consent to the collection, processing, storage, and use of your
                personal data by VelixSync as described in our Privacy Policy. This
                includes but is not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  Processing your personal information for account creation and
                  management
                </li>
                <li>
                  Using your data to provide, maintain, and improve our services
                </li>
                <li>
                  Sharing your data with regulated third parties as necessary to deliver
                  our services
                </li>
                <li>
                  Transferring your data internationally where required for service
                  delivery or regulatory compliance
                </li>
                <li>
                  Retaining your data for the periods required by applicable laws and
                  regulations
                </li>
              </ul>
            </section>

            {/* Consent to Communications */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                4. Consent to Communications
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You consent to receiving communications from VelixSync, including but not
                limited to account notifications, transaction confirmations, security
                alerts, service updates, regulatory notices, and marketing communications.
                You may opt out of non-essential marketing communications at any time by
                following the unsubscribe instructions in our emails or by contacting our
                support team. Please note that certain transactional and regulatory
                communications cannot be opted out of while your account remains active.
              </p>
            </section>

            {/* Electronic Signatures and Records */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                5. Electronic Signatures and Records
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You consent to the use of electronic signatures, records, and
                communications in connection with your account and transactions with
                VelixSync. You agree that electronic signatures and records shall have
                the same legal effect, validity, and enforceability as manually executed
                signatures and paper-based records. You also agree to receive all account
                statements, confirmations, disclosures, and other communications in
                electronic format.
              </p>
            </section>

            {/* Consent to Cookies and Tracking */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                6. Consent to Cookies and Tracking
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You consent to the use of cookies and similar tracking technologies as
                described in our{" "}
                <Link
                  href="/cookies-policy"
                  className="text-green-600 hover:underline"
                >
                  Cookies Policy
                </Link>
                . This includes essential cookies required for the operation of our
                platform, analytical cookies that help us improve our services, and
                marketing cookies that enable us to deliver relevant content. You may
                manage your cookie preferences through your browser settings.
              </p>
            </section>

            {/* Consent to Identity Verification */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                7. Consent to Identity Verification
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You consent to VelixSync conducting identity verification checks as
                required by anti-money laundering (AML) and know-your-customer (KYC)
                regulations. This may include verifying your identity through
                government-issued identification documents, conducting background checks
                through third-party verification services, verifying your source of funds
                and wealth, and performing ongoing monitoring of your account activity for
                suspicious transactions. You agree to provide all requested documentation
                promptly and accurately.
              </p>
            </section>

            {/* Consent to Recording */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                8. Consent to Recording
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You consent to VelixSync recording and monitoring telephone
                conversations, electronic communications, and other interactions between
                you and VelixSync. These recordings may be used to verify instructions,
                resolve disputes, ensure compliance with regulatory requirements, improve
                the quality of our services, and serve as evidence in legal or regulatory
                proceedings. Recordings will be retained in accordance with applicable
                regulatory requirements.
              </p>
            </section>

            {/* Withdrawal of Consent */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                9. Withdrawal of Consent
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You have the right to withdraw your consent at any time, subject to legal
                and contractual restrictions. Please note that withdrawing certain
                consents may affect our ability to provide services to you and may result
                in the closure of your account. To withdraw your consent, please contact
                our support team at{" "}
                <span className="text-green-600">support@velixsync.com</span>. We will
                process your request in accordance with applicable laws and inform you of
                any consequences of the withdrawal.
              </p>
            </section>

            {/* Consent for Minors */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                10. Consent for Minors
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync services are only available to individuals who are at least 18
                years of age (or the age of legal majority in your jurisdiction). By
                creating an account, you confirm that you meet this age requirement. If we
                become aware that we have collected personal information from a minor
                without appropriate parental or guardian consent, we will take steps to
                delete such information and close the associated account.
              </p>
            </section>

            {/* Updates to This Declaration */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                11. Updates to This Declaration
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync may update this Declaration of Consent from time to time to
                reflect changes in our practices, services, or legal requirements. We will
                notify you of any material changes by posting the updated declaration on
                our website and, where appropriate, by sending you a notification. Your
                continued use of our services after any changes constitutes your
                acceptance of the updated declaration.
              </p>
            </section>

            {/* Contact CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Questions?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Declaration of Consent or wish to
                exercise any of your rights, please contact our support team. We are
                committed to ensuring that your consent is informed and that your rights
                are fully respected.
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
