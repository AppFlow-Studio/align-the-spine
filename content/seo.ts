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
      "Elite spinal health care in Deerfield Beach, FL — office visits from $50, same-day car accident evaluations, and home visits when it fits your case. Call (954) 573-7192.",
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
    path: "/book",
    title: `Book an Appointment | ${siteConfig.business.name}`,
    description:
      "Schedule your chiropractic evaluation in Deerfield Beach or at your home. Same-day slots available for urgent cases — book online or call (954) 573-7192.",
    image: {
      src: "/figma-exports/phone-mockup.png",
      alt: "Patient calling Align the Spine to book an appointment",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-07-31",
  },
  {
    path: "/auto-accidents",
    title: `Auto Accident Chiropractor in Deerfield Beach, FL | ${siteConfig.business.name}`,
    description:
      "Same-day auto accident evaluations, billed directly to Florida PIP. Full exam, treatment, and documentation for your claim — in-home visits available. Call (954) 573-7192.",
    image: {
      src: "/figma-exports/interior-corridor.png",
      alt: "Align the Spine reception hallway",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-08-03",
  },
  {
    path: "/conditions/back-pain",
    title: `${backPainHero.h1} | ${siteConfig.business.name}`,
    description: backPainHero.subhead,
    image: backPainHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-01",
  },
  {
    path: "/conditions/neck-pain",
    title: `${neckPainHero.h1} | ${siteConfig.business.name}`,
    description: neckPainHero.subhead,
    image: neckPainHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-01",
  },
  {
    path: "/conditions/sciatica",
    title: `${sciaticaHero.h1} | ${siteConfig.business.name}`,
    description: sciaticaHero.subhead,
    image: sciaticaHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-03",
  },
  {
    path: "/conditions/whiplash",
    title: `${whiplashHero.h1} | ${siteConfig.business.name}`,
    description: whiplashHero.subhead,
    image: whiplashHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-03",
  },
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
  },
  {
    path: "/about",
    title: `About Dr. Abe Nasser | ${siteConfig.business.name}`,
    description:
      "One doctor, every visit. Meet Dr. Abe Nasser — bilingual, transparent pricing, and the same provider from your first exam through recovery. Call (954) 573-7192.",
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
