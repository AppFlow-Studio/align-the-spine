import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface ServiceCardItem {
  slug: string;
  name: string;
  duration: string;
  summary: string;
  image: { src: string; alt: string };
}

export interface ServiceCardProps {
  item: ServiceCardItem;
  className?: string;
}

/** Service card per condition-page-spec §B9: image (r15, desaturated per the
 * reference design), title (Newsreader Medium 35 navy-800), description
 * (Poppins 22/38 ink-900), "Book now" ghost link. Flush against the page
 * background — no card shadow/elevation — per the reference design.
 * ~507×618 proportions via aspect-ratio (not hardcoded px) so ServiceGrid
 * can collapse responsively. */
export function ServiceCard({ item, className }: ServiceCardProps) {
  return (
    <Card
      id={item.slug}
      shadow="none"
      className={cn("group scroll-mt-[120px] flex flex-col overflow-hidden", className)}
    >
      <div className="relative aspect-[507/360] w-full shrink-0">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale contrast-110 brightness-90 transition-[filter] duration-300 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
        />
      </div>
      <div className="flex flex-1 flex-col gap-6 py-8">
        <div className="flex flex-col gap-3">
          <h3 className="break-words border-b border-navy-900 pb-3 font-display text-card-title text-navy-800">
            {item.name}
          </h3>
          <p className="font-sans text-card-body text-ink-900">{item.summary}</p>
        </div>
        <Button
          variant="ghost"
          href={siteConfig.bookingCta.href}
          className="mt-auto w-fit text-body-lg"
        >
          Book now
        </Button>
      </div>
    </Card>
  );
}
