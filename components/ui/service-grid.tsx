import { ServiceCard, type ServiceCardItem } from "@/components/ui/service-card";
import { cn } from "@/lib/cn";

export interface ServiceGridProps {
  items: ServiceCardItem[];
  className?: string;
}

/** Responsive 3×2 service grid per condition-page-spec §B9: 1 col (mobile)
 * → 2 col (sm) → 3 col (lg). Generic over ServiceCardItem so condition's
 * "What we treat" grid can reuse it once condition content gains images. */
export function ServiceGrid({ items, className }: ServiceGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item) => (
        <ServiceCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
