import type { LegalSection } from "@/content/legal/types";
import { siteConfig } from "@/content/site";

export const privacyPolicyEffectiveDate = "Effective July 1, 2026";

/** /privacy-policy sections (ATS-120), copy from the privacy-policy artboard. */
export const privacyPolicySections: LegalSection[] = [
  {
    id: "information-we-collect",
    navLabel: "Information we collect",
    heading: "Information we collect",
    body: [
      "When you request an appointment, contact us, or use this website, we may collect the information you provide directly — name, phone number, email address, and any details you share about your condition or reason for visiting.",
      "If you become a patient, we collect health information as part of your care, including exam findings, treatment notes, and — where applicable — accident and insurance details needed to bill Personal Injury Protection (PIP) or other coverage.",
      "Like most websites, we automatically collect some technical information when you visit: IP address, browser type, device type, pages viewed, and how you arrived at the site (including whether you clicked an ad).",
    ],
  },
  {
    id: "how-we-use-it",
    navLabel: "How we use it",
    heading: "How we use it",
    body: [
      "To schedule and provide chiropractic care, including in-home visits where applicable.",
      "To bill insurance, including PIP claims, and to communicate with attorneys or insurers you've authorized us to work with.",
      "To respond to appointment requests and general inquiries submitted through this site.",
      "To measure and improve the performance of this website and our advertising, in aggregate — not to sell your individual information.",
    ],
  },
  {
    id: "hipaa",
    navLabel: "Protected Health Information (HIPAA)",
    heading: "Protected health information (HIPAA)",
    body: [
      "If you are a patient, your health information is protected under the Health Insurance Portability and Accountability Act (HIPAA). We maintain a separate Notice of Privacy Practices, provided at your first visit, that details how your health information may be used and disclosed, and your rights regarding it — including the right to access, request corrections to, and request an accounting of disclosures of your records.",
      "We do not use your protected health information for marketing purposes without your written authorization.",
    ],
  },
  {
    id: "cookies-and-advertising",
    navLabel: "Cookies and advertising",
    heading: "Cookies and advertising",
    body: [
      "This site uses cookies and similar technologies for basic functionality and to measure ad performance, including through Google Ads and Google Analytics. These tools may use cookies to understand which ads led to a visit and to show you relevant ads on other sites afterward (remarketing).",
      "You can control cookies through your browser settings, and opt out of personalized Google advertising through Google's Ad Settings. Disabling cookies may affect how parts of this site function.",
    ],
  },
  {
    id: "how-we-share-information",
    navLabel: "How we share information",
    heading: "How we share information",
    body: [
      "We do not sell your personal information.",
      "We share information only as needed to provide care and process claims: with insurers and PIP carriers for billing, with attorneys you've authorized to coordinate on your case, with service providers who help us operate (such as scheduling or hosting tools) under confidentiality obligations, and when required by law.",
    ],
  },
  {
    id: "your-rights-and-choices",
    navLabel: "Your rights and choices",
    heading: "Your rights and choices",
    body: [
      "You can ask us what information we have about you, request corrections, and ask us to delete non-medical contact information you've submitted through this site.",
      "Patients have additional rights under HIPAA regarding their medical records, detailed in our Notice of Privacy Practices.",
      "Florida residents may have additional rights under state privacy law depending on how information was collected and used; contact us with any request and we'll direct it appropriately.",
    ],
  },
  {
    id: "how-we-protect-information",
    navLabel: "How we protect information",
    heading: "How we protect information",
    body: [
      "We use reasonable administrative, technical, and physical safeguards to protect the information we hold, consistent with HIPAA security requirements for protected health information. No method of transmission or storage is completely secure, and we can't guarantee absolute security.",
    ],
  },
  {
    id: "changes-to-this-policy",
    navLabel: "Changes to this policy",
    heading: "Changes to this policy",
    body: [
      "We may update this policy from time to time. The date at the top reflects the most recent revision. Material changes will be reflected here; continued use of this site after changes means you accept the updated policy.",
    ],
  },
  {
    id: "contact-us",
    navLabel: "Contact us",
    heading: "Contact us",
    body: [
      `Questions about this policy or your information? Reach us at ${siteConfig.business.phone} or ${siteConfig.business.email}, or by mail at ${siteConfig.business.address.line1}, ${siteConfig.business.address.suite}, ${siteConfig.business.address.city}, ${siteConfig.business.address.state} ${siteConfig.business.address.zip}.`,
    ],
  },
];
