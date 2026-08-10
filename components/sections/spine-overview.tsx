import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SpineOverviewContent } from "@/content/spine-overview";

export interface SpineOverviewProps {
  content: SpineOverviewContent;
}

/** Static "Understanding the spine" diagram — Home page only. The region
 * labels, connector lines, and captions are all baked into the source
 * image, so unlike PointToWhereItHurts (the interactive hotspot version
 * used on the condition pages) this section is just a heading + image,
 * no selection state. */
export function SpineOverview({ content }: SpineOverviewProps) {
  const { eyebrow, heading, image } = content;

  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-center gap-14 text-center">
        <SectionHeading eyebrow={eyebrow}>{heading}</SectionHeading>

        <Image
          src={image.src}
          alt={image.alt}
          width={1195}
          height={764}
          sizes="(min-width: 1024px) 900px, 100vw"
          className="h-auto w-full max-w-[900px]"
        />
      </Container>
    </Section>
  );
}
