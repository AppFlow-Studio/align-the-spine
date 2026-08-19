/** Florida PIP: treatment must begin within 14 days of the accident
 * (condition-page-spec §B4). Pure date math — no DOM, unit-tested. */

export const PIP_WINDOW_DAYS = 14;

/** Days remaining at or below this count as "act now" urgency. */
const URGENT_THRESHOLD = 3;

export type PipStatus = "future" | "active" | "urgent" | "expired";

export interface PipWindowResult {
  status: PipStatus;
  /** Calendar days left to begin treatment. 0 = today is the last day;
   * negative once expired; PIP_WINDOW_DAYS when the accident was today. */
  daysRemaining: number;
  message: string;
}

/** Calendar-day index, immune to DST and time-of-day differences. */
function dayNumber(date: Date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export function calculatePipWindow(accidentDate: Date, today: Date = new Date()): PipWindowResult {
  const elapsed = dayNumber(today) - dayNumber(accidentDate);
  const daysRemaining = PIP_WINDOW_DAYS - elapsed;

  if (elapsed < 0) {
    return {
      status: "future",
      daysRemaining,
      message: "That date is in the future — double-check the date of your accident.",
    };
  }

  if (daysRemaining < 0) {
    return {
      status: "expired",
      daysRemaining,
      message:
        "The 14-day PIP window has passed, but you may still have options — call us to discuss your case.",
    };
  }

  if (daysRemaining === 0) {
    return {
      status: "urgent",
      daysRemaining,
      message:
        "The general 14-day initial-care timing period ends today. Coverage depends on the policy and circumstances; contact your insurer or a qualified professional for guidance.",
    };
  }

  if (daysRemaining <= URGENT_THRESHOLD) {
    return {
      status: "urgent",
      daysRemaining,
      message: `${daysRemaining} ${daysRemaining === 1 ? "day remains" : "days remain"} in the general 14-day initial-care timing period. Coverage depends on the policy and circumstances.`,
    };
  }

  return {
    status: "active",
    daysRemaining,
    message: `${daysRemaining} days remain in the general 14-day initial-care timing period. Coverage and eligibility depend on the policy and circumstances.`,
  };
}

/** Strict mm/dd/yyyy parser. Returns null for incomplete or impossible dates
 * (e.g. 02/30/2026) instead of letting Date roll them over. */
export function parseUsDate(value: string): Date | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}
