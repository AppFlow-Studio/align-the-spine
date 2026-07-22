import { siteConfig } from "@/content/site";

export interface StillHaveQuestionsContent {
  heading: string;
  eyebrow: string;
  phone: string;
  phoneHref: string;
  note: string;
}

export interface CtaBandContent {
  heading: string;
  cta: { label: string; href: string };
}

/** StillHaveQuestions band copy per condition-page-spec §B10 (ATS-121). */
export const stillHaveQuestionsContent: StillHaveQuestionsContent = {
  heading: "Still have questions? Just Call",
  eyebrow: "Speak with us today",
  phone: `Call ${siteConfig.business.phone}`,
  phoneHref: siteConfig.business.phoneHref,
  note: "Dr. Abe Answers the phone. No call center, no hold music.",
};

/** CTABand copy per condition-page-spec §B10 (ATS-121). */
export const ctaBandContent: CtaBandContent = {
  heading: "Ready to get started?",
  cta: { label: "Book an appointment", href: siteConfig.bookingCta.href },
};
