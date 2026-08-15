import type { ReactNode } from "react";

/** Service/injury terms worth bolding wherever a real review happens to use
 * them — mirrors how Google's own review UI bolds matched search terms in
 * snippets. Picked for what this practice wants to rank/convert on (car
 * accidents/PIP work, back pain, mobile/home visits), not every possible
 * word a reviewer might use — sparse and intentional beats bolding half the
 * sentence. Longer phrases first so e.g. "lower back pain" isn't left with
 * "lower" unbolded in front of a separately-matched "back pain". */
const REVIEW_KEYWORDS = [
  "lower back pain",
  "back pain",
  "car accident",
  "mobile services",
  "pain free",
  "injuries",
  "injury",
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const KEYWORD_PATTERN = new RegExp(`\\b(${REVIEW_KEYWORDS.map(escapeRegExp).join("|")})\\b`, "gi");

/** Splits `text` on REVIEW_KEYWORDS (case-insensitive) and wraps each match
 * in <strong>, returning a ReactNode array safe to drop straight into JSX —
 * no dangerouslySetInnerHTML, since every review here is real user-authored
 * text and this only ever needs to bold, never inject markup. */
export function highlightReviewKeywords(text: string): ReactNode {
  const parts = text.split(KEYWORD_PATTERN);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
