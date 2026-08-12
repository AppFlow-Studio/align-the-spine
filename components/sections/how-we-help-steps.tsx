import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export interface HowWeHelpStep {
  image: string;
  alt: string;
  title: string;
  description: string;
}

export interface HowWeHelpStepsProps {
  heading: string;
  steps: HowWeHelpStep[];
  /** Omit when the page has its own CTA band directly after this section
   * (e.g. /auto-accidents) — the closing booking CTA button is optional,
   * not every page's design wants one directly under the steps. */
  cta?: { label: string; href: string };
}

/** "HOW WE HELP" 3-step section, reused across pages with variant copy —
 * originally built for Home-visits (ATS-110), also used on /auto-accidents:
 * photo + title + copy per step, plus an optional closing booking CTA. */
export function HowWeHelpSteps({ heading, steps, cta }: HowWeHelpStepsProps) {
  return (
    <div className="flex flex-col items-center gap-14 text-center">
      <SectionHeading eyebrow="How We Help" className="max-w-2xl font-medium items-center">
        {heading}
      </SectionHeading>

      <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
        {steps.map((step) => (
          <div key={step.title} className="flex flex-col gap-6 text-left group">
            <div className="relative h-[246px] overflow-hidden">
              <Image
                src={step.image}
                alt={step.alt}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-h1 text-navy-800 group-hover:text-teal-500 transition-colors duration-300">
                {step.title}
              </h3>
              <hr className="border-t border-navy-900 transition-colors duration-300 group-hover:border-teal-500" />
              <p className="font-sans text-body-lg text-ink-900">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {cta && (
        <Button variant="cta" href={cta.href}>
          {cta.label}
        </Button>
      )}
    </div>
  );
}
