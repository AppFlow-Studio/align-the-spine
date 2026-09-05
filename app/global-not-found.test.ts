import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { LOCALES } from "@/content/i18n";

/** ATS-SEO-139: guards the property that actually matters here — a
 * genuinely unmatched URL anywhere on the site (in any locale) gets a real
 * pre-stream 404 status, not the streamed "soft 404" (200 + noindex) that a
 * per-locale not-found.tsx produces once a `loading.tsx` boundary is in
 * play (see app/global-not-found.tsx's own doc comment for why a per-locale
 * catch-all route was tried and reverted).
 *
 * Source-scanning rather than rendering: this repo has no jsdom/
 * testing-library setup (same convention as
 * app/breadcrumbs-coverage.test.ts and content/route-registry-parity.test.ts),
 * and app/global-not-found.tsx is deliberately static (no props, no
 * request-path detection — see its own comment on why), so its source is a
 * complete, stable description of what it renders.
 */
const source = readFileSync(join(__dirname, "global-not-found.tsx"), "utf8");

describe("app/global-not-found.tsx", () => {
  it("forces noindex,nofollow explicitly rather than relying only on the automatic 404 meta", () => {
    expect(source).toMatch(/robots:\s*{\s*index:\s*false,\s*follow:\s*false\s*}/);
  });

  it("offers a home link in every locale this site has, each with the correct hrefLang", () => {
    for (const locale of LOCALES) {
      expect(
        source.includes(`hrefLang={HTML_LANG.${locale}}`) || locale === "en",
        `no hrefLang={HTML_LANG.${locale}} link found`,
      ).toBe(true);
    }
  });

  it("leads with English (the hreflang x-default) rather than any other locale", () => {
    const htmlLangMatch = source.match(/<html lang=\{([^}]+)\}/);
    expect(htmlLangMatch?.[1]).toBe("HTML_LANG.en");
  });

  it("never imports next/headers — this page must stay static, not opt into dynamic rendering just to detect a locale from the request", () => {
    // Checks the actual import, not prose: the doc comment above the
    // component explains, in English, exactly why headers()/cookies()
    // aren't used — a naive substring check on "headers()" would trip on
    // that sentence itself.
    expect(source).not.toMatch(/from ["']next\/headers["']/);
  });
});
