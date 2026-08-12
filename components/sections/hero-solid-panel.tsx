import type { ReactNode } from "react";
import Image from "next/image";

import type { HeroFormConfig } from "@/components/sections/hero";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/ui/fade-in";
import { PhoneIcon } from "@/components/ui/icons/phone";
import { LeadForm } from "@/components/ui/lead-form";
import { leadFormVariants } from "@/content/lead-forms";
import { cn } from "@/lib/cn";

import { Container } from "../ui/container";

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
  /** Full-bleed background with the form (formSlot) rendered as a translucent
   * card overlaid on the right instead of the solid navy panel — used by /book,
   * whose BookingForm brings its own LiquidGlass card. Requires formSlot. */
  clearForm?: boolean;
}

/** Alternate Hero treatment ("homepage-round-buttons-new-hero" in Figma) with
 * three layouts driven by the form props:
 *   • solid panel (default, Home/Services): photo confined to a left column,
 *     the lead form in a solid navy panel on the right;
 *   • clear form (`clearForm`, /book): full-bleed photo, formatted content on
 *     the left, the form as a translucent card overlaid on the right;
 *   • no form (/about): full-bleed photo, content only.
 * Shares Hero's background-bleed trick (negative top margin sized to
 * TopStatsBar so the photo starts at the viewport's true top, behind the
 * fixed transparent Navbar) — see docs/superpowers/specs/2026-07-15-hero-section-design.md. */
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
  clearForm = false,
}: HeroSolidPanelProps) {
  const hasForm = Boolean(formSlot || form);
  // Only the default (non-clearForm) form layout splits the section into a
  // photo column + navy panel; clearForm and no-form both keep the photo
  // full-bleed across the whole section.
  const solidPanel = hasForm && !clearForm;

  const heroContent = (
    <div className="flex flex-col gap-4">
      {eyebrow && <Eyebrow variant="onDark">{eyebrow}</Eyebrow>}
      {badge && (
        <span className="w-fit rounded-full bg-[#58A0A0] px-6 py-3 font-sans text-button text-white">
          {badge}
        </span>
      )}

      <h1 className="font-display text-7xl font-normal text-white">
        <FadeIn as="span">{title}</FadeIn>
      </h1>

      <p className="mt-10 max-w-[560px] font-sans text-body-lg text-mute-300">
        <FadeIn as="span" delay={0.15}>
          {subhead}
        </FadeIn>
      </p>

      {callPill && (
        <div className="mt-8 mb-4 flex items-start gap-4">
          <PhoneIcon className="size-15 shrink-0 rounded-full bg-[#58A0A0] p-2.5 text-white" />
          <span className="flex flex-col">
            <span className="font-alt text-alt-label text-mute-300">{callPill.eyebrow}</span>
            <a
              href={`tel:${callPill.phone.replace(/[^\d+]/g, "")}`}
              className="w-fit cursor-pointer font-display text-h2 leading-10 text-white hover:underline"
            >
              {callPill.phone}
            </a>
          </span>
        </div>
      )}

      {bilingualNote && <p className="font-alt text-alt-label text-mute-300">{bilingualNote}</p>}

      {stat && (
        <div className="relative">
          <div className="w-xl absolute left-[-10%] mt-3 h-px bg-teal-300" />
          <div className="flex flex-row gap-4 pt-6">
            <span className="mr-3 font-display text-h2 text-white">{stat.value}</span>
            <span className="font-sans text-body-lg text-mute-300">{stat.description}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section
      className={cn(
        "relative -mt-[460px] overflow-hidden min-[400px]:-mt-[392px] sm:-mt-[304px] md:-mt-[240px] lg:-mt-[176px] lg:min-h-[975px] border pt-10",
        solidPanel && "lg:flex",
      )}
    >
      <div className={cn("lg:min-h-full border-red-500", solidPanel && "lg:flex-1")}>
        <Image
          src={background.src}
          alt={background.alt}
          fill
          priority
          sizes={solidPanel ? "(min-width: 1024px) 62vw, 100vw" : "100vw"}
          className="object-cover"
        />
        {/* Darker toward the left reading edge so the headline, subhead, and
         * call pill stay legible over the photo, easing off as the image meets
         * the navy form panel — the "homepage-round-buttons-new-hero" Figma
         * backdrop (flat 58% black there; graded here so the reading edge is
         * darker without over-darkening the whole photo). */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/50" />
        <Container>
          <div
            className={cn(
              "container relative z-10 flex h-full flex-col justify-center pt-[220px] pb-16 ",
              !clearForm && "lg:pr-12",
            )}
          >
            {clearForm ? (
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                {heroContent}
                <div className="flex w-full flex-col gap-6 lg:items-end">{formSlot}</div>
              </div>
            ) : (
              heroContent
            )}
          </div>
        </Container>
      </div>

      {solidPanel && (
        <div className="relative flex flex-col justify-center bg-navy-900 px-6 py-16 sm:px-10 lg:w-[500px] lg:shrink-0 lg:px-16 lg:py-0 xl:w-[640px] 2xl:w-[720px]">
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
                headingClassName="mb-8 font-display text-h1 text-white"
              />
            ))}
          {form?.footerNote && (
            <p className="mt-6 font-sans text-body-lg text-mute-300">{form.footerNote}</p>
          )}
        </div>
      )}
    </section>
  );
}
