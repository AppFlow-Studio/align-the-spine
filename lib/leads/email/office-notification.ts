/**
 * Office lead notification — this IS the CRM for day-to-day purposes; there
 * is no admin dashboard. Prioritizes speed and scannability: subject and
 * priority badge surface urgency immediately, every field is scannable in
 * one glance, and the CTA is a direct callback link — never a link to any
 * internal page, since none exists.
 */
import { ctaButton, escapeHtml, renderShell, type EmailDocument } from "./layout";
import { brand } from "./theme";

const FORM_LABELS: Record<string, string> = {
  heroEval: "Evaluation Request",
  accidentEval: "Car Accident Evaluation Request",
  contactUs: "Contact Form Submission",
  carAccident: "Car Accident Evaluation Request",
  reviewsEval: "Evaluation Request",
  contact: "Contact Request",
  eligibility: "Home Visit Eligibility Check",
  booking: "Appointment Request",
};

export interface OfficeNotificationProps {
  shortSubmissionId: string;
  formId: string;
  formVersion: number;
  intent: "general" | "car_accident";
  priority: "high" | "standard";
  createdAtLocal: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  zip?: string | null;
  bestTime?: string | null;
  carAccident?: string | null;
  sourcePath?: string | null;
  attributionSummary?: string | null;
  /** Present ONLY when the sensitive-email gate is on. */
  sensitive?: { message?: string; accidentDate?: string } | null;
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:8px 0;font-family:${brand.sansFont};font-size:13px;line-height:1.4;color:${brand.mute400};width:150px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;font-family:${brand.sansFont};font-size:15px;line-height:1.5;color:${brand.ink900};vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`;
}

function priorityBadge(priority: "high" | "standard"): string {
  const isHigh = priority === "high";
  const bg = isHigh ? brand.gold400 : brand.panel100;
  const color = isHigh ? brand.ink900 : brand.mute400;
  const label = isHigh ? "HIGH PRIORITY — Car Accident" : "Standard";
  return `<span style="display:inline-block;padding:4px 12px;border-radius:40px;background-color:${bg};font-family:${brand.sansFont};font-size:12px;font-weight:600;letter-spacing:0.5px;color:${color};">${escapeHtml(label)}</span>`;
}

export function renderOfficeNotification(props: OfficeNotificationProps): EmailDocument {
  const formLabel = FORM_LABELS[props.formId] ?? "Appointment Request";
  const displayName = props.name ?? "New lead";
  const subject =
    props.priority === "high"
      ? `HIGH PRIORITY: ${formLabel} — ${displayName}`
      : `New ${formLabel} — ${displayName}`;
  const preheader =
    props.priority === "high"
      ? `${displayName} submitted a car accident evaluation request. A fast callback matters here.`
      : `${displayName} submitted a ${formLabel.toLowerCase()}. Details inside.`;

  const sensitiveHtml =
    props.sensitive && (props.sensitive.message || props.sensitive.accidentDate)
      ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;">
      <tr>
        <td style="padding:14px 18px;background-color:#fff7ed;border:1px solid ${brand.gold400};border-radius:6px;">
          <div style="font-family:${brand.sansFont};font-size:12px;font-weight:600;letter-spacing:0.5px;color:${brand.mute400};text-transform:uppercase;margin-bottom:6px;">Sensitive (gated)</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${row("Accident date", props.sensitive.accidentDate)}
            ${row("Message", props.sensitive.message)}
          </table>
        </td>
      </tr>
    </table>`
      : "";

  const bodyHtml = `
    <div style="margin:0 0 12px;">${priorityBadge(props.priority)}</div>
    <h1 style="margin:0 0 4px;font-family:${brand.displayFont};font-size:22px;line-height:1.3;font-weight:700;color:${brand.navy900};">${escapeHtml(formLabel)}</h1>
    <p style="margin:0 0 20px;font-family:${brand.sansFont};font-size:14px;color:${brand.mute400};">Submitted ${escapeHtml(props.createdAtLocal)} · #${escapeHtml(props.shortSubmissionId)}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      ${row("Name", props.name)}
      ${row("Phone", props.phone)}
      ${row("Email", props.email)}
      ${row("ZIP", props.zip)}
      ${row("Preferred time", props.bestTime)}
      ${row("Accident-related", props.carAccident)}
      ${row("Source page", props.sourcePath)}
      ${row("Campaign", props.attributionSummary)}
    </table>

    ${sensitiveHtml}

    ${props.phone ? ctaButton(`Call ${props.name ?? "lead"}`, `tel:${props.phone.replace(/[^\d+]/g, "")}`) : ""}`;

  const html = renderShell({ title: subject, preheader, bodyHtml });

  const textLines = [
    `${formLabel}${props.priority === "high" ? " — HIGH PRIORITY" : ""}`,
    `Submission: #${props.shortSubmissionId}`,
    `Submitted: ${props.createdAtLocal}`,
    "",
    props.name ? `Name: ${props.name}` : "",
    props.phone ? `Phone: ${props.phone}` : "",
    props.email ? `Email: ${props.email}` : "",
    props.zip ? `ZIP: ${props.zip}` : "",
    props.bestTime ? `Preferred time: ${props.bestTime}` : "",
    props.carAccident ? `Accident-related: ${props.carAccident}` : "",
    props.sourcePath ? `Source page: ${props.sourcePath}` : "",
    props.attributionSummary ? `Campaign: ${props.attributionSummary}` : "",
    props.sensitive?.accidentDate ? `Accident date: ${props.sensitive.accidentDate}` : "",
    props.sensitive?.message ? `Message: ${props.sensitive.message}` : "",
  ].filter((line) => line !== "");

  return { subject, html, text: textLines.join("\n") };
}
