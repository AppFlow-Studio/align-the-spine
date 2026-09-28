import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/content/article-card";
import { BlogHero } from "@/components/content/blog-hero";
import { FeaturedArticleCard } from "@/components/content/featured-article-card";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { LeadFormPopup } from "@/components/ui/lead-form-popup";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { listPublicCategories, listPublicContent } from "@/lib/content/public-content";
import { buildCollectionPage } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo/metadata";

/** The hub's canonical has to describe the variant actually being served, or
 * every page of the archive collapses onto /blog and its posts lose the one
 * listing page that links to them.
 *
 * - `?page=N` and `?topic=` self-canonicalize: they are real, stable,
 *   crawlable slices of the archive.
 * - `?q=` does not. An on-site search result is a different page for every
 *   visitor, has no stable content, and is exactly what Google's guidance on
 *   "search result pages" says to keep out of the index — so it's noindex,
 *   follow (crawl through to the posts, don't index the list).
 *
 * Title/description still come from content/seo.ts (ATS-SEO-021: they were
 * once duplicated here and drifted), with the page number appended so
 * paginated titles aren't identical.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; topic?: string; q?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const route = getRoute("/blog");
  const page = Math.max(1, Number(params.page) || 1);
  const topic = params.topic?.trim();
  const query = new URLSearchParams();
  if (topic) query.set("topic", topic);
  if (page > 1) query.set("page", String(page));
  const suffix = query.toString();

  const metadata = buildMetadata({
    ...route,
    path: suffix ? `/blog?${suffix}` : "/blog",
    title: page > 1 ? `${route.title} — Page ${page}` : route.title,
    ...(params.q?.trim() ? { robots: { index: false, follow: true } } : {}),
  });
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      // Declares the Atom feed app/feed.xml already serves, so feed readers
      // and crawlers can discover it from the hub instead of guessing the URL.
      types: { "application/atom+xml": `${siteConfig.siteUrl}/feed.xml` },
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; topic?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const searchQuery = params.q?.trim() || undefined;
  const [result, topics] = await Promise.all([
    listPublicContent({
      contentType: "blog_post",
      page,
      pageSize: 9,
      category: params.topic,
      query: searchQuery,
    }),
    listPublicCategories("blog_post"),
  ]);
  const showFeatured = page === 1 && !params.topic && !searchQuery;
  const featured = showFeatured ? result.items.find((item) => item.featured) : undefined;
  const gridItems = featured
    ? result.items.filter((item) => item.id !== featured.id)
    : result.items;
  const pageHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (params.topic) query.set("topic", params.topic);
    if (searchQuery) query.set("q", searchQuery);
    if (targetPage > 1) query.set("page", String(targetPage));
    const qs = query.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };
  const breadcrumbs = [
    { name: "Home", path: "" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <div className="bg-panel-100 pb-24">
      <BreadcrumbJsonLd items={breadcrumbs} />
      {/* Mirrors the cards actually rendered below — the featured post plus
          the grid, in the order they appear — so the ItemList matches visible
          content on every page, topic, and search variant. */}
      <JsonLd
        data={buildCollectionPage({
          path: "/blog",
          name: getRoute("/blog").title,
          description: getRoute("/blog").description,
          items: [...(featured ? [featured] : []), ...gridItems].map((item) => ({
            name: item.title,
            path: `/blog/${item.slug}`,
          })),
        })}
      />
      <BlogHero
        breadcrumbs={breadcrumbs}
        eyebrow="Patient resources"
        title="Chiropractic & Accident Recovery Resources"
        subhead="Clear information for everyday mobility, preparing for care, and navigating the days after a car accident—grounded in one Deerfield Beach office and careful about what still needs confirmation."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={siteConfig.business.phoneHref}
            className="inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-navy-900 transition-colors hover:bg-mute-300"
          >
            Call {siteConfig.business.phone}
          </a>
          <LeadFormPopup
            formHeading="Check Your Car Accident Eligibility"
            formVariant="carAccident"
            triggerClassName="inline-flex min-h-11 items-center rounded-full border border-white px-6 py-2 font-semibold text-white transition-colors hover:border-teal-500 hover:bg-teal-500"
          >
            Hurt in a car accident? See a chiropractor today
          </LeadFormPopup>
        </div>
      </BlogHero>
      <section className="container mt-12" aria-labelledby="topics-heading">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="topics-heading" className="font-display text-3xl text-navy-800">
            Browse by topic
          </h2>
          <form
            method="get"
            action="/blog"
            role="search"
            className="flex min-h-11 items-center gap-2"
          >
            {params.topic ? <input type="hidden" name="topic" value={params.topic} /> : null}
            <label htmlFor="blog-search" className="sr-only">
              Search resources
            </label>
            <input
              id="blog-search"
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search resources"
              className="min-h-11 w-56 rounded-full border border-mute-300 bg-white px-5 text-sm text-navy-800 placeholder:text-ink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center rounded-full bg-navy-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
            >
              Search
            </button>
          </form>
        </div>
        <nav aria-label="Blog topics" className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/blog"
            aria-current={!params.topic ? "page" : undefined}
            className="inline-flex min-h-11 items-center rounded-full border border-navy-800 px-5 text-sm font-semibold text-navy-800 transition-colors hover:bg-navy-800 hover:text-white"
          >
            All resources
          </Link>
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/blog?topic=${topic.slug}`}
              aria-current={params.topic === topic.slug ? "page" : undefined}
              className="inline-flex min-h-11 items-center rounded-full border border-mute-300 bg-white px-5 text-sm font-semibold capitalize text-navy-800 transition-colors hover:border-navy-800"
            >
              {topic.name} <span className="ml-1 text-ink-500">({topic.count})</span>
            </Link>
          ))}
        </nav>
      </section>
      {featured ? (
        <section className="container mt-12" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="sr-only">
            Featured resource
          </h2>
          <FeaturedArticleCard item={featured} />
        </section>
      ) : null}
      <section className="container mt-12" aria-labelledby="latest-heading">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-500">
              Reviewed resources
            </p>
            <h2 id="latest-heading" className="mt-2 font-display text-4xl text-navy-800">
              {searchQuery ? `Results for "${searchQuery}"` : "Latest and useful"}
            </h2>
          </div>
        </div>
        {gridItems.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {gridItems.map((item) => (
              <ArticleCard key={item.id} item={item} />
            ))}
          </div>
        ) : searchQuery || params.topic ? (
          <div className="mt-8 rounded-30 border border-mute-300 bg-white p-8 sm:p-12">
            <h3 className="font-display text-3xl text-navy-800">No matching resources yet</h3>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-ink-500">
              {searchQuery
                ? `Nothing published matches "${searchQuery}" right now.`
                : "Nothing published in this topic yet."}{" "}
              Try a different search or browse all resources.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center rounded-full bg-navy-900 px-6 font-semibold text-white transition-colors hover:bg-navy-700"
              >
                Browse all resources
              </Link>
              <a
                href={siteConfig.business.phoneHref}
                className="inline-flex min-h-11 items-center rounded-full border border-navy-900 px-6 font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
              >
                Call the office
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-30 border border-mute-300 bg-white p-8 sm:p-12">
            <h3 className="font-display text-3xl text-navy-800">
              Resources are in clinical review
            </h3>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-ink-500">
              Drafts stay out of search and off the public site until their sources, medical
              guidance, author, and reviewer details pass the publication checklist. In the
              meantime, explore current services or call with a question.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center rounded-full bg-navy-900 px-6 font-semibold text-white transition-colors hover:bg-navy-700"
              >
                Explore services
              </Link>
              <a
                href={siteConfig.business.phoneHref}
                className="inline-flex min-h-11 items-center rounded-full border border-navy-900 px-6 font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
              >
                Call the office
              </a>
            </div>
          </div>
        )}
        {result.totalPages > 1 ? (
          <nav aria-label="Blog pagination" className="mt-10 flex justify-center gap-3">
            {page > 1 ? (
              <Link
                href={pageHref(page - 1)}
                rel="prev"
                className="inline-flex min-h-11 items-center rounded-full border px-5 transition-colors hover:bg-navy-800 hover:text-white"
              >
                Previous
              </Link>
            ) : null}
            {page < result.totalPages ? (
              <Link
                href={pageHref(page + 1)}
                rel="next"
                className="inline-flex min-h-11 items-center rounded-full border px-5 transition-colors hover:bg-navy-800 hover:text-white"
              >
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </div>
  );
}
