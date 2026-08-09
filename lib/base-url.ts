/**
 * Returns a valid absolute base URL for the site.
 * Falls back to localhost if NEXTAUTH_URL is missing OR malformed — e.g. at
 * build time on Railway, `https://${{RAILWAY_PUBLIC_DOMAIN}}` can resolve to a
 * bare "https://" before a domain exists, which would crash `new URL()`.
 */
export function getBaseUrl(): string {
  const raw = process.env.NEXTAUTH_URL;
  if (raw && /^https?:\/\/[^/]+/i.test(raw)) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}
