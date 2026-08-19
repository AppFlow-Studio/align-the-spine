import type { ContentAsset, ContentAuthor, ContentItem, ContentSource } from "./types";

const accessedDate = "2026-08-16";

export const fixtureAuthors: ContentAuthor[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    slug: "dr-abe-nasser",
    name: "Dr. Abe Nasser",
    shortBio: "Chiropractor at Align the Spine Chiropractic in Deerfield Beach, Florida.",
    profileUrl: "/about",
    portraitUrl: "/figma-exports/portrait.png",
    active: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    slug: "align-the-spine-editorial-team",
    name: "Align the Spine Editorial Team",
    shortBio: "The editorial team prepares practical resources for review by the practice.",
    profileUrl: "/about",
    active: true,
  },
];

export const fixtureAssets: ContentAsset[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    url: "/figma-exports/interior-reception.png",
    provider: "local",
    mimeType: "image/png",
    width: 1600,
    height: 1067,
    alt: "Reception area at the Deerfield Beach Align the Spine office",
    approvalState: "approved",
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    url: "/figma-exports/drabe-consult.png",
    provider: "local",
    mimeType: "image/png",
    width: 1200,
    height: 900,
    alt: "Dr. Abe Nasser speaking with a patient during an evaluation",
    approvalState: "approved",
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    url: "/figma-exports/exterior-img.png",
    provider: "local",
    mimeType: "image/png",
    width: 1600,
    height: 1067,
    alt: "Exterior of the Deerfield Beach office building",
    approvalState: "approved",
  },
];

export const fixtureSources: ContentSource[] = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    title: "Florida Statutes § 627.736",
    publisher: "Florida Legislature",
    url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699%2F0627%2FSections%2F0627.736.html",
    sourceType: "statute",
    accessedDate,
    geography: "Florida",
    claimSupported: "Florida PIP initial-services timing rule and eligibility context.",
    classification: "primary",
    verificationStatus: "verified",
    blockId: "pip-timing",
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    title: "Crash Dashboard",
    publisher: "Florida Highway Safety and Motor Vehicles",
    url: "https://www.flhsmv.gov/traffic-crash-reports/crash-dashboard/",
    sourceType: "government",
    accessedDate,
    geography: "Florida",
    claimSupported: "Official source for Florida crash data; no fixture statistic is asserted.",
    classification: "primary",
    verificationStatus: "verified",
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    title: "Vision Zero",
    publisher: "City of Deerfield Beach",
    url: "https://www.deerfield-beach.com/2193/Vision-Zero",
    sourceType: "government",
    accessedDate,
    geography: "Deerfield Beach, Florida",
    claimSupported: "City transportation-safety program context; no stale crash count is repeated.",
    classification: "primary",
    verificationStatus: "verified",
  },
];

const baseGate = {
  passed: false,
  blockers: ["Development fixture: clinician/compliance approval is pending."],
  recommendations: [],
  checkedAt: "2026-08-16T16:00:00.000Z",
};

