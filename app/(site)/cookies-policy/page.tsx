import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "Cookies Policy — VelixSync",
  description: "Learn how VelixSync uses cookies and similar technologies to improve your experience on our copy trading platform.",
  alternates: { canonical: "https://velixsync.com/cookies-policy" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Cookies Policy — VelixSync",
    description: "How VelixSync uses cookies on our copy trading platform.",
    url: "https://velixsync.com/cookies-policy",
  },
};

export default function CookiesPolicy() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Cookies Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Last Updated: February 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This Cookies Policy explains how VelixSync uses cookies and similar
                tracking technologies when you visit our website and use our platform.
                By continuing to browse or use our services, you agree to the use of
                cookies as described in this policy. We encourage you to read this policy
                carefully to understand what cookies are, how we use them, and how you can
                manage your preferences.
              </p>
            </section>

            {/* What is a Cookie */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                2. What is a Cookie?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                A cookie is a small text file that is placed on your computer, smartphone,
                or other device when you visit a website. Cookies are widely used to make
                websites work more efficiently, provide a better user experience, and
                supply information to the owners of the site. Cookies can be
                &ldquo;persistent&rdquo; (remaining on your device until they expire or are deleted)
                or &ldquo;session-based&rdquo; (deleted when you close your browser). They can be set
                by the website you are visiting (&ldquo;first-party cookies&rdquo;) or by third
                parties whose content appears on the page (&ldquo;third-party cookies&rdquo;).
              </p>
            </section>

            {/* How to Delete and Block Cookies */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                3. How to Delete and Block Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings. You
                can set your browser to block or delete cookies, alert you when a cookie
                is being sent, or accept cookies only from certain websites. Please note
                that blocking or deleting cookies may impact your experience on our
                platform, and some features may not function properly.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For more information about cookies, including how to see what cookies have
                been set and how to manage and delete them, please visit{" "}
                <a
                  href="https://www.allaboutcookies.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  www.allaboutcookies.org
                </a>
                .
              </p>
            </section>

            {/* Your Consent */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                4. Your Consent
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By using the VelixSync website and platform, you consent to the placement
                of cookies on your device as described in this policy. When you first
                visit our website, you will be presented with a cookie consent banner
                that allows you to accept or customize your cookie preferences. You may
                withdraw your consent at any time by adjusting your browser settings or
                contacting us directly.
              </p>
            </section>

            {/* Session Cookies */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                5. Session Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Session cookies are temporary cookies that are stored on your device only
                during your browsing session. They are deleted automatically when you
                close your browser. VelixSync uses session cookies to maintain your login
                state, remember your preferences during a single session, ensure the
                security of your account while you are logged in, and enable the
                functionality of our trading platform in real time.
              </p>
            </section>

            {/* Persistent Cookies */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                6. Persistent Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Persistent cookies remain on your device for a set period of time or until
                you manually delete them. VelixSync uses persistent cookies to remember
                your login credentials (if you choose &ldquo;remember me&rdquo;), store your
                language and display preferences, analyze how you use our platform to
                improve our services, and deliver relevant content based on your interests
                and activity.
              </p>
            </section>

            {/* Third Party Cookies */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                7. Third Party Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In addition to our own cookies, VelixSync may allow third-party service
                providers to place cookies on your device. These third-party cookies are
                used for analytics services (e.g., Google Analytics) to help us
                understand how visitors interact with our website, advertising and
                marketing platforms to deliver targeted advertisements, social media
                plugins to enable sharing functionality, and fraud detection and security
                services. We do not control these third-party cookies, and their use is
                governed by the respective third party&rsquo;s privacy policy.
              </p>
            </section>

            {/* Use of Web Beacons */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                8. Use of Web Beacons
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In addition to cookies, VelixSync may use web beacons (also known as
                pixel tags, clear GIFs, or tracking pixels) on our website and in our
                emails. Web beacons are tiny, invisible graphic images that allow us to
                track how users interact with our website and emails. We use web beacons
                to measure the effectiveness of our marketing campaigns, determine which
                emails have been opened and which links have been clicked, and analyze
                traffic patterns and user behavior on our platform.
              </p>
            </section>

            {/* Opt Out */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                9. Opt Out
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you wish to opt out of non-essential cookies and tracking technologies,
                you can adjust your preferences through your browser settings or contact
                us directly. Please note that disabling certain cookies may affect the
                functionality of our platform.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To opt out or manage your cookie preferences, please email us at{" "}
                <span className="text-green-600">support@velixsync.com</span>. Our team
                will assist you with updating your preferences promptly.
              </p>
            </section>

            {/* Contact CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Questions?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about our Cookies Policy or how we use tracking
                technologies, please get in touch with our support team. We are happy to
                provide further clarification on any aspect of this policy.
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
