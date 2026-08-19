import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import type { PublicContentItem } from "@/lib/content/types";

export function FeaturedArticleCard({ item }: { item: PublicContentItem }) {
  const published = item.publishedAt ? new Date(item.publishedAt) : undefined;
  return (
    <article
      className={`group grid overflow-hidden rounded-40 bg-white shadow-comparison ${
        item.featuredImage ? "lg:grid-cols-[1.1fr_0.9fr]" : ""
      }`}
    >
      {item.featuredImage ? (
        <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
          <Image
            src={item.featuredImage.url}
            alt={item.featuredImage.alt}
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="flex flex-col justify-center p-8 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-500">
          Featured resource
        </p>
        <h2 className="mt-3 font-display text-3xl leading-tight text-navy-800 sm:text-4xl">
          <Link
            href={`/blog/${item.slug}`}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
          >
            {item.title}
          </Link>
        </h2>
        <p className="mt-4 text-lg leading-8 text-ink-500">{item.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-500">
          <span>By {item.author.name}</span>
          {published ? (
            <time dateTime={published.toISOString()}>
              {published.toLocaleDateString("en-US", { dateStyle: "medium" })}
            </time>
          ) : null}
          <span>{item.estimatedReadingMinutes} min read</span>
        </div>
        <Link
          href={`/blog/${item.slug}`}
          className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-navy-900 px-6 font-semibold text-white transition-colors hover:bg-navy-700"
        >
          Read the article <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
