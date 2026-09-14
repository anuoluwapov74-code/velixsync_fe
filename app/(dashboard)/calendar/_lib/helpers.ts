// Shared formatting + calendar-grid helpers for the /calendar page.

/** Muted slate-blue used for every section heading and stat label across
 * this page (MY PERFORMANCE, WIN RATE, TOTAL TRADES, etc.) — matches the
 * reference design's label color in both themes. */
export const LABEL_COLOR = "text-[#6B84AD] dark:text-[#93A8CC]";

/** "$2k", "$20k", "-$1.4M", "$85" — compact currency, matching the
 * per-day figures shown on the calendar cells. */
export function formatCompactUSD(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    const v = abs / 1_000_000;
    return `${sign}$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    const v = abs / 1_000;
    return `${sign}$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}k`;
  }
  return `${sign}$${abs.toFixed(abs < 10 ? 2 : 0)}`;
}

export function formatUSD(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI"];

/**
 * Builds a month grid of 6 columns (Sun–Fri) — Saturdays are dropped
 * entirely (no trading), matching the reference layout exactly. Returns
 * an array of weeks, each a 6-length array of day numbers or null.
 */
export function buildCalendarWeeks(year: number, month: number /* 1-12 */): (number | null)[][] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(6).fill(null);
  let started = false;

  for (let day = 1; day <= daysInMonth; day++) {
    const wd = new Date(year, month - 1, day).getDay(); // 0=Sun..6=Sat
    if (wd === 6) continue; // Saturday — skip entirely
    if (wd === 0 && started) {
      weeks.push(week);
      week = Array(6).fill(null);
    }
    week[wd] = day;
    started = true;
  }
  weeks.push(week);
  return weeks;
}
