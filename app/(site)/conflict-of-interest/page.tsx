import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "Conflict of Interest Policy — VelixSync",
  description: "VelixSync's conflict of interest policy outlines how we identify and manage conflicts to protect our users and maintain platform integrity.",
  alternates: { canonical: "https://velixsync.com/conflict-of-interest" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Conflict of Interest Policy — VelixSync",
    description: "How VelixSync identifies and manages conflicts of interest.",
    url: "https://velixsync.com/conflict-of-interest",
  },
};

export default function ConflictOfInterest() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Conflict of Interest Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Last Updated: February 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Our Commitment to Fair Practice */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                1. Our Commitment to Fair Practice
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync is committed to maintaining the highest standards of integrity
                and fairness in all our business dealings. We recognize that conflicts of
                interest may arise in the normal course of our business and have
                established this policy to identify, prevent, and manage such conflicts
                effectively. Our goal is to ensure that the interests of our clients are
                always protected and that we operate in a transparent and ethical manner.
              </p>
            </section>

            {/* What is a Conflict of Interest */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                2. What is a Conflict of Interest?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                A conflict of interest arises when the interests of VelixSync, its
                employees, or its affiliates may conflict with the interests of our
                clients. Conflicts can take many forms, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  <span className="font-semibold">Financial Interests:</span> Where
                  VelixSync or its employees may benefit financially at the expense of a
                  client
                </li>
                <li>
                  <span className="font-semibold">Personal Relationships:</span> Where
                  personal connections between employees and clients may influence
                  decision-making
                </li>
                <li>
                  <span className="font-semibold">Competing Interests:</span> Where
                  VelixSync provides services to multiple clients whose interests may
                  conflict with one another
                </li>
                <li>
                  <span className="font-semibold">Third-Party Arrangements:</span> Where
                  relationships with third parties may create incentives that conflict with
                  client interests
                </li>
              </ul>
            </section>

            {/* Identifying Conflicts of Interest */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                3. Identifying Conflicts of Interest
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync maintains robust processes for identifying potential and actual
                conflicts of interest. All employees are required to be vigilant in
                recognizing situations where conflicts may arise and to report them
                promptly to the compliance department. We conduct regular assessments of
                our business activities, organizational structure, and service offerings
                to proactively identify areas where conflicts may occur.
              </p>
            </section>

            {/* Managing Conflicts of Interest */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                4. Managing Conflicts of Interest
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                When conflicts of interest are identified, VelixSync employs a range of
                measures to manage and mitigate them:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  <span className="font-semibold">Disclosure:</span> We disclose
                  conflicts of interest to affected clients in a clear and transparent
                  manner, enabling them to make informed decisions.
                </li>
                <li>
                  <span className="font-semibold">Information Barriers:</span> We
                  implement information barriers (also known as &ldquo;Chinese walls&rdquo;) to
                  prevent the inappropriate sharing of confidential information between
                  different departments or business units.
                </li>
                <li>
                  <span className="font-semibold">Segregation of Duties:</span> We
                  segregate functions and responsibilities where necessary to prevent any
                  individual or team from having undue influence over client outcomes.
                </li>
                <li>
                  <span className="font-semibold">Declining to Act:</span> In cases where
                  a conflict cannot be adequately managed, VelixSync may decline to
                  provide services to avoid potential harm to client interests.
                </li>
              </ul>
            </section>

            {/* Order Execution and Best Execution */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                5. Order Execution and Best Execution
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync is committed to achieving the best possible result for our
                clients when executing orders. Our order execution policy is designed to
                ensure that we take all reasonable steps to obtain the best possible
                execution for our clients, taking into account factors such as price,
                costs, speed, likelihood of execution and settlement, order size, and
                nature. We regularly monitor the effectiveness of our execution
                arrangements and make improvements as needed.
              </p>
            </section>

            {/* Employee Trading and Personal Account Dealing */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                6. Employee Trading and Personal Account Dealing
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                All VelixSync employees are subject to strict personal account dealing
                policies. Employees must obtain prior approval before executing personal
                trades in financial instruments and must disclose all personal trading
                accounts. These measures are designed to prevent employees from trading
                ahead of client orders (front-running) or otherwise exploiting their
                position to the detriment of clients.
              </p>
            </section>

            {/* Inducements and Remuneration */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                7. Inducements and Remuneration
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync has policies in place to ensure that remuneration and incentive
                structures do not create conflicts that could adversely affect the quality
                of service provided to clients. We do not accept or pay inducements that
                would conflict with our duty to act in the best interests of our clients.
                Any fees, commissions, or non-monetary benefits received or paid to third
                parties are disclosed to clients and are designed to enhance the quality
                of the service provided.
              </p>
            </section>

            {/* Third-Party Relationships */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                8. Third-Party Relationships
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync maintains various relationships with third-party service
                providers, liquidity providers, and business partners. We carefully manage
                these relationships to ensure they do not create conflicts of interest
                that could disadvantage our clients. All third-party arrangements are
                subject to due diligence and ongoing monitoring by our compliance team.
              </p>
            </section>

            {/* Monitoring and Review */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                9. Monitoring and Review
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync regularly monitors and reviews the effectiveness of this
                Conflict of Interest Policy. Our compliance department conducts periodic
                reviews of our business activities, employee conduct, and organizational
                structure to identify new or emerging conflicts. This policy is reviewed
                and updated at least annually to reflect changes in our business,
                regulatory requirements, and industry best practices.
              </p>
            </section>

            {/* Record Keeping */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                10. Record Keeping
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VelixSync maintains comprehensive records of all identified conflicts of
                interest, the measures taken to manage them, and any disclosures made to
                clients. These records are retained in accordance with applicable
                regulatory requirements and are available for inspection by relevant
                regulatory authorities upon request.
              </p>
            </section>

            {/* Disclosure to Clients */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                11. Disclosure to Clients
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Where VelixSync identifies a conflict of interest that cannot be
                adequately managed through our internal procedures, we will disclose the
                nature and source of the conflict to affected clients before undertaking
                any business with them. This disclosure will be made in sufficient detail
                to enable clients to make an informed decision about whether to proceed
                with the relevant service or transaction.
              </p>
            </section>

            {/* Reporting Concerns and Complaints */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                12. Reporting Concerns and Complaints
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you believe that a conflict of interest has adversely affected you, or
                if you have any concerns about how VelixSync manages conflicts of
                interest, we encourage you to report your concerns to our compliance
                department. All reports will be investigated promptly and thoroughly, and
                appropriate corrective action will be taken where necessary. You may also
                file a complaint through our formal complaints process.
              </p>
            </section>

            {/* Regulatory Compliance */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                13. Regulatory Compliance
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This Conflict of Interest Policy has been developed in accordance with
                applicable regulatory requirements, including the Markets in Financial
                Instruments Directive (MiFID II), the rules of the Financial Conduct
                Authority (FCA), the Cyprus Securities and Exchange Commission (CySEC),
                the Securities and Exchange Commission (SEC), and the Abu Dhabi Global
                Market Financial Services Regulatory Authority (ADGM FSRA). VelixSync is
                committed to full compliance with all regulatory obligations relating to
                the management of conflicts of interest.
              </p>
            </section>

            {/* Contact CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Questions?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions regarding our Conflict of Interest Policy or
                wish to report a concern, please contact our compliance department. We are
                committed to maintaining the highest standards of transparency and
                fairness in all our dealings with clients.
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
