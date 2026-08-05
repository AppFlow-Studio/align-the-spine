import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbList, type BreadcrumbItemInput } from "@/lib/schema";

export interface BreadcrumbJsonLdProps {
  items: BreadcrumbItemInput[];
}

/** BreadcrumbList JSON-LD for an interior page (ATS schema ticket §2.6).
 * `items` must match the page's actual navigation path — always starts
 * with `{ name: "Home", path: "" }`. */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return <JsonLd data={buildBreadcrumbList(items)} />;
}
