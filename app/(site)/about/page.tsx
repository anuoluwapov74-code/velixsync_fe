import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About VelixSync",
  description: "Learn about VelixSync — our mission to democratise copy trading for futures, options, and contracts. Meet the team building precision, transparency, and zero-commission trading.",
  alternates: { canonical: "https://velixsync.com/about" },
  openGraph: {
    title: "About VelixSync",
    description: "Our mission to democratise copy trading. Meet the team behind VelixSync.",
    url: "https://velixsync.com/about",
  },
};

export default function AboutPage() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About VelixSync
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Democratizing copy trading for everyone
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Our Story */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                VelixSync was founded with a clear mission: to make
                professional-grade copy trading accessible to everyone. We
                believe that every investor, regardless of experience level,
                should have the ability to mirror the strategies of
                top-performing traders with precision, flexibility, and
                transparency.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                From our early days, we set out to build a platform that bridges
                the gap between experienced traders and those looking to learn
                and grow their portfolios. Today, VelixSync serves a global
                community of traders across futures, options, and contracts.
              </p>
            </section>

            {/* Story images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/images/about_1.jpg"
                  alt="VelixSync team in discussion"
                  width={600}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/images/about_2.jpg"
                  alt="VelixSync annual report presentation"
                  width={600}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Our Mission */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our mission is to empower individuals worldwide to participate
                in financial markets by providing intuitive copy trading tools,
                real-time trade mirroring, and a transparent community of
                traders. We are committed to removing barriers to entry and
                ensuring that every user has the resources they need to make
                informed investment decisions.
              </p>
            </section>

            {/* Our Values */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Transparency
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    We believe in full visibility. Every trader&apos;s
                    performance, fees, and risk metrics are openly available so
                    you can make informed decisions.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Innovation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    From AutoGuard&trade; risk protection to real-time trade
                    mirroring, we continuously build cutting-edge tools that keep
                    you ahead.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Security
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Your funds and data are protected with enterprise-grade
                    encryption, segregated accounts, and multi-layered security
                    protocols.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Community
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    We foster a global network of traders who learn from each
                    other, share strategies, and grow together.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Team */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Team
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Behind VelixSync is a diverse team of financial professionals,
                technologists, and compliance experts united by a shared passion
                for making copy trading better. Our team brings decades of
                combined experience in financial services, fintech development,
                and regulatory compliance.
              </p>
            </section>

            {/* Team images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/images/about_3.jpg"
                  alt="VelixSync team collaborating"
                  width={600}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/images/about_4.jpg"
                  alt="VelixSync team meeting"
                  width={600}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Global Presence */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Global Presence
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                VelixSync operates under strict regulatory oversight across
                multiple jurisdictions, ensuring the highest standards of
                compliance and client protection:
              </p>
              <ul className="space-y-4 ml-6">
                <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Europe
                  </span>{" "}
                  &mdash; VelixSync (Europe) Ltd., authorised and regulated by
                  the Cyprus Securities Exchange Commission (CySEC) under
                  license #109/10.
                </li>
                <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    United Kingdom
                  </span>{" "}
                  &mdash; VelixSync (UK) Ltd., authorised and regulated by the
                  Financial Conduct Authority (FCA) under FRN 583263.
                </li>
                <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    United States
                  </span>{" "}
                  &mdash; VelixSync (USA) Ltd., authorised and regulated by
                  SEC# 801-69167; CRD # 147179.
                </li>
                <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Middle East
                  </span>{" "}
                  &mdash; VelixSync (ME) Limited, licensed by ADGM&apos;s
                  Financial Services Regulatory Authority (FSRA) under
                  Permission Number 220073.
                </li>
              </ul>
            </section>

            {/* Contact CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Have questions about VelixSync? We&apos;d love to hear from
                you. Reach out to our team at{" "}
                <a
                  href="mailto:support@velixsync.com"
                  className="text-green-600 hover:text-green-700 underline"
                >
                  support@velixsync.com
                </a>{" "}
                or start a conversation through our live chat.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-green-600/30 hover:shadow-green-600/50"
                >
                  Get Started
                </Link>
                <Link
                  href="/"
                  className="inline-block bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
                >
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
