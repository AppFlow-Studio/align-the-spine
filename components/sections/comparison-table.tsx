import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CheckIcon } from "@/components/ui/icons/check";
import { CloseIcon } from "@/components/ui/icons/close";
import { Section } from "@/components/ui/section";
import {
  autoAccidentComparisonRows,
  comparisonTableFootnote,
  comparisonTableRows,
  type ComparisonRow,
} from "@/content/comparison-table";

export interface ComparisonTableProps {
  variant?: "default" | "auto-accident";
  className?: string;
}

/** "Align the Spine vs Traditional Clinic" 3-column comparison per
 * condition-page-spec §B5, §C. Rows are data-driven (content/comparison-table.ts);
 * the "auto-accident" variant appends 2 extra rows (continuity-of-doctor,
 * attorney-referral note) for the not-yet-built /auto-accidents page. */
export function ComparisonTable({ variant = "default", className }: ComparisonTableProps) {
  const rows =
    variant === "auto-accident"
      ? [...comparisonTableRows, ...autoAccidentComparisonRows]
      : comparisonTableRows;

  return (
    <Section className={className}>
      <Container>
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="flex flex-col gap-4 text-center">
            <Eyebrow>The Difference</Eyebrow>
            <h2 className="font-display text-h2 text-ink-900">
              Align the Spine vs. Traditional Clinic
            </h2>
          </div>

          <Card radius={30} shadow="comparison" className="overflow-hidden">
            <div className="snap-x snap-mandatory overflow-x-auto">
              <div className="grid min-w-[720px] grid-cols-3">
                <div className="bg-navy-900 px-6 py-8 md:px-8">
                  <p className="font-sans text-comparison-label text-white">Care Benefits</p>
                </div>
                <div className="snap-start bg-white px-6 py-8 md:px-8">
                  <p className="font-sans text-comparison-label text-navy-900">Align the Spine</p>
                </div>
                <div className="bg-panel-100 px-6 py-8 md:px-8">
                  <p className="font-sans text-comparison-label text-mute-350">
                    Traditional Clinic
                  </p>
                </div>

                {rows.map((row) => (
                  <ComparisonRowCells key={row.label} row={row} />
                ))}
              </div>
            </div>

            <p className="border-t border-mute-300 bg-white px-6 py-6 font-sans text-small-print text-mute-400 md:px-8">
              {comparisonTableFootnote}
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

function ComparisonRowCells({ row }: { row: ComparisonRow }) {
  return (
    <>
      <div className="border-t border-overlay-white-15 bg-navy-900 px-6 py-6 md:px-8">
        <p className="font-sans text-comparison-label text-white">{row.label}</p>
      </div>
      <div className="snap-start flex items-start gap-3 border-t border-mute-300 bg-white px-6 py-6 md:px-8">
        <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-teal-500" />
        <p className="font-sans text-comparison-cell text-teal-500">{row.alignTheSpine}</p>
      </div>
      <div className="flex items-start gap-3 border-t border-mute-300 bg-panel-100 px-6 py-6 md:px-8">
        <CloseIcon className="mt-1 h-5 w-5 shrink-0 text-mute-350" />
        <p className="font-sans text-comparison-cell text-ink-900">{row.traditionalClinic}</p>
      </div>
    </>
  );
}
