import type { ReactNode } from "react";
import Image from "next/image";

import type { HeroFormConfig } from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/ui/fade-in";
import { CheckIcon } from "@/components/ui/icons/check";
import { PhoneIcon } from "@/components/ui/icons/phone";
import { LeadForm } from "@/components/ui/lead-form";
import { Rating } from "@/components/ui/rating";
import { leadFormVariants } from "@/content/lead-forms";
import { getVerifiedStats, siteConfig } from "@/content/site";
import { isVerified } from "@/content/verified-value";

import { Container } from "../ui/container";

/** Compact trust-badge row: star rating + review count, plus whatever else
 * is verified (same-day, PIP accepted, etc.) as small pills. Renders
 * nothing when nothing is verified yet, same as every other verified-claim
 * consumer. Pill treatment (bg-white/10, rounded-full) reuses existing
 * tokens — same glass-pill idea as Button's "glass" variant and
 * StatChipRow's bg-overlay-white-15, not a new visual language. */
function HeroTrustLine({ className }: { className?: string }) {
  const reviews = siteConfig.reviewsRating;
  const otherStats = getVerifiedStats().filter((stat) => stat.label !== "Reviews");

  if (!isVerified(reviews) && otherStats.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
      {isVerified(reviews) && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 py-1.5 pl-3 pr-3.5">
          <Rating
            value={reviews.value.rating}
            filledClassName="text-teal-300"
            emptyClassName="text-white/30"
          />
          <span className="font-sans text-stat-label text-white">
            {reviews.value.rating.toFixed(1)} ({reviews.value.count} reviews)
          </span>
        </span>
      )}
      {otherStats.map((stat) => (
        <span
          key={stat.label}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 py-1.5 pl-2.5 pr-3.5 font-sans text-stat-label text-white"
        >
          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-teal-300" />
          {stat.value}
        </span>
      ))}
    </div>
  );
}

export interface HeroSolidPanelProps {
  background: { src: string; alt: string };
  eyebrow?: string;
  /** Teal pill above the headline, e.g. "Office visits are $50". */
  badge?: string;
  title: ReactNode;
  subhead: ReactNode;
  callPill?: { eyebrow: string; phone: string };
  /** Condition-variant bilingual-care note below the call pill, e.g.
   * "¿Habla español? Dr. Abe habla su idioma." */
  bilingualNote?: string;
  /** Condition-page stat callout below the call pill (e.g. the
   * /auto-accidents Florida PIP coverage figure) — divider, large value,
   * descriptive line, matching Hero's condition variant. */
  stat?: { value: string; description: string };
  form?: HeroFormConfig;
  /** Replaces the default form entirely, same escape hatch as Hero's formSlot. */
  formSlot?: ReactNode;
}

/** Alternate Hero treatment ("homepage-round-buttons-new-hero" in Figma):
 * photo confined to a left column instead of bleeding full-width, and the
 * lead form sits in a solid navy panel instead of Hero's LiquidGlass card
 * — at `lg` and up. Shares Hero's background-bleed trick there (negative
 * top margin sized to TopStatsBar so the photo starts at the viewport's
 * true top, behind the fixed transparent Navbar) — see
 * docs/superpowers/specs/2026-07-15-hero-section-design.md.
 *
 * Below `lg` this is a genuinely different composition, not a squeezed
 * version of the desktop one: photo leads (matching the site's established
 * look) with the H1/subhead/call-pill overlaid on it as before, and the
 * lead form lives in a compact LiquidGlass card that overlaps the photo's
 * bottom edge — same card treatment Hero.tsx already uses for its own
 * form, just floating instead of inline. The card is always `twoStep`
 * (name + phone, then a smooth height/opacity expand into the rest) so the
 * first thing below the photo is a two-field ask, never every field at
 * once — see docs/BASELINE.md's CRO audit for why. A full-width call
 * button sits right under the card as an equal-weight alternative, then
 * the trust badges. No negative-margin bleed below `lg`: TopStatsBar is
 * `hidden` there (components/layout/root-shell.tsx), so the section
 * already starts at the viewport's true top with nothing to cancel out —
 * the H1's own pt-[220px] alone clears the fixed Navbar. */
