"use client";

import React from "react";

const TrustSection = () => {
  const trustBadges = [
    {
      icon: <SocialIcon />,
      title: "Social",
      description: "More than 35 million users globally",
    },
    {
      icon: <ReliableIcon />,
      title: "Reliable",
      description: "A leader in the fintech space since 2007",
    },
    {
      icon: <SecuredIcon />,
      title: "Secured",
      description:
        "Utilising best security practices for client money and assets safety",
    },
    {
      icon: <GlobalIcon />,
      title: "Global",
      description: "Providing services around the world",
    },
  ];

  return (
    <section className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {trustBadges.map((badge, index) => (
            <TrustBadge key={index} {...badge} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TrustBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TrustBadge = ({ icon, title, description }: TrustBadgeProps) => (
  <div className="group flex flex-col items-center rounded-2xl border border-gray-200/80 dark:border-white/8 bg-white/70 dark:bg-white/3 backdrop-blur-sm p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-600/5 lg:p-8">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-500/10 text-primary transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>
    <h3 className="mb-1.5 text-sm font-bold lg:text-base">{title}</h3>
    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 lg:text-sm">
      {description}
    </p>
  </div>
);

// Icon Components
const SocialIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ReliableIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SecuredIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const GlobalIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default TrustSection;
