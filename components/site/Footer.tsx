"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section with Logo and Links */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Logo and App Downloads */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <span className="text-2xl font-bold">
                <span className="text-[var(--primary)]">Velix</span>Sync
              </span>
            </div>
            <p className="mb-4 text-sm text-[var(--foreground-muted)]">
              Copy trade with VelixSync
            </p>
        {/* Google and Apple store here */}
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-9">
            <div className="space-y-6">
              <FooterSection
                title="LEGALS"
                links={[
                  { label: "Terms Of Service", href: "/terms-of-service" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Cookies Policy", href: "/cookies-policy" },
                  { label: "Risk Disclaimer", href: "/risk-disclaimer" },
                  { label: "Conflict of Interest Policy", href: "/conflict-of-interest" },
                  { label: "Declaration of Consent", href: "/declaration-of-consent" },
                  { label: "End-User License Agreement", href: "/end-user-license-agreement" },
                ]}
              />
              <FooterSection
                title="FEATURES"
                links={[
                  { label: "AutoGuard TM", href: "/autoguard" },
                ]}
              />
              <FooterSection
                title="RESOURCES"
                links={[
                  { label: "Affiliate Guide", href: "/affiliate-guide" },
                  { label: "Leader Guide", href: "/leader-guide" },
                  { label: "User Guide", href: "/user-guide" },
                  { label: "FAQ", href: "/faq" },
                ]}
              />
              <FooterSection
                title="ABOUT US"
                links={[
                  { label: "Company", href: "/about" },
                ]}
              />
              <FooterSection
                title="PARTNERSHIPS"
                links={[
                  { label: "Leader", href: "/leader" },
                  { label: "Affiliate", href: "/affiliate" },
                  { label: "Broker", href: "/broker" },
                ]}
              />
              <FooterSection
                title="CONTACT"
                links={[
                  { label: "+1 (929) 512-0241", href: "#" },
                  { label: "support@velixsync.com", href: "mailto:support@velixsync.com" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 border-t border-[var(--border)] pt-8">
          <div className="space-y-4 text-xs leading-relaxed text-[var(--foreground-muted)]">
            <p>
              Disclaimer: VELIXSYNC ( CRD # 147179/SEC#:801-69167 ), a
              Financial Services Company authorised and regulated by the
              Securities and Exchange Commission (SEC) and registered with the
              Financial Industry Regulatory Authority (FINRA) under the above
              referenced registration numbers. VELIXSYNC is a duly
              incorporated limited liability company operating as a licensed
              investment and social trading platform, providing access to global
              financial markets including equities, commodities, currencies,
              indices, and digital assets. VELIXSYNC operates across
              multiple jurisdictions in accordance with applicable securities
              laws and financial services regulations, offering its products and
              services to eligible clients in jurisdictions where such services
              are permitted by law. The company maintains its principal place of
              business in the United States and operates internationally through
              its affiliates and correspondent entities, all of which are
              subject to the oversight and regulatory framework established by
              the relevant authorities in their respective regions.
              VELIXSYNC is committed to full regulatory compliance and the
              protection of its clients&apos; interests at all times. Clients who
              are tax residents of certain jurisdictions may be subject to local
              income taxes on income (profits) and assets in accordance with
              applicable tax laws in their country of residence.
            </p>
            <p>
              Past performance is not an indication of future results. You
              should seek advice from an independent and suitably licensed
              financial advisor and ensure that you have the risk appetite,
              relevant experience and knowledge before you decide to trade.
              Under no circumstances shall VELIXSYNC have any liability to any
              person or entity for any loss or damage in whole or part caused
              by, resulting from, or relating to any transactions related to
              Stock and options investments are risky and do not benefit from
              the protections available to clients receiving MiFID regulated
              investment services for dispute resolution. Trading with
              VELIXSYNC by following and/or copying or replicating the trades
              of other traders involves a high level of risks, even when
              following and/or copying or replicating the top-performing
              traders. Such risks include the risk that you may be
              following/copying the trading decisions of possibly inexperienced
              or unprofessional traders, or traders whose ultimate purpose or
              intention, or financial status may differ from yours. Past
              performance of a VELIXSYNC Community Member is not a reliable
              indicator of his future performance. Content on VELIXSYNC&apos;s
              social trading platform is generated by members of its community
              and does not contain advice or recommendations by or on behalf of
              VELIXSYNC - Your Social Investment Network.
            </p>
            <p className="pt-4">
              Copyright &copy; 2006-2026 VELIXSYNC - Your Social Investment Network,
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer Section Component
interface FooterSectionProps {
  title: string;
  links: FooterLink[];
}

const FooterSection = ({ title, links }: FooterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)] pb-4 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-wider">
          {title}
        </span>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded border border-[var(--foreground)] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {/* Links */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="mt-2 space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--primary)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Footer;