export function HeroSolidPanel({
  background,
  eyebrow,
  badge,
  title,
  subhead,
  callPill,
  bilingualNote,
  stat,
  form,
  formSlot,
}: HeroSolidPanelProps) {
  return (
    <section className="relative flex flex-col overflow-hidden lg:-mt-[176px] lg:min-h-[860px] lg:flex-row">
      <div className="relative min-h-[620px] lg:min-h-full lg:flex-1">
        <Image
          src={background.src}
          alt={background.alt}
          fill
          priority
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <Container>
          <div className="container relative z-10 flex h-full flex-col justify-center pt-[220px] pb-24 lg:pb-16 lg:pt-[350px] lg:pr-12">
            {eyebrow && <Eyebrow variant="onDark">{eyebrow}</Eyebrow>}
            {badge && (
              <span className="w-fit rounded-full bg-teal-500 px-6 py-3 font-sans text-button text-white">
                {badge}
              </span>
            )}

            <h1 className="font-display text-hero font-medium text-white">
              <FadeIn as="span">{title}</FadeIn>
            </h1>

            <p className="max-w-[560px] font-sans text-body-lg text-mute-300 mt-8">
              <FadeIn as="span" delay={0.15}>
                {subhead}
              </FadeIn>
            </p>

            {callPill && (
              <a href={siteConfig.business.phoneHref} className="flex items-start gap-4 mt-20 mb-4">
                <PhoneIcon className="size-15 shrink-0 rounded-full bg-teal-500 p-2.5 text-white" />
                <span className="flex flex-col">
                  <span className="font-alt text-alt-label text-mute-300">{callPill.eyebrow}</span>
                  <span className="font-display text-h2 text-white leading-10">
                    {callPill.phone}
                  </span>
                </span>
              </a>
            )}

            {bilingualNote && (
              <p className="font-alt text-alt-label text-mute-300">{bilingualNote}</p>
            )}

            {stat && (
              <div className="relative">
                <div className="absolute left-[-10%] h-px w-xl mt-3 bg-teal-300" />
                <div className="flex flex-row gap-4 pt-6">
                  <span className="mr-3 font-display text-h2 text-white">{stat.value}</span>
                  <span className="font-sans text-body-lg text-mute-300">{stat.description}</span>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Below `lg`: floating card + call button + trust badges, overlapping
       * the photo's bottom edge. Hidden at `lg`, where the navy panel below
       * takes over instead. Solid bg-navy-900 (not LiquidGlass) deliberately
       * — this card's height varies a lot (name+phone collapsed vs. every
       * field expanded), so it can't be sized to reliably stay over the
       * photo. A translucent card that spills onto the plain white page
       * below turns "white text on a dark photo" into "white text on
       * white" the moment it does — solid navy is legible regardless of
       * what's behind it. Same reasoning for the trust badges' wrapper. */}
      <div className="relative z-10 -mt-16 flex flex-col gap-4 px-4 sm:px-8 lg:hidden">
        {(formSlot ?? form) && (
          <div className="rounded-3xl bg-navy-900 p-6 shadow-card">
            {formSlot ??
              (form && (
                <LeadForm
                  heading={form.heading}
                  variant={form.variant}
                  fields={form.fields ?? leadFormVariants.heroEval.fields}
                  submitLabel={form.submitLabel}
                  onSubmit={form.onSubmit}
                  submitVariant="teal"
                  fieldOutline
                  labelCase="none"
                  headingClassName="mb-4 font-display text-card-title text-white"
                  twoStep
                  stepOneFieldNames={form.stepOneFieldNames}
                  continueLabel="Request Appointment"
                />
              ))}
          </div>
        )}

        {callPill && (
          <Button
            variant="teal"
            href={siteConfig.business.phoneHref}
            className="w-full justify-center"
          >
            Call Now: {callPill.phone.replace(/^Call /, "")}
          </Button>
        )}

        <div className="rounded-2xl bg-navy-900 p-3">
          <HeroTrustLine className="justify-center" />
        </div>
      </div>

      <div className="relative hidden flex-col justify-center bg-navy-900 px-6 pb-16 sm:px-10 lg:flex lg:w-[640px] lg:shrink-0 lg:px-16 lg:pb-0 lg:pt-[190px] xl:w-[760px] 2xl:w-[800px]">
        <HeroTrustLine className="mb-6" />

        {formSlot ??
          (form && (
            <LeadForm
              heading={form.heading}
              variant={form.variant}
              fields={form.fields ?? leadFormVariants.heroEval.fields}
              submitLabel={form.submitLabel}
              onSubmit={form.onSubmit}
              submitVariant="teal"
              fieldOutline
              labelCase="none"
              headingClassName="mb-4 font-display text-h2 text-white"
              twoStep={form.twoStep}
              stepOneFieldNames={form.stepOneFieldNames}
            />
          ))}
        {form?.footerNote && (
          <p className="mt-6 font-sans text-body-lg text-mute-300">{form.footerNote}</p>
        )}
      </div>
    </section>
  );
}
