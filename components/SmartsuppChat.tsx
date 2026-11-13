"use client";

import Script from "next/script";

const SMARTSUPP_KEY = "f3e90652b782d4e0dbb8133313a518b10e551de3";

type SmartsuppChatProps = {
  /** Shown in the Smartsupp dashboard so you know which site a chat came from. */
  project: string;
  website: string;
  /** Full 6-digit hex, e.g. "#06811d". Falls back to Smartsupp's default. */
  color?: string;
};

export default function SmartsuppChat({ project, website, color }: SmartsuppChatProps) {
  return (
    <>
      <Script id="smartsupp-config" strategy="beforeInteractive">
        {`
          window._smartsupp = window._smartsupp || {};
          window._smartsupp.key = "${SMARTSUPP_KEY}";
          ${color ? `window._smartsupp.color = "${color}";` : ""}
        `}
      </Script>
      <Script
        src="https://www.smartsuppchat.com/loader.js"
        strategy="afterInteractive"
        onLoad={() => {
          (window as any).smartsupp?.("variables", { Project: project, Website: website });
        }}
      />
    </>
  );
}
