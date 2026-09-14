"use client";

import React, { useState } from "react";
import Image from "next/image";

const TeamSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const teamMembers = [
    {
      name: "James Carter",
      role: "Chief Executive Officer",
      image: "/team/jamescarter.jpg",
    },

    {
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      image: "/team/sarah.jpg",
    },
    {
      name: "Michael Roberts",
      role: "Chief Financial Officer",
      image: "/team/michael.jpg",
    },
    {
      name: "Emily Davis",
      role: "Head of Operations",
      image: "/team/emily.jpg",
    },
    {
      name: "David Kim",
      role: "Head of Security",
      image: "/team/david.jpg",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length,
    );
  };

  const currentMember = teamMembers[currentIndex];

  return (
    <section className="relative overflow-hidden bg-[#071a0e] py-8 lg:py-14">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-500 mb-3">
              Our People
            </p>
            <h2 className="mb-6 text-3xl font-bold text-white lg:text-4xl">
              Meet Our Team
            </h2>
            <p className="text-sm leading-relaxed text-gray-400 lg:text-base">
              Our team comprises industry veterans with extensive experience in
              fintech, stock trading, financial management, and cybersecurity.
              Together, we bring unparalleled expertise and a shared commitment
              to innovation and excellence.
            </p>
          </div>

          {/* Right - Carousel */}
          <div className="relative flex items-center justify-center">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-transparent text-white/70 transition-all hover:bg-white/10 hover:text-white hover:border-white/40"
              aria-label="Previous team member"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Team Member Card */}
            <div key={currentIndex} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="h-48 w-48 overflow-hidden rounded-full border-2 border-green-500/30 bg-gray-800 lg:h-56 lg:w-56">
                  <Image
                    src={currentMember.image}
                    alt={currentMember.name}
                    width={224}
                    height={224}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full border border-green-500/20 blur-sm" />
              </div>

              <h3 className="mb-1 text-xl font-bold text-white lg:text-2xl">
                {currentMember.name}
              </h3>
              <p className="text-sm text-green-500">
                {currentMember.role}
              </p>
            </div>

            <button
              onClick={nextSlide}
              className="absolute right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-transparent text-white/70 transition-all hover:bg-white/10 hover:text-white hover:border-white/40"
              aria-label="Next team member"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="mt-8 flex justify-center gap-2 lg:mt-12">
          {teamMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-green-600"
                  : "w-1.5 bg-white/20 hover:bg-white/30"
              }`}
              aria-label={`Go to team member ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
