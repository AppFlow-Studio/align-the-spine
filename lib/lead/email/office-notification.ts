/**
 * Office lead notification. Prioritizes speed, scannability, and safe follow-up.
 * The subject carries NO PII (form label + short submission id only). Only
 * operationally-necessary validated values appear; sensitive fields (message,
 * accidentDate) are included ONLY when the caller passes them — which the worker
 * does solely when LEAD_EMAIL_INCLUDE_SENSITIVE=true (default off).
 */
import { ctaButton, escapeHtml, renderShell, type EmailDocument } from "./layout";
import { brand } from "./theme";

export interface OfficeNotificationProps {
  shortSubmissionId: string;
  formLabel: string;
  formVersion: number;
  priority: "high" | "standard";
  createdAtUtc: string;
  createdAtLocal: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  zip?: string | null;
  bestTime?: string | null;
  reason?: string | null;
  /** "yes"/"no" accident intent, when collected. */
  carAccident?: string | null;
  sourcePath?: string | null;
  attributionSummary?: string | null;
  /** Opaque, auth-gated CRM link (contains only the lead UUID). */
  adminUrl: string;
  deliveryStatus?: string | null;
  /** Present ONLY when the sensitive-email gate is on. */
  sensitive?: { message?: string; accidentDate?: string } | null;
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:8px 0;font-family:${brand.sansFont};font-size:13px;line-height:1.4;color:${brand.mute400};width:170px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;font-family:${brand.sansFont};font-size:15px;line-height:1.5;color:${brand.ink900};vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`;
}

function priorityBadge(priority: "high" | "standard"): string {
  const isHigh = priority === "high";
  const bg = isHigh ? brand.gold400 : brand.panel100;
  const color = isHigh ? brand.ink900 : brand.mute400;
  const label = isHigh ? "HIGH — accident-related" : "Standard";
  return `<span style="display:inline-block;padding:4px 12px;border-radius:40px;background-color:${bg};font-family:${brand.sansFont};font-size:12px;font-weight:600;letter-spacing:0.5px;color:${color};">${escapeHtml(label)}</span>`;
}

export function renderOfficeNotification(props: OfficeNotificationProps): EmailDocument {
  const subject = `New website appointment request | ${props.formLabel} | ${props.shortSubmissionId}`;
  const preheader = `New ${props.formLabel} lead (${props.priority} priority) — open in the CRM to follow up.`;

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
    <h1 style="margin:0 0 4px;font-family:${brand.displayFont};font-size:22px;line-height:1.3;font-weight:700;color:${brand.navy900};">New appointment request</h1>
    <p style="margin:0 0 20px;font-family:${brand.sansFont};font-size:14px;color:${brand.mute400};">${escapeHtml(props.formLabel)} · v${props.formVersion} · #${escapeHtml(props.shortSubmissionId)}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      ${row("Name", props.name)}
      ${row("Phone", props.phone)}
      ${row("Email", props.email)}
      ${row("ZIP", props.zip)}
      ${row("Preferred time", props.bestTime)}
      ${row("Reason", props.reason)}
      ${row("Accident-related", props.carAccident)}
      ${row("Submitted (UTC)", props.createdAtUtc)}
      ${row("Submitted (ET)", props.createdAtLocal)}
      ${row("Source page", props.sourcePath)}
      ${row("Attribution", props.attributionSummary)}
      ${row("Delivery", props.deliveryStatus)}
    </table>

    ${sensitiveHtml}

    ${ctaButton("Open lead in CRM", props.adminUrl)}`;

  const html = renderShell({ title: subject, preheader, bodyHtml });

  const textLines = [
    `New appointment request — ${props.formLabel} (v${props.formVersion})`,
    `Priority: ${props.priority === "high" ? "HIGH — accident-related" : "Standard"}`,
    `Submission: #${props.shortSubmissionId}`,
    "",
    props.name ? `Name: ${props.name}` : "",
    props.phone ? `Phone: ${props.phone}` : "",
    props.email ? `Email: ${props.email}` : "",
    props.zip ? `ZIP: ${props.zip}` : "",
    props.bestTime ? `Preferred time: ${props.bestTime}` : "",
    props.reason ? `Reason: ${props.reason}` : "",
    props.carAccident ? `Accident-related: ${props.carAccident}` : "",
    `Submitted (UTC): ${props.createdAtUtc}`,
    `Submitted (ET): ${props.createdAtLocal}`,
    props.sourcePath ? `Source page: ${props.sourcePath}` : "",
    props.attributionSummary ? `Attribution: ${props.attributionSummary}` : "",
    props.deliveryStatus ? `Delivery: ${props.deliveryStatus}` : "",
    props.sensitive?.accidentDate ? `Accident date: ${props.sensitive.accidentDate}` : "",
    props.sensitive?.message ? `Message: ${props.sensitive.message}` : "",
    "",
    `Open lead in CRM: ${props.adminUrl}`,
  ].filter((line) => line !== "");

  return { subject, html, text: textLines.join("\n") };
}
