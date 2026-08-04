import Script from "next/script";

import { GTM_ID } from "@/lib/analytics";

/** Google Tag Manager container script, installed verbatim per the client's
 * own GTM install instructions (ATS-132) — `next/script` with
 * `strategy="afterInteractive"` is the standard way to load it in a Next.js
 * App Router site (GTM's own "as high in <head> as possible" guidance is
 * written for static HTML; Google's Next.js integration docs use this same
 * pattern). Renders nothing when NEXT_PUBLIC_GTM_ID is unset. */
export function GtmScript() {
  if (!GTM_ID) return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/** GTM's <noscript> fallback iframe — must render as the very first thing
 * inside <body> per Google's install instructions, for users with
 * JavaScript disabled. Renders nothing when NEXT_PUBLIC_GTM_ID is unset. */
export function GtmNoscript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
