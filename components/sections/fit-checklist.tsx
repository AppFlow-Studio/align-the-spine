import type { FitChecklistRow } from "@/content/home-visits";

export interface FitChecklistProps {
  rows: FitChecklistRow[];
}

/** "Usually a good fit" vs "Usually better in-office" two-column comparison
 * per the Home-visits-v2 artboard (ATS-111). */
export function FitChecklist({ rows }: FitChecklistProps) {
  return (
    <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
      <h3 className="font-display text-h2 text-teal-500">Usually a good fit</h3>
      <h3 className="font-display text-h2 text-ink-500">Usually better in-office</h3>

      {rows.map((row) => (
        <div key={row.goodFit} className="contents">
          <p className="border-t border-mute-300 py-6 font-alt text-alt-label text-ink-900">
            {row.goodFit}
          </p>
          <p className="border-t border-mute-300 py-6 font-alt text-alt-label text-ink-500">
            {row.inOffice}
          </p>
        </div>
      ))}
    </div>
  );
}
