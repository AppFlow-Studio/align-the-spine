import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import type { PublicContentItem } from "@/lib/content/types";

export function ArticleCard({ item }: { item: PublicContentItem }) {
  const published = item.publishedAt ? new Date(item.publishedAt) : undefined;
  return (
    <article className="group overflow-hidden rounded-30 bg-white shadow-comparison">
      {item.featuredImage ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={item.featuredImage.url}
            alt={item.featuredImage.alt}
            fill
            sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-500">
          {item.categorySlugs[0]?.replaceAll("-", " ") ?? "Resource"}
        </p>
        <h2 className="mt-3 font-display text-3xl leading-tight text-navy-800">
          <Link
            href={`/blog/${item.slug}`}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
          >
            {item.title}
          </Link>
        </h2>
        <p className="mt-3 text-base leading-7 text-ink-500">{item.excerpt}</p>
        <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-500">
          <span>By {item.author.name}</span>
          {published ? (
            <time dateTime={published.toISOString()}>
              {published.toLocaleDateString("en-US", { dateStyle: "medium" })}
            </time>
          ) : null}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4 text-sm text-ink-500">
          <span>{item.estimatedReadingMinutes} min read</span>
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white"
          >
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
