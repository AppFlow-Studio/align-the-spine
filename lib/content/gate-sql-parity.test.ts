import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { contentBlockSchema, faqItemSchema } from "./schemas";

/** The publication gate exists twice: once in TypeScript
 * (publication-gates.ts, run by the admin save route) and once in SQL
 * (`public.content_gate_result()`, run by the trigger that publishes a post
 * written straight to Supabase). Two copies is a deliberate trade — the
 * database has to decide without the app — but it is only safe while they agree.
 *
 * A post that passes in one path and fails in the other is the exact bug this
 * guards: a writer using the table editor would see a blocker the admin form
 * never shows, or worse, the reverse. Source-scanning the migration keeps the
 * check honest without a live Postgres, in the same spirit as this repo's other
 * source-scan tests (lib/schema.test.ts's /conditions sweep).
 *
 * When a blocker is added, changed, or removed, both files change together or
 * this fails. */
const GATE_SQL = readFileSync(
  join(__dirname, "..", "..", "supabase", "migrations", "202609270002_blog_gate_autopublish.sql"),
  "utf8",
);
const GATE_TS = readFileSync(join(__dirname, "publication-gates.ts"), "utf8");
const UPLOAD_SQL = readFileSync(
  join(__dirname, "..", "..", "supabase", "migrations", "202609270003_blog_direct_upload.sql"),
  "utf8",
);

/** Blockers that only ever apply to `content_type = 'service_area'`. Those rows
 * are gated on local evidence held in static-service-area-repository.ts, never
 * written through the CMS, and the SQL trigger skips them entirely — so the SQL
 * mirror deliberately does not implement these. */
const SERVICE_AREA_ONLY = [
  "Service-area evidence is required.",
  "Area is not operationally approved.",
  "Operational evidence is required.",
  "At least three materially unique local proof points are required.",
  "City-page uniqueness score must be at least 70.",
  "Page is too similar to another service-area page.",
  "In-office relevance for this community is not verified.",
  "Home-visit eligibility is not verified for this area.",
];

function blockerStringsFrom(source: string): string[] {
  // Matches blockers.push("…") across line breaks, which is how prettier wraps
  // the longer messages.
  const matches = source.matchAll(/blockers\.push\(\s*"((?:[^"\\]|\\.)*)"/g);
  return [...matches].map((match) => match[1]!.replace(/\\"/g, '"'));
}

describe("publication gate parity between TypeScript and SQL", () => {
  const blockers = blockerStringsFrom(GATE_TS);

  it("finds the TypeScript blocker messages at all (guards the regex itself)", () => {
    expect(blockers.length).toBeGreaterThanOrEqual(14);
    expect(blockers).toContain("Content is too thin for publication review.");
  });

  it("implements every blog-post blocker in the SQL mirror, word for word", () => {
    const missing = blockers
      .filter((blocker) => !SERVICE_AREA_ONLY.includes(blocker))
      .filter((blocker) => !GATE_SQL.includes(blocker));
    expect(missing).toEqual([]);
  });

  it("does not implement the service-area-only blockers in SQL", () => {
    const leaked = SERVICE_AREA_ONLY.filter((blocker) => GATE_SQL.includes(blocker));
    expect(leaked).toEqual([]);
  });

  it("keeps the same recommendation wording on both sides", () => {
    for (const recommendation of [
      "Add key-takeaway bullets so the summary box is scannable.",
      "Add genuinely useful related content.",
    ]) {
      expect(GATE_TS).toContain(recommendation);
      expect(GATE_SQL).toContain(recommendation);
    }
  });

  it("keeps the numeric thresholds in step", () => {
    // Word count, meta-description length, and title length are the three
    // numbers a writer actually feels.
    expect(GATE_TS).toContain("< 350");
    expect(GATE_SQL).toContain("word_count < 350");
    expect(GATE_TS).toContain("metaDescription.trim().length < 70");
    expect(GATE_SQL).toContain("length(btrim(coalesce(item.meta_description, ''))) < 70");
    expect(GATE_TS).toContain("item.title.trim().length < 12");
    expect(GATE_SQL).toContain("length(btrim(item.title)) < 12");
  });

  it("uses the same objective-claim vocabulary, so citations are demanded alike", () => {
    // The TS side is a JS regex and the SQL side a POSIX one, so the terms are
    // compared rather than the pattern text.
    const terms = [
      "statute",
      "percent",
      "percentage",
      "study",
      "research",
      "crash",
      "fatalit",
      "days?",
      "coverage",
      "insurance",
      "PIP",
      "diagnos",
      "treatment",
      "recover",
    ];
    for (const term of terms) {
      expect(GATE_TS).toContain(term);
      expect(GATE_SQL).toContain(term);
    }
  });

  it("only ever promotes a post the gate passed, and never one held back", () => {
    // The promotion rule itself: gates passed, not noindexed, not archived.
    expect(GATE_SQL).toContain("coalesce((new.gate_result->>'passed')::boolean, false)");
    expect(GATE_SQL).toContain("new.noindex = false");
    expect(GATE_SQL).toContain("new.status in ('draft', 'in_review', 'approved', 'scheduled')");
  });
});

/** `publish_blog_post()` mints ids for the blocks and FAQs it builds from a
 * Markdown body. Those ids have to satisfy the same schema the admin form
 * validates against, or a pasted article saves and then fails its own gate with
 * "Content blocks or heading hierarchy are invalid" — which is what happened
 * with a two-character `b1` prefix, since the format demands three characters. */
describe("ids generated by publish_blog_post", () => {
  it("mints block ids the block schema accepts", () => {
    const prefix = UPLOAD_SQL.match(/'id', '([a-z]+)' \|\| block_index/)?.[1];
    expect(prefix, "block id prefix not found in the migration").toBeTruthy();
    const parsed = contentBlockSchema.safeParse({
      id: `${prefix}1`,
      type: "paragraph",
      text: "Body text.",
    });
    expect(parsed.success).toBe(true);
  });

  it("mints FAQ ids the FAQ schema accepts", () => {
    const prefix = UPLOAD_SQL.match(/'([a-z]+)' \|\| faq_index/)?.[1];
    expect(prefix, "faq id prefix not found in the migration").toBeTruthy();
    const parsed = faqItemSchema.safeParse({
      id: `${prefix}1`,
      question: "Does this publish?",
      answer: "Yes.",
    });
    expect(parsed.success).toBe(true);
  });
});
