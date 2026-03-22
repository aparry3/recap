/**
 * Parses a date value from the API in a timezone-safe way.
 *
 * PostgreSQL `date` columns return values like "2025-08-22" or
 * "2025-08-22T00:00:00.000Z". JavaScript's `new Date()` treats these as UTC
 * midnight, so `toDateString()` / `toLocaleDateString()` shift the date back
 * by one day for anyone west of UTC.
 *
 * This function extracts the YYYY-MM-DD components and constructs a Date using
 * the local timezone, ensuring the displayed date matches what's stored in the DB.
 */
export function parseLocalDate(value: string | Date): Date {
  const str = typeof value === 'string' ? value : value.toISOString();
  // Extract YYYY-MM-DD from the start of any ISO-ish string
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    // Construct in local timezone (month is 0-indexed)
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  // Fallback: return as-is (timestamps with real times are fine)
  return new Date(str);
}

/**
 * Formats a date-only value for display, avoiding the off-by-one timezone bug.
 *
 * Returns the same format as `Date.toDateString()` — e.g. "Fri Aug 22 2025".
 */
export function formatDateString(value: string | Date): string {
  return parseLocalDate(value).toDateString();
}

/**
 * Formats a date-only value using toLocaleDateString(), timezone-safe.
 */
export function formatLocaleDateString(
  value: string | Date,
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
): string {
  return parseLocalDate(value).toLocaleDateString(locales, options);
}
