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
}

/** Alternate Hero treatment ("homepage-round-buttons-new-hero" in Figma):
 * photo confined to a left column instead of bleeding full-width, and the
 * lead form sits in a solid navy panel instead of Hero's LiquidGlass card.
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
}: HeroSolidPanelProps) {
  // No form/formSlot → full-bleed condition hero (e.g. /about's about-drabe
  // Figma frame): the photo spans the whole section and the navy form panel is
  // dropped, instead of the two-column split Home/Services use.
  const hasForm = Boolean(formSlot || form);
  return (
    <section
      className={cn(
        "relative -mt-[460px] overflow-hidden min-[400px]:-mt-[392px] sm:-mt-[304px] md:-mt-[240px] lg:-mt-[176px] lg:min-h-[975px]",
        hasForm && "lg:flex",
      )}
    >
      <div className={cn("relative min-h-[720px] lg:min-h-full", hasForm && "lg:flex-1")}>
        <Image
          src={background.src}
          alt={background.alt}
          fill
          priority
          sizes={hasForm ? "(min-width: 1024px) 62vw, 100vw" : "100vw"}
          className="object-cover"
        />
        {/* Darker toward the left reading edge so the headline, subhead, and
         * call pill stay legible over the photo, easing off as the image meets
         * the navy form panel — the "homepage-round-buttons-new-hero" Figma
         * backdrop (flat 58% black there; graded here so the reading edge is
         * darker without over-darkening the whole photo). */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/50" />
        <Container>
          <div className="container relative z-10 flex h-full flex-col justify-center pt-[220px] pb-16 lg:pt-[350px] lg:pr-12">
            {eyebrow && <Eyebrow variant="onDark">{eyebrow}</Eyebrow>}
            {badge && (
              <span className="w-fit rounded-full bg-teal-500 px-6 py-3 font-sans text-button text-white">
                {badge}
              </span>
            )}

            <h1 className="font-display text-hero font-normal text-white">
              <FadeIn as="span">{title}</FadeIn>
            </h1>

            <p className="max-w-[560px] font-sans text-body-lg text-mute-300 mt-10">
              <FadeIn as="span" delay={0.15}>
                {subhead}
              </FadeIn>
            </p>

            {callPill && (
              <div className="flex items-start gap-4 mt-8 mb-4">
                <PhoneIcon className="size-15 shrink-0 rounded-full bg-teal-500 p-2.5 text-white" />
                <span className="flex flex-col">
                  <span className="font-alt text-alt-label text-mute-300">{callPill.eyebrow}</span>
                  <span className="font-display text-h2 text-white leading-10">
                    {callPill.phone}
                  </span>
                </span>
              </div>
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

      {hasForm && (
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
