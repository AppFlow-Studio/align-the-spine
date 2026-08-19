import type { ReactNode } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons/check";
import { LeadForm } from "@/components/ui/lead-form";
import { MobileLeadPreviewCard } from "@/components/ui/mobile-lead-preview-card";
import { leadFormVariants } from "@/content/lead-forms";
import { siteConfig } from "@/content/site";

/** Local-office-toned hero for /service-areas and each city page — a
 * full-bleed, edge-to-edge two-tone split at `lg`+ (dark photo left, solid
 * navy-900 panel right for the eligibility form), matching HeroSolidPanel's
 * homepage treatment rather than the earlier single-photo/frosted-glass-card
 * look (owner direction 2026-08-18: "have the blue section for the form
 * like the homepage"). Not a straight reuse of HeroSolidPanel itself —
 * that component has no slot for this page's trust-chip checklist or
 * Office/Call row, and duplicating its JSX here keeps this rewrite isolated
 * to the two pages that use it instead of risking the shared component's
 * three other call sites (home, /car-accident-chiropractor, conditions).
 *
 * Two colors meeting the next section directly below would read as an
 * abrupt, unplanned cut, so both columns carry their own bottom fade toward
 * the SAME target color (panel-100) — by the very bottom edge both columns
 * have already converged to one color, so there's no seam left to show by
 * the time the next section starts. A hairline teal/white gradient rule
 * sits right at that converged edge as a deliberate "this is where the
 * section ends" mark, rather than leaving the fade to imply it on its own.
 *
 * Below `lg` there's no side-by-side split to reconcile (photo, then a
 * stacked solid-navy card, then the next section, all sequential) — the
 * card is solid navy-900 there too for the same homepage-match reason, in
 * a plain positive-gap stack under the photo (see that block's own comment
 * for why a positive gap, never a negative margin, is used here). */
