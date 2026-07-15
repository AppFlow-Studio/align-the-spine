import type { ReactNode } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LeadForm, type LeadFormValues } from "@/components/ui/lead-form";
import { siteConfig } from "@/content/site";

export interface HeroCta {
  label: string;
  href: string;
  variant?: "primary" | "teal" | "cta";
}

export interface HeroFormConfig {
  heading: string;
  submitLabel: string;
  footerNote?: string;
  onSubmit?: (values: LeadFormValues) => Promise<void>;
}

export interface HeroProps {
  variant: "home" | "condition";
  background: { src: string; alt: string };
  spineOverlay?: boolean;
  eyebrow?: string;
  title: ReactNode;
  subhead: string;
  conditionChip?: string;
  badge?: string;
  ctas?: HeroCta[];
  callPill?: { eyebrow: string; phone: string };
  bilingualNote?: string;
  form: HeroFormConfig;
}

function HeroChip({ children }: { children: ReactNode }) {
  return (
    <span className="w-fit rounded-6 bg-teal-500 px-6 py-3 font-sans text-button text-white">
      {children}
    </span>
  );
}

/** Shared 2-column hero shell (Home + Condition variants) per
 * condition-page-spec §B1. Pulls itself above TopStatsBar via a
 * breakpoint-tuned negative top margin so its background bleeds to the
 * viewport's true top, behind the fixed transparent Navbar — see
 * docs/superpowers/specs/2026-07-15-hero-section-design.md. */
export function Hero({
  variant,
  background,
  spineOverlay = true,
  eyebrow,
  title,
  subhead,
  conditionChip,
  badge,
  ctas,
  callPill,
  bilingualNote,
  form,
}: HeroProps) {
  return (
    <section className="relative -mt-[516px] min-h-[975px] overflow-hidden sm:-mt-[304px] md:-mt-[240px] lg:-mt-[176px]">
      <Image src={background.src} alt={background.alt} fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/[.47]" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/0 to-navy-700/80" />
      {spineOverlay && (
        <Image
          src="/figma-exports/spine-skeloton.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-contain opacity-30"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-20 rounded-t-[50px] bg-white" />

      <div className="container relative z-10 grid gap-10 pb-32 pt-[220px] lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-[260px]">
        <div className="flex flex-col gap-6">
          {variant === "condition" && conditionChip && <HeroChip>{conditionChip}</HeroChip>}
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

          <h1 className="font-display text-hero text-white">{title}</h1>
          <p className="font-sans text-body-lg text-mute-300">{subhead}</p>

          {callPill && (
            <Button
              variant="glass"
              href={siteConfig.business.phoneHref}
              eyebrow={callPill.eyebrow}
              className="w-fit"
            >
              {callPill.phone}
            </Button>
          )}

          {variant === "condition" && bilingualNote && (
            <p className="font-alt text-alt-label text-mute-300">{bilingualNote}</p>
          )}

          {variant === "home" && (badge || ctas?.length) && (
            <div className="flex flex-wrap items-center gap-4">
              {badge && <HeroChip>{badge}</HeroChip>}
              {ctas?.map((cta) => (
                <Button key={cta.label} href={cta.href} variant={cta.variant ?? "primary"}>
                  {cta.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-15 bg-overlay-white-15 p-8 shadow-card">
            <LeadForm
              heading={form.heading}
              submitLabel={form.submitLabel}
              onSubmit={form.onSubmit}
            />
          </div>
          {form.footerNote && (
            <p className="font-sans text-body-lg text-white">{form.footerNote}</p>
          )}
        </div>
      </div>
    </section>
  );
}
