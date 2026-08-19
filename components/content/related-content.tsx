import Link from "next/link";

import type { PublicContentItem } from "@/lib/content/types";

export function RelatedContent({ items, area }: { items: PublicContentItem[]; area: boolean }) {
  return (
    <section className="mt-14 border-t border-mute-300 pt-8" aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-display text-3xl text-navy-800">
        {area ? "Nearby areas and relevant articles" : "Related articles"}
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((related) => {
          const href =
            related.contentType === "service_area"
              ? `/service-areas/${related.slug}`
              : `/blog/${related.slug}`;
          return (
            <Link
              key={related.id}
              href={href}
              className="block rounded-20 border border-mute-300 bg-white p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-teal-500">
                {related.contentType === "service_area" ? "Service area" : "Article"}
              </p>
              <p className="mt-2 font-display text-lg leading-tight text-navy-800">
                {related.title}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
