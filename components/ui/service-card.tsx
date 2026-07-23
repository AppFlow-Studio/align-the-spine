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

/** Service card per condition-page-spec §B9: image (r15), title (Newsreader
 * Medium 35 navy-800), description (Poppins 22/38 ink-900), "Book now" ghost
 * link. Card r20, ~507×618 proportions via aspect-ratio (not hardcoded px)
 * so ServiceGrid can collapse responsively. */
export function ServiceCard({ item, className }: ServiceCardProps) {
  return (
    <Card radius={20} shadow="card" className={cn("flex flex-col overflow-hidden", className)}>
      <div className="relative aspect-[507/360] w-full shrink-0">
        <Image src={item.image.src} alt={item.image.alt} fill className="rounded-15 object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-8">
        <h3 className="break-words font-display text-card-title text-navy-800">{item.name}</h3>
        <p className="font-sans text-card-body text-ink-900">{item.summary}</p>
        <Button variant="ghost" href={siteConfig.bookingCta.href} className="mt-auto w-fit">
          Book now
        </Button>
      </div>
    </Card>
  );
}
