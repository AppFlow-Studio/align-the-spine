import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import type { ConditionFeelsLikeItem } from "@/content/conditions/types";

export interface FeelsLikeBandProps {
  eyebrow: string;
  heading: string;
  items: ConditionFeelsLikeItem[];
  background: { src: string; alt: string };
  className?: string;
}

/** Full-bleed "What [condition] feels like" band per whiplash's Figma frame:
 * a dark photo background with semi-transparent (white/10) cards, unlike
 * every other condition page's plain light FeelsLike grid. Sits right
 * after Understanding, before the causes/types section — Figma's own
 * vertical order for this frame, not the position FeelsLike content
 * occupies elsewhere. */
export function FeelsLikeBand({
  eyebrow,
  heading,
  items,
  background,
  className,
}: FeelsLikeBandProps) {
  return (
    <Section spacing="none" className={className}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={background.src} alt={background.alt} fill className="object-cover" />
          {/* <div className="absolute inset-0 bg-navy-900/40" /> */}
        </div>
        <Container className="relative flex flex-col gap-10 py-16 md:py-20">
          <div className="flex flex-col gap-3">
            <Eyebrow variant="onDark">{eyebrow}</Eyebrow>
            <h2 className="font-display text-h2 text-white">{heading}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.title} className="group flex flex-col gap-3 bg-overlay-white-15 p-6">
                <h3 className="font-display text-type-name text-white transition-colors group-hover:text-teal-500">
                  {item.title}
                </h3>
                <p className="font-alt text-faq-a text-mute-300">{item.desc}</p>
                {item.learnMoreHref && (
                  <Link
                    href={item.learnMoreHref}
                    className="inline-flex w-fit items-center gap-2 font-sans text-stat-label uppercase text-white underline-offset-4 transition-colors group-hover:text-teal-500 group-hover:underline"
                  >
                    Learn more
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Container>
      </div>
    </Section>
  );
}
