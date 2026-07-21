import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface ServiceListRowProps {
  item: ServiceCardItem;
  /** Alternates image side per row index — true puts the image on the right. */
  reverse?: boolean;
  className?: string;
}

/** Alternating list-style service row per condition-page-spec §B9
 * (services-3 / homepage list layout): image one side, title/description/
 * "Book" ghost link the other. No divider baked in — the consumer renders
 * one between rows (see ServicesSection). */
export function ServiceListRow({ item, reverse = false, className }: ServiceListRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 py-8 md:flex-row md:items-center md:gap-10",
        reverse && "md:flex-row-reverse",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 md:w-[360px]">
        <Image src={item.image.src} alt={item.image.alt} fill className="rounded-15 object-cover" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-3">
        <h3 className="font-display text-card-title text-navy-800">{item.name}</h3>
        <p className="font-sans text-card-body text-ink-900">{item.summary}</p>
        <Button variant="ghost" href={siteConfig.bookingCta.href}>
          Book
        </Button>
      </div>
    </div>
  );
}
