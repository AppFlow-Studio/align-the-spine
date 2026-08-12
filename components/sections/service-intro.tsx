import type { ReactNode } from "react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

const COLUMN_CLASSES = {
  /** Text 3 : media 2 — the default the adjustments page uses. */
  "3/2": "lg:grid-cols-[3fr_2fr]",
  /** Even split — the spinal-decompression page's dual-diagram layout. */
  "1/1": "lg:grid-cols-2",
} as const;

export interface ServiceIntroProps {
  /** Uppercase teal eyebrow label above the heading. */
  eyebrow: string;
  /** Section heading — rendered as font-display text-h2 (Fraunces, 48px cap). */
  heading: ReactNode;
  /** Body copy. May include inline links; wrapped in a single body-lg <p>. */
  children: ReactNode;
  /** Optional CTA anchor under the body, with the hover-arrow treatment. */
  cta?: { href: string; label: string };
  /** Hairline rule between the body and the CTA (or a closing rule when there's no CTA). */
  divider?: boolean;
  /** Common case: one supporting image in the right column (portrait 5:6, hover-zoom). */
  image?: { src: string; alt: string };
  /** Custom right-column media (e.g. a pair of diagrams). Takes precedence over `image`. */
  media?: ReactNode;
  /** lg grid template for the text/media split. Defaults to a 3:2 ratio. */
  columns?: keyof typeof COLUMN_CLASSES;
  className?: string;
}

/** Two-column "understanding the treatment" intro — eyebrow, heading, body,
 * optional hairline + hover-arrow CTA on the left, and a supporting image (or
 * custom media) on the right. Collapses to a single column below lg. Shared by
 * the /services/* pages (adjustments, spinal-decompression, massage). */
export function ServiceIntro({
  eyebrow,
  heading,
  children,
  cta,
  divider = false,
  image,
  media,
  columns = "3/2",
  className,
}: ServiceIntroProps) {
  return (
    <Section className={className}>
      <Container
        className={cn("grid grid-cols-1 gap-10 lg:items-start lg:gap-16", COLUMN_CLASSES[columns])}
      >
        <div className="flex flex-col gap-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display text-h2 text-navy-900">{heading}</h2>
          <p className="font-sans text-body-lg text-ink-500">{children}</p>
          {divider && <div className="w-full border-t border-mute-350" />}
          {cta && (
            <a
              href={cta.href}
              className="group inline-flex w-fit items-center gap-2 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:text-navy-700 hover:decoration-navy-700"
            >
              {cta.label}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          )}
        </div>
        {media ??
          (image && (
            <div className="relative mx-auto aspect-5/6 w-full max-w-md overflow-hidden lg:mx-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 32vw, 100vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
      </Container>
    </Section>
  );
}
