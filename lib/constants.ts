// API calls go through Next.js rewrites (same-origin proxy to backend).
// This ensures cookies are first-party and not blocked by browsers.
// export const BACKEND_URL = "http://localhost:8000/api/auth";
// export const BACKEND_URL = process.env.NEXT_PUBLIC_APP_BACKEND_ORIGIN;

export const BACKEND_URL = "/api/auth";

