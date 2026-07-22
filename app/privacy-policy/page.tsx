import type { Metadata } from "next";

import { OnThisPageNav } from "@/components/layout/on-this-page-nav";
import { LegalContent } from "@/components/sections/legal-content";
import { Section } from "@/components/ui/section";
import { privacyPolicyEffectiveDate, privacyPolicySections } from "@/content/legal/privacy-policy";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.business.name}`,
  description:
    "How Align the Spine Chiropractic collects, uses, and protects your information, including HIPAA-protected health information.",
};

/** /privacy-policy page assembly (ATS-120) per the privacy-policy artboard
 * (96:2098): navy header (title + effective date), then a sticky
 * OnThisPageNav sidebar next to the 9-section LegalContent body. Navbar/
 * standard footer come from RootShell. */
export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Negative top margin matches Hero's (components/sections/hero.tsx):
          pulls this block up over TopStatsBar, which RootShell renders
          in-flow before the fixed Navbar. Hero pages hide it the same way;
          this page has no Hero to do it, so it needs the trick directly. */}
      <div className="-mt-[516px] bg-navy-900 pb-16 pt-[240px] sm:-mt-[304px] sm:pt-[200px] md:-mt-[240px] md:pt-[190px] lg:-mt-[176px] lg:pt-[200px]">
        <div className="container">
          <h1 className="font-display text-hero text-white">Privacy Policy</h1>
          <p className="mt-4 font-sans text-body-lg text-mute-300">{privacyPolicyEffectiveDate}</p>
        </div>
      </div>

      <Section spacing="lg" className="container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr] lg:gap-20">
          <OnThisPageNav sections={privacyPolicySections} />
          <LegalContent sections={privacyPolicySections} />
        </div>
      </Section>
    </>
  );
}
