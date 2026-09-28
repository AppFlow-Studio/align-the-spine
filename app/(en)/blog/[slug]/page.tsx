import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentArticle } from "@/components/content/content-article";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/content/site";
import { getPublicContentBySlug, listPublicContentByIds } from "@/lib/content/public-content";
import { countWords } from "@/lib/content/schemas";
import { buildBlogPosting, buildMedicalWebPage, DR_ABE_PERSON_ID } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo/metadata";

// Fallback social-share image for posts that don't have a featured image
// yet (no per-post photo set via the CMS's "Featured image URL" field) —
// same reasoning as the service-area pages' fallback: a text-only OG/Twitter
// card is worse than a real, on-brand photo even if it's not unique to the
// post.
const SHARED_OG_IMAGE = {
  src: "https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg",
  alt: "Align the Spine Chiropractic treatment room in Deerfield Beach, FL",
};

/** "car-accident-care" -> "Car accident care", for `articleSection` and
 * `keywords`. The CMS stores taxonomy as slugs; these are the same strings the
 * page already shows above the H1. */
function humanize(slug: string): string {
  const spaced = slug.replaceAll("-", " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicContentBySlug("blog_post", slug);
  if (!item) return { title: "Resource not found", robots: { index: false, follow: false } };
  return buildMetadata({
    path: `/blog/${item.slug}`,
    title: item.seoTitle,
    description: item.metaDescription,
    image: item.featuredImage
      ? { src: item.featuredImage.url, alt: item.featuredImage.alt }
      : SHARED_OG_IMAGE,
    // Articles are the one page type on this site where a full-size image
    // preview and an uncapped snippet are worth asking for: they're what
    // earns the large-thumbnail treatment in search and the longer pull
    // quote in AI summaries. Every field is an explicit opt-in to more
    // exposure, never less, and buildMetadata still forces noindex outside
    // production regardless of what's set here.
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    article: {
      publishedTime: item.publishedAt,
      modifiedTime: item.updatedAt,
      authorName: item.author.name,
      section: item.categorySlugs[0] ? humanize(item.categorySlugs[0]) : undefined,
      tags: item.tagSlugs.map(humanize),
    },
  });
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicContentBySlug("blog_post", slug);
  if (!item) notFound();
  const relatedItems = await listPublicContentByIds(item.relatedContentIds);
  const authorId =
    item.author.slug === "dr-abe-nasser"
      ? DR_ABE_PERSON_ID
      : `${siteConfig.siteUrl}${item.author.profileUrl}`;
  const article = buildBlogPosting({
    path: `/blog/${item.slug}`,
    title: item.title,
    seoTitle: item.seoTitle,
    description: item.metaDescription,
    datePublished: item.publishedAt,
    dateModified: item.updatedAt,
    author: {
      name: item.author.name,
      slug: item.author.slug,
      profileUrl: item.author.profileUrl,
    },
    image: item.featuredImage
      ? {
          url: item.featuredImage.url,
          width: item.featuredImage.width,
          height: item.featuredImage.height,
          alt: item.featuredImage.alt,
        }
      : undefined,
    section: item.categorySlugs[0] ? humanize(item.categorySlugs[0]) : undefined,
    keywords: item.tagSlugs.map(humanize),
    wordCount: countWords(item.blocks),
    readingMinutes: item.estimatedReadingMinutes,
    // Only the sources the article itself lists under "Sources".
    citations: item.sources.map((source) => ({
      title: source.title,
      url: source.url,
      publisher: source.publisher,
    })),
  });
  return (
    <>
      <JsonLd data={article} />
      <JsonLd
        data={buildMedicalWebPage({
          path: `/blog/${item.slug}`,
          name: item.title,
          description: item.metaDescription,
          datePublished: item.publishedAt,
          dateModified: item.updatedAt,
          aboutTopic: item.title,
          // Ties the page node to the article node and to the site, so a
          // consumer reads one connected graph instead of loose entities.
          mainEntity: article["@id"],
          isPartOfWebSite: true,
          authorId,
        })}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Blog", path: "/blog" },
          { name: item.title, path: `/blog/${item.slug}` },
        ]}
      />
      {/* FAQPage JSON-LD for item.faqs is emitted by ContentArticle's
          ArticleFaqSection, alongside the accordion that renders them. */}
      <ContentArticle item={item} relatedItems={relatedItems} />
    </>
  );
}
