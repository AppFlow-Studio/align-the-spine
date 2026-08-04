import type { MetadataRoute } from "next";

import { backPainHero } from "@/content/back-pain-page";
import { neckPainHero } from "@/content/neck-pain-page";
import { sciaticaHero } from "@/content/sciatica-page";
import { siteConfig } from "@/content/site";
import { whiplashHero } from "@/content/whiplash-page";

export interface RouteMeta {
  /** Route path from the site root, e.g. "/services". "" is the home page. */
  path: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  /** ISO date (YYYY-MM-DD) tied to this route's last meaningful content
   * change. Bump it by hand when the page's content changes — never derive
   * it from build time. */
  lastModified: string;
  /** ATS-E4 (4.12/4.14): defaults to "published" for ordinary static
   * pages. Condition-page routes must carry `reviewer` + `lastReviewed`
   * (a clinician sign-off, not this route's own `lastModified`) before
   * they can be "published" — until then they stay "draft": excluded from
   * the sitemap and served noindex, but still reachable directly (these
   * are real, finished pages awaiting clinical review, not broken ones —
   * a hard 404 would be the wrong signal). See isPublished(). */
  status?: "draft" | "published";
  /** Clinician who reviewed this page's medical content (ATS-E4 4.14/4.16). */
  reviewer?: string;
  /** ISO date (YYYY-MM-DD) of that clinician review — distinct from
   * `lastModified`, which tracks content edits, not medical sign-off. */
  reviewerLastReviewed?: string;
}

/** A route may render/be linked from the sitemap only once it's
 * `"published"` (the default for routes that don't opt into gating) —
 * see RouteMeta.status's doc comment. */
export function isPublished(route: RouteMeta): boolean {
  return (route.status ?? "published") === "published";
}

/** Single source of truth for every statically-indexable route: app/sitemap.ts
 * maps straight over this, and each static page's own metadata export pulls
 * its entry by path via getRoute() instead of re-declaring title/description,
 * so the two can't drift apart. As of ATS-137, every /conditions/* route is
 * a dedicated static page registered here directly — there's no more
 * dynamic /conditions/[slug] route. /thank-you and /404 are intentionally
 * absent — both are noindex and neither belongs in the sitemap.
 * /auto-accident is absent too — it 308s to /auto-accidents (see
 * next.config.ts). */