export function ServiceAreaHero({
  eyebrow,
  title,
  subhead,
  cityName,
  county,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subhead: ReactNode;
  /** Drives the form heading and trust chips; omit on the hub (no single city). */
  cityName?: string;
  county?: string;
  children?: ReactNode;
}) {
  const { address, phone, phoneHref } = siteConfig.business;
  const trustChips = [
    cityName ? `Home visits considered for ${cityName}` : "Case-by-case home-visit eligibility",
    "Florida 14-day PIP timing guidance",
    county ? `${county} County` : "Deerfield Beach office",
  ];

  const eligibilityHeading = cityName
    ? `Check eligibility in ${cityName}`
    : "Check home-visit eligibility";

  const formFields = (headingAs: "h2" | "p") => (
    <LeadForm
      heading={eligibilityHeading}
      variant={leadFormVariants.eligibility.variant}
      fields={leadFormVariants.eligibility.fields}
      submitLabel={leadFormVariants.eligibility.submitLabel}
      submitVariant="white"
      fieldOutline
      labelCase="none"
      headingClassName="mb-2 font-display text-h2 !leading-[1.15] text-white"
      // The fixed-height bottom fade (see the h-64 divs below) means this
      // form's own consent line — its lowest text before the submit
      // button — sits inside a background that's already faded most of
      // the way to white by the time it renders, not solid navy; the
      // default grey (tuned for solid navy) reads as low-contrast against
      // that near-white backdrop (reported, confirmed via screenshot).
      consentClassName="text-ink-900"
      headingAs={headingAs}
      className="gap-y-4"
    />
  );

  return (
    <section className="relative -mt-[100px] overflow-hidden lg:-mt-[176px] lg:flex lg:min-h-[820px]">
      <div className="relative min-h-[700px] sm:min-h-[760px] lg:min-h-full lg:flex-1">
        <Image
          src="https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-[70%_center]"
        />
        {/* Diagonal darkening tint (left-to-right, matching HeroSolidPanel's
         * own photo treatment) composited with the bottom fade-to-panel-100
         * as layers of ONE background — see accident-impact-visual.tsx and
         * blog-hero.tsx for why one painted element beats two stacked divs
         * here (no edge for them to disagree on). */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,14,36,0.88)_10%,rgba(10,14,36,0.7)_55%,rgba(10,14,36,0.35)_100%)]" />
        {/* Fade-to-panel-100, split out from the diagonal tint above into
         * its own fixed-height layer (not a percentage of this column's
         * own, dynamic height) specifically so it can share an EXACT pixel
         * height with the navy panel's matching fade below — two fades
         * measured as different percentages of two independently-sized
         * boxes drift out of sync and visibly disagree at the shared
         * bottom edge; two fades of the same fixed height, sharing that
         * same bottom edge (flex stretch keeps both columns equal-height),
         * converge at the same rate and reach solid panel-100 at the same
         * point — nothing left to seam. The `lg:h-64` value stays
         * cross-synced with the desktop navy panel's own matching fade (see
         * that div below) — do not change it. `h-40` below is mobile-only
         * (this section hides the navy panel entirely below `lg`, so
         * nothing there depends on it) — shrunk to `h-28` (owner-reported:
         * the Office/Call row below was landing inside the washed-out
         * portion of this fade, reading as low-contrast against it). */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-b from-transparent via-[#f6f6f6]/60 to-[#f6f6f6] sm:h-52 lg:h-64" />
        {/* pb-24, not pb-16: extra clearance between the Office/Call row
         * (this container's last child) and the fade zone above — same
         * contrast fix as the shrunk fade height, applied from the other
         * direction. lg:pb-[60px] unchanged (desktop's Office/Call row
         * lives in the separate navy panel below, not this photo column). */}
        <div className="container relative z-10 pb-24 pt-[224px] lg:pb-[60px] lg:pt-[276px] lg:pr-10">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-teal-300 backdrop-blur-sm">
            {eyebrow}
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white">{subhead}</p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {trustChips.map((chip) => (
              <li key={chip} className="flex items-center gap-2 text-sm font-medium text-white">
                <CheckIcon className="h-4 w-4 shrink-0 text-teal-300" />
                {chip}
              </li>
            ))}
          </ul>

          {children}

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-300">
                Office
              </p>
              <p className="mt-1 text-white">
                {address.line1}, {address.suite}, {address.city}, {address.state} {address.zip}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-300">
                Call
              </p>
              <a
                href={phoneHref}
                className="mt-1 block font-semibold text-white underline-offset-4 hover:underline"
              >
                {phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop-only solid navy panel — flex's default align-items:stretch
       * (no override here) makes it match the photo column's own height
       * automatically, so it reads as one continuous split, not a box of
       * its own floating height. justify-start + the SAME pt-[276px] the
       * photo column's content uses (not justify-center): centering placed
       * the form heading's vertical midpoint using this panel's *full*
       * stretched height, which extends up behind the fixed Navbar+
       * TopStatsBar (the -mt-[176px] bleed) — on a tall page that pushed
       * the heading itself up behind the navbar, clipping it (reported,
       * confirmed via screenshot). Starting at the same offset the photo
       * column's own content uses keeps both columns' content aligned to
       * the same visible top edge instead. */}
      <div
        id="eligibility-form-desktop"
        className="relative hidden flex-col justify-start bg-navy-900 px-10 pb-16 pt-[224px] lg:flex lg:w-[440px] lg:shrink-0 lg:pb-[60px] lg:pt-[276px] xl:w-[500px]"
      >
        {/* Exact same fixed-height fade as the photo column's — see that
         * div's comment for why matching pixel heights (not percentages)
         * is what makes the two sides converge in sync. */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-64 bg-gradient-to-b from-transparent via-[#f6f6f6]/60 to-[#f6f6f6]" />
        <div className="relative z-10">
          {formFields("p")}
          {/* text-ink-900, not text-white/80: this paragraph sits below
           * the whole form, deeper into the bottom fade than the form's
           * own consent line (see formFields' consentClassName comment
           * above) — by this point the background has faded almost all
           * the way to white, so white/80 text there is just as
           * low-contrast as the grey it replaced (reported: "this text
           * same issue"). */}
          <p className="mt-4 text-sm leading-6 text-ink-900">
            One verified office in Deerfield Beach; home visits are limited to eligible
            car-accident/PIP circumstances and require case and location confirmation.
          </p>
        </div>
      </div>

      {/* Hairline mark at the converged edge — a deliberate "section ends
       * here" seam instead of leaving the fade to imply it silently. Full
       * width so it reads as one mark across both the photo and the navy
       * panel below `lg`... */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-px bg-gradient-to-r from-transparent via-teal-300/50 to-transparent lg:block" />

      {/* Mobile-only compact tap-to-expand card, right under the content
       * column — owner direction 2026-08-19 (matching a reference client's
       * mobile CRO pattern, same conversion already applied to
       * HeroSolidPanel/Hero): two field previews + one CTA instead of the
       * full multi-field eligibility form shown immediately. Tapping it
       * opens the exact same validated LeadForm in the site's existing
       * popup (ATS-142) — no new submission path.
       *
       * Still a plain positive gap, NOT a negative-margin overlap onto the
       * photo/content column above: that column's height varies (trust
       * chips wrap 2-3 lines depending on city-name length), and a fixed
       * negative offset previously landed on the real Office/Call text at
       * some wrap width regardless of how short the card itself was — the
       * risk is in the unpredictable position of what's above it, not the
       * card's own height (ATS-145, reported twice — do not reintroduce a
       * negative margin here even though HeroSolidPanel's own mobile card
       * uses one; that page doesn't have this variable-height trust-chip/
       * Office row above it). This intentionally diverges from a reference
       * screenshot's literal photo-overlapping card for that reason. */}
      <div className="container relative z-10 mt-3 flex flex-col gap-4 pb-10 lg:hidden">
        <div id="eligibility-form-mobile">
          <MobileLeadPreviewCard
            heading={eligibilityHeading}
            formVariant={leadFormVariants.eligibility.variant as "eligibility"}
            submitLabel={leadFormVariants.eligibility.submitLabel}
            microcopy="Same-day availability considered — no obligation."
          />
        </div>
        <Button variant="white" href={phoneHref} className="w-full justify-center">
          Call Now: {phone}
        </Button>
      </div>
    </section>
  );
}
