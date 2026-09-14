import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "End User License Agreement — VelixSync",
  description: "Read the VelixSync EULA governing your licence to use the VelixSync copy trading application, including permitted uses and restrictions.",
  alternates: { canonical: "https://velixsync.com/end-user-license-agreement" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "End User License Agreement — VelixSync",
    description: "The EULA governing your licence to use the VelixSync application.",
    url: "https://velixsync.com/end-user-license-agreement",
  },
};

export default function EndUserLicenseAgreement() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              End User License Agreement
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Last Updated: February 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Agreement Overview */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                1. Agreement Overview
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                This End User License Agreement (&ldquo;EULA&rdquo;) is a legal agreement between
                you (&ldquo;User,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and VelixSync (&ldquo;Company,&rdquo; &ldquo;we,&rdquo;
                &ldquo;us,&rdquo; or &ldquo;our&rdquo;) governing your use of the VelixSync software
                applications, including our web platform, mobile applications, desktop
                applications, APIs, and any related software and services (collectively,
                the &ldquo;Software&rdquo;).
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By downloading, installing, accessing, or using the Software, you
                acknowledge that you have read, understood, and agree to be bound by the
                terms and conditions of this EULA. If you do not agree to these terms,
                you must not download, install, or use the Software.
              </p>
            </section>

            {/* License Grant */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                2. License Grant
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Subject to the terms and conditions of this EULA, VelixSync grants you a
                limited, non-exclusive, non-transferable, revocable license to download,
                install, and use the Software on devices that you own or control, solely
                for your personal, non-commercial use in connection with the trading
                services provided by VelixSync. This license does not grant you any
                ownership rights in the Software and is subject to the restrictions set
                forth in this EULA.
              </p>
            </section>

            {/* License Restrictions */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                3. License Restrictions
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You agree not to, and you will not permit others to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  Copy, modify, adapt, translate, or create derivative works based on the
                  Software
                </li>
                <li>
                  Reverse engineer, disassemble, decompile, or attempt to derive the
                  source code of the Software
                </li>
                <li>
                  Rent, lease, lend, sell, sublicense, or distribute the Software to any
                  third party
                </li>
                <li>
                  Remove, alter, or obscure any proprietary notices, labels, or marks on
                  the Software
                </li>
                <li>
                  Use the Software for any purpose that is unlawful or prohibited by this
                  EULA
                </li>
                <li>
                  Use the Software to develop competing products or services
                </li>
                <li>
                  Circumvent or attempt to circumvent any security features or access
                  controls of the Software
                </li>
                <li>
                  Use automated systems, bots, or scripts to interact with the Software
                  without prior written authorization
                </li>
              </ul>
            </section>

            {/* Intellectual Property Rights */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                4. Intellectual Property Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The Software and all copies thereof are the intellectual property of
                VelixSync and are protected by copyright, trademark, patent, and other
                intellectual property laws. VelixSync retains all right, title, and
                interest in and to the Software, including all intellectual property
                rights therein. This EULA does not convey to you any rights of ownership
                in or related to the Software, and nothing in this EULA should be
                construed as granting any license or right to use any trademarks, service
                marks, or logos of VelixSync without prior written consent.
              </p>
            </section>

            {/* Software Updates and Modifications */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                5. Software Updates and Modifications
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync may from time to time release updates, patches, bug fixes,
                enhancements, or new versions of the Software. Such updates may be
                installed automatically or may require your action. You agree that
                VelixSync may update the Software at its sole discretion, and you
                acknowledge that this EULA applies to all such updates. VelixSync
                reserves the right to modify, suspend, or discontinue the Software or any
                part thereof at any time without prior notice.
              </p>
            </section>

            {/* Data Collection and Usage */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                6. Data Collection and Usage
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The Software may collect certain data from your device and usage,
                including but not limited to device information, usage statistics, crash
                reports, performance data, and log files. This data is collected to
                improve the Software, provide technical support, and enhance the user
                experience. All data collection is governed by our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-green-600 hover:underline"
                >
                  Privacy Policy
                </Link>
                , which forms an integral part of this EULA.
              </p>
            </section>

            {/* Third-Party Software and Services */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                7. Third-Party Software and Services
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The Software may include or integrate with third-party software
                components, libraries, or services. Such third-party components are
                subject to their own license agreements and terms of use. VelixSync does
                not assume any responsibility or liability for any third-party software or
                services, and your use of such components is at your own risk. The
                inclusion of third-party components does not imply endorsement by
                VelixSync.
              </p>
            </section>

            {/* Warranty Disclaimer */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                8. Warranty Disclaimer
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed uppercase font-medium">
                THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTY
                OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
                IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                TITLE, AND NON-INFRINGEMENT. VelixSync DOES NOT WARRANT THAT THE
                SOFTWARE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES
                OR OTHER HARMFUL COMPONENTS. VelixSync DOES NOT WARRANT THE ACCURACY,
                COMPLETENESS, OR RELIABILITY OF ANY CONTENT, DATA, OR INFORMATION
                PROVIDED THROUGH THE SOFTWARE. YOUR USE OF THE SOFTWARE IS AT YOUR SOLE
                RISK. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU
                FROM VelixSync SHALL CREATE ANY WARRANTY NOT EXPRESSLY STATED IN THIS
                EULA.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed uppercase font-medium">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
                VelixSync, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, OR AFFILIATES BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, DATA,
                USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN
                CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SOFTWARE, EVEN IF
                VelixSync HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                VelixSync&rsquo;S TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT
                OF OR RELATING TO THIS EULA OR THE SOFTWARE SHALL NOT EXCEED THE AMOUNT
                PAID BY YOU, IF ANY, FOR THE SOFTWARE DURING THE TWELVE (12) MONTHS
                PRECEDING THE CLAIM.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                10. Indemnification
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You agree to indemnify, defend, and hold harmless VelixSync, its
                directors, officers, employees, agents, and affiliates from and against
                any and all claims, damages, losses, liabilities, costs, and expenses
                (including reasonable attorneys&rsquo; fees) arising out of or in connection
                with your use of the Software, your violation of this EULA, or your
                violation of any applicable law or regulation. This indemnification
                obligation shall survive the termination of this EULA.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                11. Termination
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                This EULA is effective until terminated. VelixSync may terminate this
                EULA at any time, with or without cause and with or without notice. You
                may terminate this EULA at any time by uninstalling the Software and
                deleting all copies from your devices.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Upon termination, all rights granted to you under this EULA shall
                immediately cease, and you must stop using the Software and destroy all
                copies in your possession. Sections of this EULA that by their nature
                should survive termination, including intellectual property rights,
                warranty disclaimers, limitations of liability, and indemnification, shall
                continue in full force and effect.
              </p>
            </section>

            {/* Export Controls */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                12. Export Controls
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The Software may be subject to export control laws and regulations. You
                agree to comply with all applicable export and re-export control laws and
                regulations, including the Export Administration Regulations maintained by
                the U.S. Department of Commerce, trade and economic sanctions maintained
                by the Treasury Department&rsquo;s Office of Foreign Assets Control (OFAC), and
                the International Traffic in Arms Regulations maintained by the Department
                of State. You represent and warrant that you are not located in, under the
                control of, or a national or resident of any restricted country or on any
                government restricted party list.
              </p>
            </section>

            {/* Governing Law and Jurisdiction */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                13. Governing Law and Jurisdiction
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This EULA shall be governed by and construed in accordance with the laws
                of the jurisdiction in which the applicable VelixSync entity is
                incorporated, without regard to its conflict of law provisions. Any
                disputes arising out of or in connection with this EULA shall be submitted
                to the exclusive jurisdiction of the courts in the relevant jurisdiction.
                You consent to the personal jurisdiction of such courts and waive any
                objections to the exercise of jurisdiction by such courts.
              </p>
            </section>

            {/* Severability and Entire Agreement */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                14. Severability and Entire Agreement
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If any provision of this EULA is held to be invalid, illegal, or
                unenforceable by a court of competent jurisdiction, such provision shall
                be modified to the minimum extent necessary to make it valid and
                enforceable, and the remaining provisions shall continue in full force and
                effect.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This EULA constitutes the entire agreement between you and VelixSync
                with respect to the Software and supersedes all prior or contemporaneous
                communications, agreements, and understandings, whether oral or written,
                between you and VelixSync regarding the subject matter hereof. No
                amendment or modification of this EULA shall be binding unless made in
                writing and signed by an authorized representative of VelixSync.
              </p>
            </section>

            {/* Contact CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Questions?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about this End User License Agreement, please
                contact us at{" "}
                <span className="text-green-600">support@velixsync.com</span>. Our team
                is available to assist you with any inquiries regarding your rights and
                obligations under this agreement.
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
