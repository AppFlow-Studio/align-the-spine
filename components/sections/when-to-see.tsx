import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { ConditionWhenToSee } from "@/content/conditions/types";

export interface WhenToSeeProps {
  data: ConditionWhenToSee;
  className?: string;
}

/** "When to See a Chiropractor for [condition]" per the Figma condition-page
 * frames: heading + body copy left, supporting photo right. */
export function WhenToSee({ data, className }: WhenToSeeProps) {
  return (
    <Section className={className}>
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-h2 text-navy-900">{data.heading}</h2>
          <p className="font-sans text-body-lg text-ink-500">{data.body}</p>
        </div>
        <div className="relative aspect-[906/506] w-full overflow-hidden">
          <Image
            src={data.image.src}
            alt={data.image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </Section>
  );
}
