import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Paj Pa Jwenn | Align the Spine Chiropractic",
  description: "Paj ou ap chèche a pa egziste oswa yo deplase li.",
  path: "/ht/404",
  robots: { index: false },
  locale: "ht",
});

/** Haitian Creole 404 — the Haitian Creole-tree counterpart of
 * app/(pt)/not-found.tsx. An unknown /ht/... URL must land here (a real
 * 404 in Haitian Creole), never on the English/Spanish/Portuguese 404 and
 * never on a 200 shell. */
export default function HtNotFound() {
  return (
    <Section spacing="lg" className="container pt-40 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <p
          aria-hidden="true"
          className="font-display text-[clamp(80px,14vw,160px)] leading-none text-navy-900/10"
        >
          404
        </p>

        <h1 className="font-display text-display text-navy-900">Paj Pa Jwenn</h1>

        <p className="font-sans text-body-lg text-ink-500">
          Paj ou ap chèche a pa egziste oswa yo deplase li. Ann ede ou kontinye apati la a.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/ht/mande-yon-randevou" variant="teal">
            Mande Randevou
          </Button>
          <Button href="/ht" variant="primary">
            Tounen nan Paj Prensipal
          </Button>
        </div>
      </div>
    </Section>
  );
}
