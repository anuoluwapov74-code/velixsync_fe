"use client";

import { useState } from "react";

type ContentBlock =
  | { type: "text"; content: string }
  | { type: "list"; items: string[] }
  | { type: "ordered"; items: string[] };

interface FAQEntry {
  question: string;
  content: ContentBlock[];
}

interface FAQCategory {
  id: string;
  label: string;
  items: FAQEntry[];
}

export interface FAQMajorProps {
  showHeader?: boolean;
}

const categories: FAQCategory[] = [
  {
    id: "general",
    label: "General",
    items: [
      {
        question: "What are digital options?",
        content: [
          { type: "text", content: "Option is a derivative financial instrument based on any underlying asset, such as a stock, a currency pair, oil, etc." },
          { type: "text", content: "Digital option - a non-standard option that is used to make a profit on price movements of such assets for a certain period of time." },
          { type: "text", content: "A digital option, depending on the terms agreed upon by the parties to the transaction, at a time determined by the parties, brings a fixed income (the difference between the trade income and the price of the asset) or loss (in the amount of the value of the asset)." },
          { type: "text", content: "Since the digital option is purchased in advance at a fixed price, the size of the profit, as well as the size of the potential loss, are known even before the trade." },
          { type: "text", content: "Another feature of these deals is the time limit. Any option has its own term (expiration time or conclusion time)." },
          { type: "text", content: "Regardless of the degree of change in the price of the underlying asset, in case of winning an option, a fixed payment is always made. Your risks are limited only by the amount for which the option is acquired." },
        ],
      },
      {
        question: "What are the varieties of digital options?",
        content: [
          { type: "text", content: "Making an option trade, you must choose the underlying asset that will underlie the option. Your forecast will be carried out on this asset." },
          { type: "text", content: "Simply, buying a digital contract, you are actually betting on the price movement of such an underlying asset." },
          { type: "text", content: 'An underlying asset is an "item" whose price is taken into account when concluding a trade. As the underlying asset of digital options, the most sought-after products on the markets usually act. There are four types of them:' },
          {
            type: "list",
            items: [
              "Securities (shares of world companies)",
              "Currency pairs (EUR / USD, GBP / USD, etc.)",
              "Raw materials and precious metals (oil, gold, etc.)",
              "Indices (S&P 500, Dow, dollar index, etc.)",
            ],
          },
          { type: "text", content: "There is no such thing as a universal underlying asset. When choosing it, you can only use your own knowledge, intuition, analytical info, and market analysis for that financial instrument." },
        ],
      },
      {
        question: "What is the gist of digital options trading?",
        content: [
          { type: "text", content: "A digital option is the simplest type of derivative financial instrument. To profit, you don't need to predict the exact price—just whether it will go up or down." },
          { type: "text", content: "The principle is to decide if the price will increase or decrease by the time the contract executes." },
          { type: "text", content: "It doesn't matter if the price goes up or down by one point or one hundred; the key is predicting the direction." },
          { type: "text", content: "If your prognosis is correct, you get a fixed income." },
        ],
      },
      {
        question: "How to learn quickly how to make money in the digital options market?",
        content: [
          { type: "text", content: "To profit, you need to correctly predict the price direction (up or down). For stable income:" },
          {
            type: "list",
            items: [
              "Develop your own trading strategies and follow them.",
              "Diversify your risks.",
            ],
          },
          { type: "text", content: "To create strategies and find diversification, monitor the market, study analytics and stats from various sources like expert opinions, internet resources, and the Company website." },
        ],
      },
      {
        question: "At what expense does the Company pay profit to the Client in case of successful trade?",
        content: [
          { type: "text", content: "The Company earns with clients. It benefits from a high share of successful trades due to a percentage of payments based on the strategy chosen by the Client." },
          { type: "text", content: "Additionally, all trades contribute to the Company's trading volume passed to brokers or exchanges, which feed into the liquidity pool and help improve market liquidity." },
        ],
      },
      {
        question: "Can I close my account? How to do it?",
        content: [
          { type: "text", content: 'You can delete your account in your Individual Account by clicking on the "Delete Account" button at the bottom of the profile page.' },
        ],
      },
      {
        question: "What is the expiration period of a trade?",
        content: [
          { type: "text", content: "The expiration period is the time after which the trade is completed and the result is summed up." },
          { type: "text", content: "When concluding a trade, you choose the execution time (e.g., 1 minute, 2 hours, a month, etc.)." },
        ],
      },
      {
        question: "What is a trading platform and why is it needed?",
        content: [
          { type: "text", content: "A trading platform is a software complex that lets Clients perform trades using various financial instruments. It also provides access to real-time quotes, market data, and Company actions." },
        ],
      },
      {
        question: "What are the possible results of the placed trades?",
        content: [
          { type: "text", content: "There are three possible outcomes in digital options:" },
          {
            type: "list",
            items: [
              "Your forecast is correct → you earn income.",
              "Your forecast is wrong → you lose only your investment.",
              "The outcome is zero (no price change) → you get your investment back.",
            ],
          },
        ],
      },
      {
        question: "Is the download of the program to a computer or smartphone required?",
        content: [
          { type: "text", content: "No, it's not required. You just need to register on the Company's website and open an individual account." },
        ],
      },
      {
        question: "In what currency is the Client's account opened? Can I change the currency of the Client's account?",
        content: [
          { type: "text", content: "By default, a trading account is opened in US dollars." },
          { type: "text", content: "However, you can change the currency anytime in your profile. Available currency options are listed there." },
        ],
      },
    ],
  },
  {
    id: "financial",
    label: "Financial",
    items: [
      {
        question: "What determines profit size?",
        content: [
          { type: "text", content: "There are several factors that affect the size of your profit:" },
          {
            type: "list",
            items: [
              "The liquidity of the asset (the more in demand, the more profit)",
              "The time of the trade (morning vs. afternoon liquidity)",
              "Brokerage company tariffs",
              "Market changes (e.g., economic events, asset changes)",
            ],
          },
        ],
      },
      {
        question: "How can I calculate the profit for a trade?",
        content: [
          { type: "text", content: "You do not have to calculate the profit yourself. Digital options offer a fixed profit per transaction." },
          { type: "text", content: "Example: A correct prediction may earn 90% of the value, regardless of how much the price changes." },
          { type: "text", content: "Steps to determine profit:" },
          {
            type: "ordered",
            items: [
              "Choose the asset",
              "Enter the price of the option",
              "Set the trade time — the platform calculates the exact percentage",
            ],
          },
          { type: "text", content: "Profit can be up to 98% of the investment. It's fixed upon acquisition, avoiding percentage drops later. Your balance updates automatically after the trade closes." },
        ],
      },
      {
        question: "What is the minimum deposit amount?",
        content: [
          { type: "text", content: "You can start trading with a small amount. The minimum deposit is 5000 US dollars." },
        ],
      },
      {
        question: "How to withdraw money from the account?",
        content: [
          { type: "text", content: "Withdrawals are made through your individual account using the same method as your deposit." },
          { type: "text", content: "Example: If you deposited via Visa, withdrawals will also use Visa." },
          { type: "text", content: "Large withdrawals may require verification. It's important to register the account in your name for proof." },
        ],
      },
      {
        question: "Is there any fee for depositing or withdrawing funds?",
        content: [
          { type: "text", content: "The company charges a 5% brokerage fee plus a 15% commission if mirroring an expert (charged after trading ends). Payment systems may also apply conversion fees." },
        ],
      },
      {
        question: "Do I need to deposit the trading platform account and how often?",
        content: [
          { type: "text", content: "To trade with real funds, yes, a deposit is required." },
          { type: "text", content: "You can also use a demo account for practice, strategy testing, and learning — no deposit needed for that." },
        ],
      },
      {
        question: "How can I deposit?",
        content: [
          {
            type: "ordered",
            items: [
              'Click the green "Deposit" button',
              "Select a deposit method",
              "Choose the deposit currency",
              "Enter the amount",
              "Fill in the payment details",
              "Confirm and make the payment",
            ],
          },
        ],
      },
      {
        question: "How long does it take to withdraw funds?",
        content: [
          { type: "text", content: "Withdrawals typically take 1–5 days depending on request volume. The company aims to process on the same day." },
        ],
      },
      {
        question: "What is the minimum withdrawal amount?",
        content: [
          { type: "text", content: "Minimum withdrawal is 10 USD for most systems. For cryptocurrencies, it's 50 USD or more (e.g., Bitcoin)." },
        ],
      },
      {
        question: "Do I need to provide documents to withdraw?",
        content: [
          { type: "text", content: "Usually not, but the Company may request ID documents to prevent fraud or illegal activity. The process is simple and requires minimal documentation." },
        ],
      },
    ],
  },
  {
    id: "registration",
    label: "Registration & Verification",
    items: [
      {
        question: "What data is required to register on the Company website?",
        content: [
          { type: "text", content: "To register, you need to provide your name (in English), email address, phone number (with code), and a secure password. Once registered, you can fund your account to start trading." },
        ],
      },
      {
        question: "Can I use fake or someone else's information when registering?",
        content: [
          { type: "text", content: "No. You must enter accurate personal data. Mismatched info may lead to identity checks or account blocking." },
        ],
      },
      {
        question: "How do I know if I need to verify my account?",
        content: [
          { type: "text", content: "If verification is required, you'll be notified via email or SMS. Make sure your contact details are up to date." },
        ],
      },
      {
        question: "How long does the verification process take?",
        content: [
          { type: "text", content: "The verification process takes up to 5 business days after you submit the required documents." },
        ],
      },
      {
        question: "I made a mistake entering my account data. How can I fix it?",
        content: [
          { type: "text", content: "Contact the technical support team via the Company's website to correct your account information." },
        ],
      },
      {
        question: "What is account verification?",
        content: [
          { type: "text", content: "Verification confirms your identity using documents such as a passport photo page, a selfie, or proof of address. Additional documents may be requested if needed." },
        ],
      },
      {
        question: "How will I know I've passed verification?",
        content: [
          { type: "text", content: "You'll receive an email and/or SMS notification once your account has been successfully verified and ready to use." },
        ],
      },
    ],
  },
];

