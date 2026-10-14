import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://velixsyncpro.com"),
  title: {
    default: "VelixSync Pro — Copy Futures, Options & Contracts with Precision",
    template: "%s | VelixSync Pro",
  },
  description:
    "VelixSync Pro is the premier copy trading platform for futures, options, and contracts. Mirror real-time trades from top-performing experts with AutoGuard™ risk management, AI signals, and zero commission.",
  keywords: [
    "VelixSync Pro",
    "VelixSync Pro copy trading",
    "copy trading platform",
    "copy futures trading",
    "copy options contracts",
    "mirror trading",
    "social trading",
    "stock copy trading",
    "AutoGuard risk management",
    "AI trading signals",
    "zero commission trading",
    "expert trader copying",
    "real-time trade mirroring",
    "copy trading app",
    "futures copy trading",
    "options copy trading",
  ],
  authors: [{ name: "VelixSync Pro", url: "https://velixsyncpro.com" }],
  creator: "VelixSync Pro",
  publisher: "VelixSync Pro",
  category: "Finance",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://velixsyncpro.com",
  },
  openGraph: {
    type: "website",
    url: "https://velixsyncpro.com",
    siteName: "VelixSync Pro",
    title: "VelixSync Pro — Copy Futures, Options & Contracts with Precision",
    description:
      "Mirror real-time stock and options trades from top-performing traders. Precision, flexibility, and transparency — straight to your fingertips.",
    images: [
      {
        url: "https://velixsyncpro.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "VelixSync Pro — Copy Trading Platform",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@VelixSyncPro",
    creator: "@VelixSyncPro",
    title: "VelixSync Pro — Copy Futures, Options & Contracts with Precision",
    description:
      "Mirror real-time stock and options trades from top-performing traders. Precision, flexibility, and transparency — straight to your fingertips.",
    images: ["https://velixsyncpro.com/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>

        {/* LiveChat - Jivo */}
        <Script
          src="//code.jivosite.com/widget/Ut6KwrqmNU"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
