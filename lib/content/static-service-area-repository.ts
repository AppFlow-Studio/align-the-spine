import { serviceAreas, type ServiceAreaContent } from "@/content/service-areas";

import type { ContentRepository, PublicCategorySummary, PublicListOptions } from "./repository";
import { estimatedReadingMinutes } from "./schemas";
import type { ContentAuthor, ContentItem, ContentSource, PublicContentItem } from "./types";

const AUTHOR: ContentAuthor = {
  id: "a3c2e825-c7cd-4362-a7c4-1eba3e505fdd",
  slug: "dr-abe-nasser",
  name: "Dr. Abe Nasser",
  shortBio:
    "Dr. Abe Nasser is the chiropractor behind Align the Spine Chiropractic in Deerfield Beach. He has worked with patients across Broward and Palm Beach counties, including athletes, older adults, and people navigating post-surgical or pregnancy-related needs.",
  profileUrl: "/about",
  active: true,
};

/** When this file was assembled from the (now-archived) Supabase-era rows —
 * used as a stable publishedAt/createdAt/updatedAt for every entry rather
 * than a per-page value, since edits to this file go through git, not a
 * per-row timestamp. */
const CONTENT_DATE = "2026-08-18T00:00:00.000Z";

/** Same honest disclosure the Supabase-era rows carried in their stored
 * gate_result: the content/evidence structure is in place, but an actual
 * clinician medical review has not happened. lib/content/service-areas.test.ts
 * runs evaluatePublicationGates() against every entry so a real content
 * defect (broken heading order, missing required field, etc.) still fails
 * CI — this static result only covers the one gate that's a business
 * decision, not a content-quality one. */
const GATE_RESULT = {
  passed: true,
  blockers: [] as string[],
  recommendations: [
    "Manually overridden by owner instruction 2026-08-18; medical review and in-office verification were NOT performed.",
  ],
  checkedAt: CONTENT_DATE,
};

const SOURCES_BY_COUNTY: Record<string, ContentSource> = {
  Broward: {
    id: "33af7f95-2623-459d-aef4-02e01d973bf6",
    title: "Fort Lauderdale Crash Data: 2025 Breakdown & 7-Year Trends",
    publisher: "InjuryLawyers.com",
    url: "https://www.injurylawyers.com/fort-lauderdale/auto-accident-attorney/fort-lauderdale-car-accident-statistics/",
    sourceType: "other",
    accessedDate: "2026-08-17",
    geography: "Broward County, FL",
    claimSupported: "Broward County 2025 crash statistics cited on this page.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-8",
  },
  "Palm Beach": {
    id: "87682b8b-44ab-4044-9f65-917f2ade0f4b",
    title: "West Palm Beach Car Accident Statistics",
    publisher: "InjuryLawyers.com",
    url: "https://www.injurylawyers.com/west-palm-beach/auto-accident-attorney/car-accident-stats/",
    sourceType: "other",
    accessedDate: "2026-08-17",
    geography: "Palm Beach County, FL",
    claimSupported: "Palm Beach County 2025 crash statistics cited on this page.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-8",
  },
  "Miami-Dade": {
    id: "611ee5df-ae8b-4417-9955-3edd0f37ca00",
    title: "Miami Car Accident Statistics & Trends",
    publisher: "InjuryLawyers.com",
    url: "https://www.injurylawyers.com/miami/car-accident-lawyer/miami-car-accident-statistics/",
    sourceType: "other",
    accessedDate: "2026-08-17",
    geography: "Miami-Dade County, FL",
    claimSupported: "Miami-Dade County 2025 crash statistics cited on this page.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-8",
  },
};

/** The official statutory text — a primary source, cited by every entry for
 * the 14-day rule / EMC tiering / massage-acupuncture exclusion / same-
 * chapter peer-review-defect content (block-23/24, added 2026-08-18).
 * Directly fetched and cross-checked against this exact URL before writing
 * that content — see the git history around 2026-08-18 for the fetched
 * excerpts this was verified against. */
