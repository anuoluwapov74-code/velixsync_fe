import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/portfolio",
          "/onboarding",
          "/kyc",
          "/settings",
          "/profile",
          "/notifications",
          "/transfer",
          "/withdraw",
          "/trade-history",
          "/transactions",
          "/referral",
          "/connect-wallet",
          "/session",
          "/signals",
          "/news",
          "/market",
          "/explore-traders",
          "/verify-email",
          "/verify-2fa",
          "/reset-password",
        ],
      },
    ],
    sitemap: "https://velixsync.com/sitemap.xml",
  };
}
