import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface ServiceListRowProps {
  item: ServiceCardItem;
  className?: string;
}

/** Services-list row per Figma (file NHwBqbGepOspY0GrCnECnj, node 96:155,
 * "Online Appointment" section): image fixed to the left, title/meta/
 * description/"Book" button on the right for every row — the source design
 * never alternates image side. No Divider baked in — the consumer renders
 * one before each row (see ServicesSection). */
export function ServiceListRow({ item, className }: ServiceListRowProps) {
  return (
    <div
      className={cn("flex flex-col gap-6 py-10 md:flex-row md:items-start md:gap-10", className)}
    >
      <div className="relative aspect-[670/374] w-full shrink-0 md:w-[45%]">
        <Image src={item.image.src} alt={item.image.alt} fill className="rounded-15 object-cover" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-4">
        <h3 className="font-display text-card-title text-navy-900">{item.name}</h3>
        <p className="font-sans text-card-body">
          <span className="text-ink-500">
            {item.duration} | Contact us {siteConfig.business.phone}
          </span>
          <br />
          <span className="text-ink-900">{item.summary}</span>
        </p>
        <Button variant="book" href={siteConfig.bookingCta.href} className="mt-2">
          Book
        </Button>
      </div>
    </div>
  );
}
