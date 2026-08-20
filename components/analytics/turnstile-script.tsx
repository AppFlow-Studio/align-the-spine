"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

/** Loads Cloudflare Turnstile's client library once, site-wide — the actual
 * invisible widget is rendered on demand by lib/leads/turnstile-client.ts
 * the first time a lead form is submitted, not by this component. Renders
 * nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset (no widget to key
 * it against) or on /admin, /preview (no public lead forms there). */
export function TurnstileScript() {
  const pathname = usePathname();
  if (
    !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/preview")
  ) {
    return null;
  }

  return (
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      strategy="afterInteractive"
      async
      defer
    />
  );
}
