/**
 * Patient acknowledgment email. Confirms a request was RECEIVED — never that an
 * appointment is confirmed — and reduces uncertainty without being promotional,
 * urgent, or medical. Copy is the client-approved baseline (Phase 7), adapted
 * only for responsive layout. No form answers are echoed; no tracking; one CTA.
 */
import { ctaButton, escapeHtml, paragraph, renderShell, type EmailDocument } from "./layout";
import { brand, practice } from "./theme";

export interface PatientAckProps {
  /** Absent for legitimate legacy/edge records — falls back to a neutral greeting. */
  firstName?: string | null;
}

const SUBJECT = "We received your appointment request | Align the Spine";
const PREHEADER =
  "Thank you for contacting Align the Spine Chiropractic. Our team will review your request and follow up as soon as possible.";

function greeting(firstName?: string | null): string {
  const trimmed = firstName?.trim();
  return trimmed ? `Thank you, ${trimmed}` : "Thank you for contacting us";
}

export function renderPatientAcknowledgment(props: PatientAckProps): EmailDocument {
  const heading = greeting(props.firstName);

  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:${brand.displayFont};font-size:24px;line-height:1.3;font-weight:700;color:${brand.navy900};">
      ${escapeHtml(heading)}
    </h1>
    ${paragraph(
      "We received your appointment request. A member of the Align the Spine Chiropractic team will review it and contact you as soon as possible using the information you provided.",
    )}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:14px 18px;background-color:${brand.panel100};border-left:4px solid ${brand.teal500};border-radius:6px;font-family:${brand.sansFont};font-size:16px;line-height:1.5;color:${brand.ink900};">
          <strong>Your appointment is not confirmed until our office contacts you.</strong>
        </td>
      </tr>
    </table>
    ${paragraph("Need to speak with us sooner?")}
    ${ctaButton(`Call ${practice.phoneDisplay}`, practice.phoneHref)}
    <p style="margin:20px 0 16px;font-family:${brand.sansFont};font-size:14px;line-height:1.6;color:${brand.mute400};">
      For your privacy, please do not reply with medical records, diagnosis details, insurance documents, claim numbers, or other sensitive information. If you need immediate medical attention, call 911 or seek emergency care.
    </p>
    <p style="margin:0;font-family:${brand.sansFont};font-size:14px;line-height:1.6;color:${brand.mute400};">
      This message confirms that we received a request submitted through chirobackpain.com. It does not confirm an appointment or provide medical advice.
    </p>`;

  const html = renderShell({ title: SUBJECT, preheader: PREHEADER, bodyHtml });

  const text = [
    heading,
    "",
    "We received your appointment request. A member of the Align the Spine Chiropractic team will review it and contact you as soon as possible using the information you provided.",
    "",
    "Your appointment is not confirmed until our office contacts you.",
    "",
    "Need to speak with us sooner?",
    `Call ${practice.phoneDisplay}`,
    "",
    practice.name,
    practice.addressLine1,
    practice.addressLine2,
    "",
    "For your privacy, please do not reply with medical records, diagnosis details, insurance documents, claim numbers, or other sensitive information. If you need immediate medical attention, call 911 or seek emergency care.",
    "",
    "This message confirms that we received a request submitted through chirobackpain.com. It does not confirm an appointment or provide medical advice.",
  ].join("\n");

  return { subject: SUBJECT, html, text };
}
