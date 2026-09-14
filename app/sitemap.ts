import type { MetadataRoute } from "next";

const BASE = "https://velixsync.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    // ── Core ──
    { url: BASE,                                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,                               lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/broker`,                              lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/autoguard`,                           lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // ── Leaders / Affiliates ──
    { url: `${BASE}/leader`,                              lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/leader-guide`,                        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/affiliate`,                           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/affiliate-guide`,                     lastModified: now, changeFrequency: "monthly", priority: 0.6 },

    // ── Help ──
    { url: `${BASE}/user-guide`,                          lastModified: now, changeFrequency: "monthly", priority: 0.6 },

    // ── Auth ──
    { url: `${BASE}/login`,                               lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/register`,                            lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/forgot-password`,                     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },

    // ── Legal (low priority, nofollow handled via metadata) ──
    { url: `${BASE}/privacy-policy`,                      lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms-of-service`,                    lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/risk-disclaimer`,                     lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/cookies-policy`,                      lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/conflict-of-interest`,                lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/declaration-of-consent`,              lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/end-user-license-agreement`,          lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];
}
