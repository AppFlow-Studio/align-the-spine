import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { accidentInjuries } from "@/content/accident-injuries";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { services } from "@/content/services";
import { servicesGrid } from "@/content/services-grid";
import { spineOverviewContent } from "@/content/spine-overview";
import { whyChooseContent } from "@/content/why-choose";

/** Translation freshness.
 *
 * content/es/* is hand-written Spanish that mirrors specific English
 * content. Nothing in the type system notices when the English side is
 * reworded — the Spanish keeps compiling and keeps rendering the older
 * message. That is not hypothetical: the English homepage badge changed
 * from "Office Visits are $50" to "We accept cash visits" while the Spanish
 * kept advertising the $50 price the practice had stopped quoting, and the
 * homepage H1 was realigned to its title tag (ATS-SEO-050) while the
 * Spanish kept the old three-line, brand-first split.
 *
 * content/es/content-parity.test.ts catches STRUCTURAL drift (an item added
 * or removed). This catches COPY drift: it hashes the English strings each
 * Spanish module was written against, and fails when they change.
 *
 * ── When this test fails ────────────────────────────────────────────────
 * It is not a bug and the fix is never "just update the hash". Do this:
 *   1. Diff the English content that changed.
 *   2. Update the matching Spanish copy in content/es/ so it says the same
 *      thing — including *stopping* saying anything the English stopped
 *      saying (that's the case that actually bit us).
 *   3. Bump `lastModified` on the affected route in content/es/seo.ts.
 *   4. Only then paste the new hash in below.
 * Updating the hash without step 2 silently re-accepts the drift.
 */

/** Stable hash of the visitor-facing strings in a content value. Key order
 * is normalized so a formatting-only reshuffle doesn't trip the test. */
function copyHash(value: unknown): string {
  const strings: string[] = [];
  const walk = (node: unknown) => {
    if (typeof node === "string") {
      strings.push(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === "object") {
      for (const key of Object.keys(node).sort()) {
        walk((node as Record<string, unknown>)[key]);
      }
    }
  };
  walk(value);
  return createHash("sha256").update(strings.join("\0")).digest("hex").slice(0, 16);
}

/** English source → the hash recorded the last time its Spanish mirror was
 * reviewed against it. These are literals on purpose: computing them from
 * the same source they're checked against would compare a value to itself
 * and could never fail. */
const RECORDED: { label: string; source: unknown; spanishMirror: string; hash: string }[] = [
  {
    // Hash bumped 2026-09-21: the IA-02 gate override (content/seo.ts's
    // file header) flipped /services/* from draft to published, so
    // getRouteHref() now resolves each item's `href` to a real path
    // instead of `undefined` — copyHash() walks that string too. Not a
    // wording change: content/es/pages.ts's esServicesGrid already
    // hardcoded these same real Spanish paths regardless of gate status,
    // so nothing here needed updating to match.
    label: "services (homepage list)",
    source: services,
    spanishMirror: "content/es/home.ts → esServices",
    hash: "ac8e54868489e50b",
  },
  {
    // Same href-resolution cause as "services" above, same verification —
    // no wording drift, only href strings newly populated.
    label: "servicesGrid (/services grid)",
    source: servicesGrid,
    spanishMirror: "content/es/pages.ts → esServicesGrid",
    hash: "8be9fc20fc8f0523",
  },
  {
    // Same href-resolution cause as "services" above (accident-injuries.ts
    // links each injury to its /conditions/* page via the same
    // getRouteHref() pattern) — no wording drift.
    label: "accidentInjuries",
    source: accidentInjuries,
    spanishMirror: "content/es/home.ts → esAccidentInjuries",
    hash: "450bf07e4f0eba50",
  },
  {
    label: "whyChooseContent",
    source: whyChooseContent,
    spanishMirror: "content/es/home.ts → esWhyChooseContent",
    hash: "1a61a6f899020bde",
  },
  {
    label: "doctorProfileContent",
    source: doctorProfileContent,
    spanishMirror: "content/es/pages.ts → esDoctorProfileContent",
    hash: "302384a1bf26cc0e",
  },
  {
    label: "spineOverviewContent",
    source: spineOverviewContent,
    spanishMirror: "content/es/home.ts → esSpineOverviewContent",
    hash: "c7eaef9d7d6b4dc6",
  },
  {
    label: "leadFormVariants",
    source: leadFormVariants,
    spanishMirror: "content/es/lead-forms.ts → esLeadFormVariants",
    hash: "fb99f06ea8aaa247",
  },
];

describe("Spanish translations are current with their English source", () => {
  it.each(RECORDED)(
    "$label has not changed since $spanishMirror was reviewed",
    ({ source, spanishMirror, hash }) => {
      expect(
        copyHash(source),
        `English copy changed. Review and update ${spanishMirror} to match, bump lastModified in content/es/seo.ts, then update the recorded hash in this file. See this file's header before touching the hash.`,
      ).toBe(hash);
    },
  );
});
