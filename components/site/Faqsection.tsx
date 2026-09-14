"use client";

import React, { useState } from "react";

const FAQSection = () => {
  const faqs = [
    {
      question: "Do I need trading experience?",
      answer:
        "No trading experience is required. Our platform is designed for both beginners and experienced traders. You can start copying expert traders immediately and learn as you go.",
    },
    {
      question: "Can I stop copying anytime?",
      answer:
        "Yes, you have complete control. You can start or stop copying any trader at any time with just one click. There are no lock-in periods or penalties for stopping.",
    },
    {
      question: "Is my money safe?",
      answer:
        "Your funds are held in top-tier institutions and are completely secure. We use bank-level encryption and security measures. Your money remains in your own brokerage account, and we never have direct access to your funds.",
    },
    {
      question: "What is the minimum investment?",
      answer:
        "The minimum investment depends on the Expert Trader you choose to copy and their trading requirements. While you can start with as little as $5,000, we generally recommend investing at least $25,000 or more to achieve better diversification and maximize the strategy's potential.",
    },
  ];

  return (
    <section className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Your Questions, Answered
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
            Got questions about how copy trading works? We've compiled answers
            to the most frequently asked questions.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group rounded-2xl border border-gray-200/80 dark:border-white/8 bg-white/70 dark:bg-white/3 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-600/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left transition-all"
      >
        <span
          className={`pr-4 text-sm font-semibold transition-colors lg:text-base ${isOpen ? "text-primary" : ""}`}
        >
          {question}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen
              ? "bg-primary text-white rotate-45 scale-110"
              : "bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-gray-400 group-hover:bg-green-50 dark:group-hover:bg-green-600/10"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 dark:border-white/6 px-5 pb-5 pt-4">
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
