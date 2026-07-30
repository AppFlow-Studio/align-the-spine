import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConditionPage } from "@/components/templates/condition-page";
import { conditionsBySlug } from "@/content/conditions";
import { siteConfig } from "@/content/site";

type PageProps = { params: Promise<{ slug: string }> };

/** Static params for the 4 in-scope condition routes (ATS-061). auto-accident
 * intentionally excluded — it's the separate /auto-accident route. */
export function generateStaticParams() {
  return Object.keys(conditionsBySlug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const condition = conditionsBySlug[slug];
  if (!condition) return {};

  const title = `${condition.hero.h1} | ${siteConfig.business.name}`;
  const description = condition.hero.subhead;
  const url = `${siteConfig.siteUrl}/conditions/${condition.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [
        { url: condition.hero.backgroundImage.src, alt: condition.hero.backgroundImage.alt },
      ],
    },
  };
}

/** /conditions/[slug] route (ATS-061): resolves the slug against
 * conditionsBySlug and delegates rendering to the shared ConditionPage
 * template (components/templates/condition-page.tsx), which also backs
 * /auto-accident. */
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const condition = conditionsBySlug[slug];
  if (!condition) notFound();

  return <ConditionPage condition={condition} />;
}
