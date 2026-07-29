import Script from "next/script";

import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/analytics";

/** Loads gtag.js once and configures GA4 + Google Ads together — both
 * products share one gtag.js loader/queue (ATS-132). Renders nothing when
 * neither ID is set, e.g. local dev without the NEXT_PUBLIC_* vars.
 *
 * GA4's automatic pageview is disabled (`send_page_view: false`): it only
 * fires once, on the initial hard load, which would under-count every
 * client-side route change in this App Router site. AnalyticsListeners
 * drives page_view manually instead, on every pathname change. */
export function AnalyticsScripts() {
  const ids = [GA_MEASUREMENT_ID, GOOGLE_ADS_ID].filter((id): id is string => Boolean(id));
  if (ids.length === 0) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          ${GA_MEASUREMENT_ID ? `gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });` : ""}
          ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
        `}
      </Script>
    </>
  );
}
