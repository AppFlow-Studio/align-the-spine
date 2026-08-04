import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ConditionPage } from "@/components/templates/condition-page";
import { conditionsBySlug } from "@/content/conditions";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ slug: string }> };

/** Static params for the 4 in-scope condition routes (ATS-061). auto-accident
 * intentionally excluded — it's the separate /auto-accidents route. */
export function generateStaticParams() {
  return Object.keys(conditionsBySlug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const condition = conditionsBySlug[slug];
  if (!condition) return {};

  return buildMetadata({
    title: `${condition.hero.h1} | ${siteConfig.business.name}`,
    description: condition.hero.subhead,
    path: `/conditions/${condition.slug}`,
    image: condition.hero.backgroundImage,
  });
}

/** /conditions/[slug] route (ATS-061): resolves the slug against
 * conditionsBySlug and delegates rendering to the shared ConditionPage
 * template (components/templates/condition-page.tsx), which also backs
 * /auto-accidents. */
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const condition = conditionsBySlug[slug];
  if (!condition) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: condition.name, path: `/conditions/${condition.slug}` },
        ]}
      />
      <ConditionPage condition={condition} />
    </>
  );
}