const STATUTE_SOURCE: ContentSource = {
  id: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
  title: "Florida Statute 627.736 — Personal injury protection benefits",
  publisher: "The Florida Legislature",
  url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.736.html",
  sourceType: "statute",
  accessedDate: "2026-08-18",
  geography: "Florida",
  claimSupported:
    "14-day rule, EMC $10,000/$2,500 tiering, chiropractors excluded from EMC determination, massage/acupuncture exclusion, 80% reimbursement rate, and the same-licensing-chapter requirement for a valid peer-review report withdrawing payment (627.736(7)(a)).",
  classification: "primary",
  verificationStatus: "verified",
  blockId: "block-23",
};

/** Per-city, per-intersection sources — only for the cities where a real,
 * checkable source was found and fetched (2026-08-18). Deliberately absent
 * for coconut-creek, hollywood, lighthouse-point, margate, miami-beach,
 * miami-gardens, and tamarac: either no specific-intersection source turned
 * up, or the only source found was too weak (a single incident news
 * article, not a documented pattern) to state as fact — those pages keep
 * their existing general corridor-name content instead of a new claim. */
const INTERSECTION_SOURCES: Record<string, ContentSource> = {
  "west-palm-beach": {
    id: "2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e",
    title: "Top 5 Intersections in Palm Beach County With the Highest Accident Rates",
    publisher: "Britto & Herman",
    url: "https://brittoherman.com/injury-blog/top-5-intersections-in-palm-beach-county-with-the-highest-accident-rates-and-what-you-should-know-if-youre-involved-in-a-crash/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "West Palm Beach, FL",
    claimSupported:
      "Okeechobee Blvd & Military Trail as a documented rear-end/side-impact crash site.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  "boca-raton": {
    id: "3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f",
    title: "Top 5 Intersections in Palm Beach County With the Highest Accident Rates",
    publisher: "Britto & Herman",
    url: "https://brittoherman.com/injury-blog/top-5-intersections-in-palm-beach-county-with-the-highest-accident-rates-and-what-you-should-know-if-youre-involved-in-a-crash/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Boca Raton, FL",
    claimSupported: "Glades Rd & I-95 as a documented pile-up/high-speed-collision site.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  "boynton-beach": {
    id: "4d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f8a",
    title: "Palm Beach County's Most Dangerous Intersections",
    publisher: "Lesser, Landy, Smith & Siegel, PLLC",
    url: "https://lesserlawfirm.com/blog/palm-beach-countys-most-dangerous-intersections/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Boynton Beach, FL",
    claimSupported:
      "Boynton Beach Blvd & Congress Ave ranked among the county's most dangerous intersections.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  "delray-beach": {
    id: "5e6f7a8b-9c0d-4e1f-2a3b-4c5d6e7f8a9b",
    title: "Palm Beach County's Most Dangerous Intersections",
    publisher: "Lesser, Landy, Smith & Siegel, PLLC",
    url: "https://lesserlawfirm.com/blog/palm-beach-countys-most-dangerous-intersections/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Delray Beach, FL",
    claimSupported:
      "Atlantic Ave & Congress Ave, Atlantic Ave & I-95, Military Trail & Atlantic Ave, and Military Trail & Linton Blvd ranked among the county's most dangerous intersections.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  "fort-lauderdale": {
    id: "6f7a8b9c-0d1e-4f2a-3b4c-5d6e7f8a9b0c",
    title: "7 of the Most Dangerous Intersections in Broward County",
    publisher: "ChiroCare of Florida",
    url: "https://chirocareflorida.com/dangerous-intersections-broward-county/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Fort Lauderdale, FL",
    claimSupported:
      "Sunrise Blvd & Andrews Ave, A1A & Las Olas Blvd (1,000+ injury accidents/year), and NE 26th St & Federal Hwy as documented crash sites.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  "pembroke-pines": {
    id: "7a8b9c0d-1e2f-4a3b-4c5d-6e7f8a9b0c1d",
    title: "7 of the Most Dangerous Intersections in Broward County",
    publisher: "ChiroCare of Florida",
    url: "https://chirocareflorida.com/dangerous-intersections-broward-county/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Pembroke Pines, FL",
    claimSupported:
      "Pines Blvd & South Flamingo Rd's documented pedestrian-fatality history (approximately 100 over a five-year period).",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  sunrise: {
    id: "8b9c0d1e-2f3a-4b4c-5d6e-7f8a9b0c1d2e",
    title: "7 of the Most Dangerous Intersections in Broward County",
    publisher: "ChiroCare of Florida",
    url: "https://chirocareflorida.com/dangerous-intersections-broward-county/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Sunrise, FL",
    claimSupported: "West Oakland Park Blvd & NW 50th Ave as a documented crash site.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  davie: {
    id: "9c0d1e2f-3a4b-4c5d-6e7f-8a9b0c1d2e3f",
    title: "7 of the Most Dangerous Intersections in Broward County",
    publisher: "ChiroCare of Florida",
    url: "https://chirocareflorida.com/dangerous-intersections-broward-county/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Davie, FL",
    claimSupported: "SR-27 & Griffin Rd's documented history of 1,000+ property-damage crashes.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  "pompano-beach": {
    id: "0d1e2f3a-4b5c-4d6e-7f8a-9b0c1d2e3f4a",
    title: "7 of the Most Dangerous Intersections in Broward County",
    publisher: "ChiroCare of Florida",
    url: "https://chirocareflorida.com/dangerous-intersections-broward-county/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Pompano Beach, FL",
    claimSupported: "Atlantic Blvd & U.S. 1's documented history of 6,000+ crashes.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  "coral-springs": {
    id: "1e2f3a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b",
    title: "The Most Dangerous Roads and Intersections in Coral Springs",
    publisher: "Rader Law Group, LLC",
    url: "https://raderlawgroup.com/the-most-dangerous-roads-and-intersections-in-coral-springs/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Coral Springs, FL",
    claimSupported:
      "Sample Rd & University Dr, Wiles Rd & SR-7/441, Royal Palm Blvd & University Dr, and Atlantic Blvd & University Dr as documented dangerous intersections.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  hialeah: {
    id: "2f3a4b5c-6d7e-4f8a-9b0c-1d2e3f4a5b6c",
    title: "What Florida Cities Have the Most Car Crashes",
    publisher: "Shiner Law Group",
    url: "https://shinerlawgroup.com/what-florida-cities-have-the-most-car-crashes/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Hialeah, FL",
    claimSupported:
      "North Okeechobee Rd & Hialeah Gardens Blvd cited among the five most dangerous intersections in Florida.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
  miami: {
    id: "3a4b5c6d-7e8f-4a9b-0c1d-2e3f4a5b6c7d",
    title: "Miami Car Accident Statistics 2026",
    publisher: "Law Office of Alexander Alvarez, PA",
    url: "https://www.aalvarezlawfirm.com/blog/miami-car-accident-statistics/",
    sourceType: "other",
    accessedDate: "2026-08-18",
    geography: "Miami, FL",
    claimSupported:
      "5.4 accidents per 1,000 drivers, cited among the worst U.S. cities for drivers.",
    classification: "secondary",
    verificationStatus: "verified",
    blockId: "block-25",
  },
};

/** Miami-only second source (commercial-motor-vehicle share of Miami-Dade
 * crashes), cited alongside INTERSECTION_SOURCES.miami on the same block. */
const MIAMI_CMV_SOURCE: ContentSource = {
  id: "4b5c6d7e-8f9a-4b0c-1d2e-3f4a5b6c7d8e",
  title: "Where Freight Meets Traffic: Commercial Motor Vehicle Crashes in Miami-Dade",
  publisher: "JMM Law Firm",
  url: "https://jmmlawfirm.com/miami-truck-crash-report/",
  sourceType: "other",
  accessedDate: "2026-08-18",
  geography: "Miami-Dade County, FL",
  statisticPeriod: "2024",
  claimSupported:
    "14.2% of Miami-Dade crashes in 2024 involved a commercial motor vehicle (8,546 of 60,000).",
  classification: "secondary",
  verificationStatus: "verified",
  blockId: "block-25",
};

const bySlug = new Map(serviceAreas.map((entry) => [entry.slug, entry]));

function toItem(entry: ServiceAreaContent): ContentItem {
  const countySource = SOURCES_BY_COUNTY[entry.serviceArea.county];
  const intersectionSource = INTERSECTION_SOURCES[entry.slug];
  const sources = [
    ...(countySource ? [countySource] : []),
    STATUTE_SOURCE,
    ...(intersectionSource ? [intersectionSource] : []),
    ...(entry.slug === "miami" ? [MIAMI_CMV_SOURCE] : []),
  ];
  return {
    id: `service-area-${entry.slug}`,
    contentType: "service_area",
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    blocks: entry.blocks,
    status: "published",
    featured: false,
    searchIntent: "informational",
    audience: "car-accident/PIP patients considering a home-visit evaluation",
    seoTitle: entry.seoTitle,
    metaDescription: entry.metaDescription,
    // No per-city photo — ServiceAreaHero uses one shared background image
    // for every service-area page, so there's no distinct featured image to
    // set here. Explicitly decorative (rather than leaving this unset) so
    // evaluatePublicationGates doesn't flag it as an oversight.
    featuredImageDecorative: true,
    authorId: AUTHOR.id,
    medicalReviewRequired: entry.medicalReviewRequired,
    publishedAt: CONTENT_DATE,
    createdAt: CONTENT_DATE,
    updatedAt: CONTENT_DATE,
    noindex: false,
    version: 1,
    directAnswer: entry.directAnswer,
    keyTakeaways: entry.keyTakeaways,
    faqs: entry.faqs,
    emergencyGuidanceRelevant: false,
    categorySlugs: [],
    tagSlugs: [],
    relatedContentIds: entry.relatedSlugs
      .filter((slug) => bySlug.has(slug))
      .map((slug) => `service-area-${slug}`),
    sources,
    gateResult: GATE_RESULT,
    serviceArea: entry.serviceArea,
    author: AUTHOR,
  };
}

function toPublic(entry: ServiceAreaContent): PublicContentItem {
  const item = toItem(entry);
  return {
    ...item,
    author: AUTHOR,
    estimatedReadingMinutes: estimatedReadingMinutes(entry.blocks),
  };
}

/** Code-managed counterpart to SupabaseContentRepository, covering only
 * `service_area` content — see content/service-areas.ts for why this
 * content type lives in a data file instead of the database. Composed
 * alongside the blog repository by CompositeContentRepository
 * (lib/content/index.ts). */
export class StaticServiceAreaRepository implements ContentRepository {
  async listPublic(options: PublicListOptions) {
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.min(24, Math.max(1, options.pageSize ?? 9));
    const query = options.query?.trim().toLowerCase();
    const filtered = serviceAreas
      .filter(
        (entry) =>
          !query ||
          entry.title.toLowerCase().includes(query) ||
          entry.excerpt.toLowerCase().includes(query),
      )
      .sort((a, b) => a.serviceArea.communityName.localeCompare(b.serviceArea.communityName));
    const offset = (page - 1) * pageSize;
    return {
      items: filtered.slice(offset, offset + pageSize).map(toPublic),
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  }

  async getPublicBySlug(_contentType: unknown, slug: string) {
    const entry = bySlug.get(slug);
    return entry ? toPublic(entry) : null;
  }

  async listPublicCategories(): Promise<PublicCategorySummary[]> {
    return [];
  }

  async listPublicByIds(ids: string[]) {
    if (!ids.length) return [];
    const set = new Set(ids);
    return serviceAreas.filter((entry) => set.has(`service-area-${entry.slug}`)).map(toPublic);
  }

  async listEditorial() {
    return serviceAreas.map(toItem);
  }

  async getEditorialById(id: string) {
    const slug = id.replace(/^service-area-/, "");
    const entry = bySlug.get(slug);
    return entry ? toItem(entry) : null;
  }
}
