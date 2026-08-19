import Image from "next/image";
import Link from "next/link";

import type { PublicContentItem } from "@/lib/content/types";

/** Full-bleed photo hero for a published blog article — same
 * lg:-mt-[176px]/lg:pt-[276px] bleed pair behind the fixed Navbar +
 * TopStatsBar as every other hero, but a LIGHT wash over the photo (not
 * BlogHero's dark tint), navy text throughout. A dark tint fading to the
 * white article body below only keeps enough contrast for white text in
 * the top ~half; by the time the subhead/byline sit further down, the fade
 * had already lightened the backdrop underneath them and white text washed
 * out (reported, confirmed via screenshot). Navy text needs the opposite:
 * a backdrop that's light everywhere text sits, which a white wash (rather
 * than dark) plus the same white fade-to-solid at the bottom gives for
 * free — both layers are already the same color family, so they converge
 * without a seam and there's no dark-to-light crossover for the text block
 * to be caught in the middle of. Only used when the item actually has a
 * featured image — content published with `featuredImageDecorative` and no
 * image asset falls back to ContentArticle's plain white header instead. */
export function BlogArticleHero({
  item,
  area = false,
}: {
  item: PublicContentItem;
  area?: boolean;
}) {
  const image = item.featuredImage;
  if (!image) return null;
  const published = item.publishedAt ? new Date(item.publishedAt) : undefined;
  const updated = new Date(item.updatedAt);

  return (
    <section className="relative -mt-[100px] min-h-[480px] overflow-hidden sm:min-h-[520px] lg:-mt-[176px] lg:min-h-[600px]">
      <Image src={image.url} alt="" fill priority sizes="100vw" className="object-cover" />
      {/* A uniform wash over the whole photo (the previous version) hid the
       * photo almost entirely to keep the text readable everywhere — but
       * the text only ever occupies the left column, so the rest of the
       * hero doesn't need that much white over it. Two gradients instead:
       * a horizontal scrim strong exactly where the text column sits,
       * fading away to the right so the photo actually reads as a photo
       * there; and a vertical fade-to-solid-white at the bottom for the
       * same transition into the white article body as before. Both are
       * layers of one background (not separate divs), so there's still
       * nothing for two elements to seam against. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_62%,rgba(255,255,255,1)_100%),linear-gradient(to_right,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.94)_38%,rgba(255,255,255,0.55)_58%,rgba(255,255,255,0)_78%)]" />
      <div className="container relative z-10 pb-14 pt-[168px] lg:pb-16 lg:pt-[276px]">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-navy-900">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={area ? "/service-areas" : "/blog"}
                className="transition-colors hover:text-navy-900"
              >
                {area ? "Service areas" : "Blog"}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-navy-800">
              {item.title}
            </li>
          </ol>
        </nav>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-500">
          {area
            ? "Service area"
            : (item.categorySlugs[0]?.replaceAll("-", " ") ?? "Patient resource")}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] text-navy-900 sm:text-5xl lg:text-6xl">
          {item.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-700">{item.excerpt}</p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-500">
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
      </div>
    </section>
  );
}