export const fixtureContent: ContentItem[] = [
  {
    id: "40000000-0000-4000-8000-000000000001",
    contentType: "blog_post",
    slug: "what-to-do-after-a-car-accident-in-deerfield-beach",
    title: "What to do after a car accident in Deerfield Beach",
    excerpt:
      "A calm, practical draft covering emergency warning signs, documentation, evaluation options, and Florida PIP timing.",
    status: "in_review",
    featured: true,
    blocks: [
      {
        id: "red-flags",
        type: "callout",
        tone: "emergency",
        title: "Get emergency help when symptoms may be serious",
        text: "Call 911 or seek emergency care for severe or worsening symptoms such as trouble breathing, loss of consciousness, new weakness, uncontrolled bleeding, or severe head, neck, or chest pain.",
      },
      {
        id: "first-steps",
        type: "heading",
        level: 2,
        text: "Start with safety and the right level of care",
      },
      {
        id: "first-steps-copy",
        type: "paragraph",
        text: "Move away from immediate danger when it is safe to do so, contact emergency services when needed, and follow the instructions of qualified responders. A website cannot determine whether an injury is present or which type of care is appropriate.",
      },
      { id: "documentation", type: "heading", level: 2, text: "Keep practical records" },
      {
        id: "documentation-list",
        type: "list",
        style: "unordered",
        items: [
          "Save the crash report or exchange information provided at the scene.",
          "Write down when symptoms began and whether they change.",
          "Keep insurer and care-provider communications together.",
        ],
      },
      {
        id: "pip-timing",
        type: "heading",
        level: 2,
        text: "Understand that PIP can be time-sensitive",
      },
      {
        id: "pip-copy",
        type: "paragraph",
        text: "Florida’s PIP rules can involve time-sensitive requirements, including an initial-care timing rule. Coverage and eligibility depend on the policy and circumstances. Contact your insurer or a qualified professional for guidance, and call the practice to ask about an evaluation.",
      },
      { id: "office", type: "heading", level: 2, text: "Ask which visit setting fits" },
      {
        id: "office-copy",
        type: "paragraph",
        text: "Align the Spine Chiropractic has one office in Deerfield Beach. In limited eligible car-accident/PIP circumstances, you may ask whether a home visit fits the case and location. Availability, coverage, and eligibility are not promised.",
      },
    ],
    searchIntent: "post-accident next steps",
    audience: "Deerfield Beach residents after a car accident",
    seoTitle: "What to Do After a Car Accident in Deerfield Beach",
    metaDescription:
      "Review calm next steps after a Deerfield Beach car accident, including emergency red flags, documentation, evaluation options, and general Florida PIP timing information.",
    featuredImageAssetId: fixtureAssets[1]!.id,
    featuredImageAlt: fixtureAssets[1]!.alt,
    authorId: fixtureAuthors[1]!.id,
    medicalReviewRequired: true,
    createdAt: "2026-08-16T14:00:00.000Z",
    updatedAt: "2026-08-16T16:00:00.000Z",
    noindex: true,
    noindexReason: "Development seed pending Dr. Abe's clinical review.",
    version: 1,
    directAnswer:
      "Prioritize safety and emergency care when needed, keep practical records, and ask qualified professionals about time-sensitive insurance or care decisions.",
    keyTakeaways: [
      "Call 911 or seek emergency care first for severe or worsening symptoms.",
      "Save the crash report and write down when symptoms began.",
      "Florida PIP can involve a time-sensitive initial-care rule — ask your insurer.",
      "One Deerfield Beach office; home-visit eligibility is case-by-case, never guaranteed.",
    ],
    faqs: [
      {
        id: "faq-when-to-see-doctor",
        question: "How soon should I see someone after a car accident?",
        answer:
          "Timing depends on your symptoms and policy. Seek emergency care immediately for severe symptoms, and ask your insurer or a qualified professional about any time-sensitive coverage rules that may apply to your situation.",
      },
      {
        id: "faq-no-symptoms",
        question: "What if I don't feel injured right away?",
        answer:
          "Some symptoms can take time to appear. This page can't tell you whether you're injured — if anything changes or you're unsure, contact a qualified professional or call the practice to ask about an evaluation.",
      },
    ],
    emergencyGuidanceRelevant: true,
    categorySlugs: ["car-accident-care"],
    tagSlugs: ["florida-pip", "deerfield-beach"],
    relatedContentIds: [],
    sources: fixtureSources,
    gateResult: baseGate,
  },
  {
    id: "40000000-0000-4000-8000-000000000002",
    contentType: "blog_post",
    slug: "questions-to-bring-to-a-chiropractic-evaluation",
    title: "Questions to bring to a chiropractic evaluation",
    excerpt:
      "A short preparation guide that helps people describe their goals, history, and questions without trying to diagnose themselves.",
    status: "draft",
    featured: false,
    blocks: [
      {
        id: "why-prepare",
        type: "heading",
        level: 2,
        text: "A little preparation can make the conversation clearer",
      },
      {
        id: "why-prepare-copy",
        type: "paragraph",
        text: "You do not need to arrive with a diagnosis. It can help to note what you want to understand, what activities are difficult, when the concern began, and what questions you want answered.",
      },
      { id: "question-list", type: "heading", level: 2, text: "Useful questions to ask" },
      {
        id: "questions",
        type: "list",
        style: "unordered",
        items: [
          "What will the evaluation include?",
          "What findings would change the care plan or require a referral?",
          "How will we decide whether the plan is helping?",
          "What should I do if symptoms change between visits?",
        ],
      },
      { id: "practical", type: "heading", level: 2, text: "Confirm practical details directly" },
      {
        id: "practical-copy",
        type: "paragraph",
        text: "Call the practice for current hours, pricing, eligibility, and availability. Website examples should not be treated as confirmation for a specific visit.",
      },
    ],
    searchIntent: "first visit preparation",
    audience: "prospective chiropractic patients",
    seoTitle: "Questions to Bring to a Chiropractic Evaluation",
    metaDescription:
      "Prepare for a chiropractic evaluation with useful questions about the visit, findings, referrals, progress, practical details, and when to seek other care.",
    featuredImageAssetId: fixtureAssets[0]!.id,
    featuredImageAlt: fixtureAssets[0]!.alt,
    authorId: fixtureAuthors[1]!.id,
    medicalReviewRequired: true,
    createdAt: "2026-08-16T14:10:00.000Z",
    updatedAt: "2026-08-16T14:10:00.000Z",
    noindex: true,
    noindexReason: "Development seed pending clinical review.",
    version: 1,
    directAnswer:
      "Bring questions about what the evaluation includes, what findings mean, when referral is appropriate, and how progress will be assessed.",
    keyTakeaways: [
      "You don't need a diagnosis before your visit — just what you want to understand.",
      "Ask what the evaluation includes and what findings would change the plan.",
      "Confirm hours, pricing, eligibility, and availability directly with the office.",
    ],
    faqs: [
      {
        id: "faq-what-to-bring",
        question: "What should I bring to my first evaluation?",
        answer:
          "A list of your questions, when the concern began, and anything that makes it better or worse. Call the practice ahead of time for current requirements or paperwork.",
      },
      {
        id: "faq-how-long",
        question: "How long does a first evaluation take?",
        answer:
          "Visit length can vary by case. Call the office directly to ask about scheduling and what to expect for your specific situation.",
      },
    ],
    emergencyGuidanceRelevant: false,
    categorySlugs: ["everyday-mobility"],
    tagSlugs: ["first-visit"],
    relatedContentIds: [],
    sources: [],
    gateResult: baseGate,
  },
  {
    id: "40000000-0000-4000-8000-000000000003",
    contentType: "service_area",
    slug: "deerfield-beach",
    title: "Chiropractic care for Deerfield Beach residents",
    excerpt:
      "Office-location truth, access context, and careful accident/PIP education for the practice's verified office city.",
    status: "in_review",
    featured: true,
    blocks: [
      { id: "office-truth", type: "heading", level: 2, text: "One office in Deerfield Beach" },
      {
        id: "office-truth-copy",
        type: "paragraph",
        text: "Align the Spine Chiropractic’s only verified office is at 811 SE 8th Ave, Ste 101, Deerfield Beach, FL 33441. Call or request an appointment so the practice can confirm current hours and availability.",
      },
      {
        id: "how-served",
        type: "heading",
        level: 2,
        text: "How Deerfield Beach residents may be served",
      },
      {
        id: "how-served-copy",
        type: "paragraph",
        text: "Most visits take place at the Deerfield Beach office. In limited eligible car-accident/PIP circumstances, you may ask whether a home visit fits the case and location. It is not a universal mobile-chiropractic service.",
      },
      {
        id: "local-safety",
        type: "heading",
        level: 2,
        text: "Use current official transportation information",
      },
      {
        id: "local-safety-copy",
        type: "paragraph",
        text: "The City of Deerfield Beach publishes Vision Zero information. This draft does not repeat a dated crash count as a current statistic. Official data can provide context, but it cannot determine whether a person is injured or needs a particular type of care.",
      },
      {
        id: "pip-timing",
        type: "heading",
        level: 2,
        text: "Florida PIP timing is general information",
      },
      {
        id: "pip-copy",
        type: "paragraph",
        text: "Florida’s PIP rules can involve time-sensitive requirements, including an initial-care timing rule. Coverage and eligibility depend on the policy and circumstances. Contact your insurer or a qualified professional for guidance, and call the practice to ask about an evaluation.",
      },
    ],
    searchIntent: "local office and accident evaluation information",
    audience: "Deerfield Beach residents",
    seoTitle: "Chiropractic Care for Deerfield Beach Residents",
    metaDescription:
      "Learn where Align the Spine Chiropractic's single Deerfield Beach office is, how appointment requests work, and how to ask about eligible accident-related home visits.",
    featuredImageAssetId: fixtureAssets[2]!.id,
    featuredImageAlt: fixtureAssets[2]!.alt,
    authorId: fixtureAuthors[1]!.id,
    medicalReviewRequired: true,
    createdAt: "2026-08-16T14:20:00.000Z",
    updatedAt: "2026-08-16T16:00:00.000Z",
    noindex: true,
    noindexReason: "Development seed pending clinical/compliance and canonical approval.",
    version: 1,
    directAnswer:
      "Align the Spine Chiropractic has one verified office in Deerfield Beach; home visits are only a question for limited eligible car-accident/PIP circumstances and are never guaranteed.",
    keyTakeaways: [
      "One verified office: 811 SE 8th Ave, Ste 101, Deerfield Beach, FL 33441.",
      "Most visits happen at the office, not at home.",
      "Home-visit questions are limited to eligible car-accident/PIP circumstances.",
      "Call or request an appointment to confirm current hours and availability.",
    ],
    faqs: [
      {
        id: "faq-home-visits",
        question: "Do you offer chiropractic home visits in Deerfield Beach?",
        answer:
          "Home visits are only considered for limited, eligible car-accident/PIP circumstances, confirmed case-by-case. They are not a general mobile-chiropractic service — call the office to ask whether your situation qualifies.",
      },
      {
        id: "faq-office-location",
        question: "Where is the Align the Spine Chiropractic office?",
        answer:
          "The practice's only verified office is at 811 SE 8th Ave, Ste 101, Deerfield Beach, FL 33441. Call ahead to confirm current hours.",
      },
    ],
    emergencyGuidanceRelevant: false,
    categorySlugs: ["office-city"],
    tagSlugs: ["deerfield-beach"],
    relatedContentIds: ["40000000-0000-4000-8000-000000000001"],
    sources: fixtureSources,
    gateResult: baseGate,
    serviceArea: {
      communityName: "Deerfield Beach",
      county: "Broward",
      state: "FL",
      postalCodes: [],
      relationship: "office_city",
      inOfficeServiceVerified: true,
      homeVisitEligibilityVerified: false,
      operationalEvidence: ["Verified physical office address in project brief."],
      uniqueLocalProofPoints: [
        "Verified office city and address",
        "City Vision Zero source",
        "Deerfield Beach office-access purpose",
      ],
      localSourceIds: [fixtureSources[2]!.id],
      uniquenessScore: 82,
      similarityScore: 0,
    },
  },
];