export const routes: RouteMeta[] = [
  {
    path: "",
    title: `${siteConfig.business.name} | South Florida's Chiropractor`,
    description:
      "Elite spinal health care in Deerfield Beach, FL — car accident evaluations and home visits when it fits your case. Call (954) 573-7192.",
    image: { src: "/figma-exports/interior-reception.png", alt: "Align the Spine reception area" },
    changeFrequency: "weekly",
    priority: 1,
    lastModified: "2026-08-02",
  },
  {
    path: "/services",
    title: `Chiropractic Services in Deerfield Beach, FL | ${siteConfig.business.name}`,
    description:
      "Adjustments, sports injury care, posture correction, spinal decompression, headache relief, and massage/soft-tissue therapy — same doctor, every visit. Call (954) 573-7192.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser treating a patient's neck",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-07-31",
  },
  {
    // ATS-E3 (3.4): renamed from "Book" — nothing on this form auto-confirms
    // a slot, it's a request that gets a callback, so "Book" overpromised.
    path: "/book",
    title: `Request a Chiropractic Appointment | Deerfield Beach, FL | ${siteConfig.business.name}`,
    description:
      "Request your chiropractic evaluation in Deerfield Beach or at your home — we'll follow up to confirm. Call (954) 573-7192.",
    image: {
      src: "/figma-exports/phone-mockup.png",
      alt: "Patient calling Align the Spine to request an appointment",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-08-04",
  },
  {
    // ATS-E3 (3.1): "Auto" -> "Car" to match the ticket's specified title.
    path: "/auto-accidents",
    title: `Car Accident Chiropractor in Deerfield Beach, FL | ${siteConfig.business.name}`,
    description:
      "Car accident evaluations for Florida PIP claims. Full exam, treatment, and documentation for your claim — in-home visits available. Call (954) 573-7192.",
    image: {
      src: "/figma-exports/interior-corridor.png",
      alt: "Align the Spine reception hallway",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-08-03",
  },
  // ATS-E4 (4.14): all 4 condition pages below have a red-flag/warning
  // section (confirmed present on each — RedFlagCard/ConditionWarning) but
  // no clinician `reviewer`/`reviewerLastReviewed` sign-off yet, so all 4
  // stay `status: "draft"` (noindex, excluded from the sitemap, still
  // reachable by direct URL) until a clinician reviews the medical content
  // and this file is updated with their name + review date.
  {
    path: "/conditions/back-pain",
    title: `${backPainHero.h1} | ${siteConfig.business.name}`,
    description: backPainHero.subhead,
    image: backPainHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-01",
    status: "draft",
  },
  {
    path: "/conditions/neck-pain",
    title: `${neckPainHero.h1} | ${siteConfig.business.name}`,
    description: neckPainHero.subhead,
    image: neckPainHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-01",
    status: "draft",
  },
  {
    path: "/conditions/sciatica",
    title: `${sciaticaHero.h1} | ${siteConfig.business.name}`,
    description: sciaticaHero.subhead,
    image: sciaticaHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-03",
    status: "draft",
  },
  {
    path: "/conditions/whiplash",
    title: `${whiplashHero.h1} | ${siteConfig.business.name}`,
    description: whiplashHero.subhead,
    image: whiplashHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-03",
    status: "draft",
  },
  // ATS-E3 (3.7): unverified service-area/availability data (see
  // content/site.ts's `serviceAreas`, ATS-E4 4.6) — stays draft
  // (noindex, out of the sitemap) until that's confirmed.
  {
    path: "/home-visits",
    title: `Home Visit Chiropractor in Deerfield Beach, FL | ${siteConfig.business.name}`,
    description:
      "Full chiropractic exams and treatment at your address when it fits your case and location. Check your home-visit eligibility online or call (954) 573-7192.",
    image: {
      src: "/figma-exports/home-visits-hero.png",
      alt: "Dr. Abe Nasser setting up a treatment table in a patient's living room",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-07-31",
    status: "draft",
  },
  // ATS-E3 (3.2): no approved review data yet (content/reviews.ts is
  // empty) — stays draft until real, published reviews exist.
  {
    path: "/reviews",
    title: `Patient Reviews | ${siteConfig.business.name}`,
    description:
      "Verified patient reviews for Align the Spine Chiropractic in Deerfield Beach, FL.",
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-08-04",
    status: "draft",
  },
  {
    // ATS-E3 (3.8): title set to the ticket's exact required wording.
    path: "/about",
    title: "Dr. Abe Nasser, D.C. | Deerfield Beach Chiropractor",
    description:
      "One doctor, every visit. Meet Dr. Abe Nasser — transparent pricing and the same provider from your first exam through recovery. Call (954) 573-7192.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser treating a patient's neck",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-07-31",
  },
  {
    path: "/contact-us",
    title: `Contact Us | ${siteConfig.business.name}`,
    description:
      "Questions about your visit, insurance, or your claim? Reach Align the Spine Chiropractic directly — no call center, no hold music. Call (954) 573-7192.",
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-07-31",
  },
  {
    path: "/privacy-policy",
    title: `Privacy Policy | ${siteConfig.business.name}`,
    description:
      "How Align the Spine Chiropractic collects, uses, and protects your information, including HIPAA-protected health information.",
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: "2026-07-31",
  },
];

/** Looks up a route's registry entry by path — throws if missing rather than
 * silently falling back, so a page that forgets to register itself fails at
 * build time instead of shipping without a canonical. */
export function getRoute(path: string): RouteMeta {
  const route = routes.find((entry) => entry.path === path);
  if (!route) throw new Error(`content/seo.ts: no route registered for path "${path}"`);
  return route;
}
