import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArticleFaqSection } from "@/components/content/article-faq-section";
import { BlogArticleHero } from "@/components/content/blog-article-hero";
import { ContentBlocks, TableOfContents } from "@/components/content/content-blocks";
import { RelatedContent } from "@/components/content/related-content";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { cn } from "@/lib/cn";
import type { PublicContentItem } from "@/lib/content/types";

export function ContentArticle({
  item,
  area = false,
  relatedItems = [],
  hideHeader = false,
  topSlot,
}: {
  item: PublicContentItem;
  area?: boolean;
  relatedItems?: PublicContentItem[];
  /** Skips the breadcrumb/eyebrow/H1/meta block and featured image — used
   * on /service-areas/[slug], which renders its own richer hero
   * (ServiceAreaHero) above this component instead. */
  hideHeader?: boolean;
  /** Rendered between the key-takeaway box and the body blocks — the
   * service-area detail page uses this for AccidentImpactVisual. */
  topSlot?: ReactNode;
}) {
  const published = item.publishedAt ? new Date(item.publishedAt) : undefined;
  const updated = new Date(item.updatedAt);
  // Blog articles get the full photo hero (matching /blog's own hero) when
  // there's a featured image to build it from; content published as
  // deliberately decorative-image-free falls back to the plain header below.
  const showHero = !hideHeader && Boolean(item.featuredImage);
  return (
    <div className="bg-white pb-20">
      {showHero && <BlogArticleHero item={item} area={area} />}
      <div className={cn("container", !showHero && (hideHeader ? "pt-14" : "pt-[120px]"))}>
        {!hideHeader && !showHero && (
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={area ? "/service-areas" : "/blog"}>
                  {area ? "Service areas" : "Blog"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{item.title}</li>
            </ol>
          </nav>
        )}
        {!hideHeader && !showHero && (
          <header className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-500">
              {area
                ? "Service area"
                : (item.categorySlugs[0]?.replaceAll("-", " ") ?? "Patient resource")}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] text-navy-800 sm:text-5xl lg:text-7xl">
              {item.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-ink-500">{item.excerpt}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink-500">
              <span>By {item.author.name}</span>
              {item.clinicianReviewerName ? (
                <span>Clinically reviewed by {item.clinicianReviewerName}</span>
              ) : null}
              {published ? (
                <time dateTime={published.toISOString()}>
                  Published {published.toLocaleDateString("en-US", { dateStyle: "medium" })}
                </time>
              ) : null}
              <time dateTime={updated.toISOString()}>
                Updated {updated.toLocaleDateString("en-US", { dateStyle: "medium" })}
              </time>
              {!area ? <span>{item.estimatedReadingMinutes} min read</span> : null}
            </div>
          </header>
        )}
        {item.featuredImage && !hideHeader && !showHero ? (
          <div className="relative mx-auto mt-10 aspect-[16/8] max-w-6xl overflow-hidden rounded-30">
            <Image
              src={item.featuredImage.url}
              alt={item.featuredImage.alt}
              fill
              priority
              sizes="(min-width: 1280px) 1152px, calc(100vw - 32px)"
              className="object-cover"
            />
          </div>
        ) : null}
        <div
          className={cn(
            "mx-auto max-w-[1320px] lg:grid lg:grid-cols-[minmax(0,860px)_280px] lg:items-start lg:gap-16",
            !hideHeader && !showHero ? "mt-10" : "mt-2",
          )}
        >
          <div>
            <section
              aria-labelledby="direct-answer"
              className="mb-10 rounded-20 border border-teal-500/30 bg-[#e9f7f5] p-6 sm:p-8"
            >
              <h2 id="direct-answer" className="font-display text-2xl text-navy-800">
                Key takeaways
              </h2>
              <p className="mt-3 text-lg leading-8 text-ink-900">{item.directAnswer}</p>
              {item.keyTakeaways.length ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-teal-500">
                  {item.keyTakeaways.map((takeaway) => (
                    <li key={takeaway} className="text-base leading-7 text-ink-900">
                      {takeaway}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
            {topSlot ? <div className="mb-10">{topSlot}</div> : null}
            <ContentBlocks blocks={item.blocks} />
            {item.sources.length ? (
              <section
                className="mt-14 border-t border-mute-300 pt-8"
                aria-labelledby="sources-heading"
              >
                <h2 id="sources-heading" className="font-display text-3xl text-navy-800">
                  Sources
                </h2>
                <ol className="mt-5 space-y-4 text-sm leading-6 text-ink-500">
                  {item.sources.map((source) => (
                    <li key={source.id}>
                      <a
                        href={source.url}
                        rel="noreferrer"
                        className="font-medium text-teal-500 underline underline-offset-4"
                      >
                        {source.title}
                      </a>
                      , {source.publisher}. Accessed{" "}
                      <time dateTime={source.accessedDate}>{source.accessedDate}</time>.{" "}
                      {source.geography ? `Scope: ${source.geography}.` : null}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
            {relatedItems.length ? <RelatedContent items={relatedItems} area={area} /> : null}
            <ArticleFaqSection faqs={item.faqs} />
            <aside className="mt-12 rounded-30 bg-navy-900 p-8 text-white sm:p-10">
              <h2 className="font-display text-3xl">Have a question about an evaluation?</h2>
              <p className="mt-3 max-w-xl leading-7 text-white">
                Call the Deerfield Beach office or request an appointment. A request does not
                confirm a time, coverage, eligibility, or a home visit.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="tel:+19545737192"
                  className="inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-navy-900 transition-colors hover:bg-mute-300"
                >
                  Call (954) 573-7192
                </a>
                <Link
                  href="/book-an-appointment"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white px-6 font-semibold text-white transition-colors hover:border-teal-500 hover:bg-teal-500"
                >
                  Request an appointment <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
          <aside className="hidden lg:sticky lg:top-[120px] lg:block">
            <TableOfContents blocks={item.blocks} />
          </aside>
        </div>
      </div>
    </div>
  );
}
