import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CheckIcon } from "@/components/ui/icons/check";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  autoAccidentComparisonRows,
  comparisonTableColumnHeadings,
  comparisonTableEyebrow,
  comparisonTableFootnote,
  comparisonTableHeading,
  comparisonTableRows,
  comparisonTableSubheading,
  type ComparisonRow,
} from "@/content/comparison-table";
import { cn } from "@/lib/cn";

export interface ComparisonTableProps {
  variant?: "default" | "auto-accident";
  className?: string;
}

/** "Align the Spine vs Traditional Clinic" 3-column comparison per
 * condition-page-spec §B5, §C. Rows are data-driven (content/comparison-table.ts);
 * the "auto-accident" variant appends 2 extra rows (continuity-of-doctor,
 * attorney-referral note) for the not-yet-built /auto-accidents page. The
 * middle "Align the Spine" column is a navy inset card against the two plain
 * light columns either side of it — this is the "highlighted" column the
 * reference design calls for. */
export function ComparisonTable({ variant = "default", className }: ComparisonTableProps) {
  const rows =
    variant === "auto-accident"
      ? [...comparisonTableRows, ...autoAccidentComparisonRows]
      : comparisonTableRows;

  return (
    <Section className={className}>
      <Container>
        <div className="flex flex-col gap-10 md:gap-12">
          <SectionHeading
            eyebrow={comparisonTableEyebrow}
            tone="navy-900"
            sub={comparisonTableSubheading}
            className="mx-auto max-w-2xl items-center text-center"
          >
            {comparisonTableHeading}
          </SectionHeading>

          <Card radius={30} shadow="comparison" className="overflow-hidden">
            <div className="snap-x snap-mandatory overflow-x-auto">
              <div className="grid min-w-[720px] grid-cols-3">
                <div className="snap-start px-6 py-8 md:px-8">
                  <p className="font-display text-h2 text-ink-900">
                    {comparisonTableColumnHeadings.careBenefits}
                  </p>
                </div>
                <div className="snap-start rounded-t-20 bg-navy-900 px-6 py-8 md:px-8">
                  <p className="font-display text-h2 text-white">
                    {comparisonTableColumnHeadings.alignTheSpine}
                  </p>
                </div>
                <div className="snap-start px-6 py-8 md:px-8">
                  <p className="font-display text-h2 text-mute-350">
                    {comparisonTableColumnHeadings.traditionalClinic}
                  </p>
                </div>

                {rows.map((row, index) => (
                  <ComparisonRowCells
                    key={row.label}
                    row={row}
                    isLast={index === rows.length - 1}
                  />
                ))}
              </div>
            </div>

            <p className="border-t border-mute-300 px-6 py-6 text-center font-sans text-small-print text-mute-400 md:px-8">
              {comparisonTableFootnote}
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

function ComparisonRowCells({ row, isLast }: { row: ComparisonRow; isLast: boolean }) {
  return (
    <>
      <div className="snap-start flex items-center border-t border-mute-300 px-6 py-6 md:px-8">
        <p className="font-sans text-stat-label text-ink-900">{row.label}</p>
      </div>
      <div
        className={cn(
          "snap-start flex items-center gap-3 bg-navy-900 px-6 py-6 md:px-8",
          isLast && "rounded-b-20",
        )}
      >
        <CheckIcon className="h-4 w-4 shrink-0 text-teal-500" />
        <p className="font-sans text-stat-label text-white">{row.alignTheSpine}</p>
      </div>
      <div className="snap-start flex items-center border-t border-mute-300 px-6 py-6 md:px-8">
        <p className="font-sans text-stat-label text-ink-500">{row.traditionalClinic}</p>
      </div>
    </>
  );
}