// ── Item ──────────────────────────────────────────────────────────────────────

interface FAQItemProps {
  question: string;
  content: ContentBlock[];
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem = ({ question, content, isOpen, onToggle }: FAQItemProps) => (
  <div className="group rounded-2xl border border-gray-200/80 dark:border-white/8 bg-white/70 dark:bg-white/3 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-600/5">
    <button
      onClick={onToggle}
      className="flex w-full items-start justify-between gap-4 p-5 text-left"
    >
      <span className={`text-sm font-semibold leading-snug transition-colors lg:text-base ${isOpen ? "text-primary" : ""}`}>
        {question}
      </span>
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
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

    <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}>
      <div className="space-y-3 border-t border-gray-100 dark:border-white/6 px-5 pb-5 pt-4">
        {content.map((block, i) => {
          if (block.type === "text") {
            return (
              <p key={i} className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {block.content}
              </p>
            );
          }
          if (block.type === "list") {
            return (
              <ul key={i} className="ml-4 space-y-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          if (block.type === "ordered") {
            return (
              <ol key={i} className="ml-4 space-y-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-600/20 text-xs font-bold text-green-700 dark:text-green-400">
                      {j + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            );
          }
        })}
      </div>
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────

const FAQMajor = ({ showHeader = true }: FAQMajorProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [openItem, setOpenItem] = useState<number | null>(null);

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setOpenItem(null);
  };

  const currentItems = categories[activeTab].items;

  return (
    <section className="py-8 lg:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {showHeader && (
          <div className="mb-12 text-center lg:mb-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              FAQ
            </p>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
              Everything you need to know about trading, accounts, deposits, and verification.
            </p>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => handleTabChange(idx)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === idx
                  ? "bg-green-600 text-white shadow-md shadow-green-600/25"
                  : "bg-gray-100 dark:bg-white/6 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {cat.label}
              <span className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                activeTab === idx ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"
              }`}>
                {cat.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {currentItems.map((item, idx) => (
            <FAQItem
              key={`${activeTab}-${idx}`}
              question={item.question}
              content={item.content}
              isOpen={openItem === idx}
              onToggle={() => setOpenItem(openItem === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQMajor;
