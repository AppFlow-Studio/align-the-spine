/**
 * Patient acknowledgment email. Confirms a request was RECEIVED — never that
 * an appointment is confirmed. Copy varies only by the two categorical
 * `intent` values Supabase already computes ("general" vs "car_accident"),
 * not by the specific form — deliberately coarse so it never asserts
 * something a given submitter didn't actually say (e.g. a specific injury,
 * a guaranteed insurance outcome). No form answers are echoed back, no
 * tracking, one CTA.
 */
import { ctaButton, escapeHtml, paragraph, renderShell, type EmailDocument } from "./layout";
import { brand, practice } from "./theme";

export interface PatientAckProps {
  /** Absent for legitimate legacy/edge records — falls back to a neutral greeting. */
  firstName?: string | null;
  intent: "general" | "car_accident";
}

interface IntentCopy {
  subject: string;
  preheader: string;
  intro: string;
  /** Optional highlighted callout below the intro — omitted for "general". */
  calloutHtml?: string;
}

const COPY: Record<PatientAckProps["intent"], IntentCopy> = {
  general: {
    subject: "We Got Your Request — Align the Spine Chiropractic",
    preheader:
      "Thanks for reaching out. Our team will review your request and follow up shortly to help you get back to feeling your best.",
    intro:
      "We received your request. Living with ongoing pain isn't something to push through — a member of our team will review what you shared and reach out shortly to get you scheduled.",
  },
  car_accident: {
    subject: "Your Car Accident Evaluation Request Has Been Received",
    preheader:
      "We received your car accident evaluation request. Timing can matter for care and PIP coverage — our team will reach out shortly.",
    intro:
      "We received your car accident evaluation request. Symptoms from a collision can build in the days afterward, and timing can matter — a member of our team will review your request and reach out shortly.",
    calloutHtml: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
        <tr>
          <td style="padding:14px 18px;background-color:#fff7ed;border-left:4px solid ${brand.gold400};border-radius:6px;font-family:${brand.sansFont};font-size:14px;line-height:1.6;color:${brand.ink900};">
            Florida PIP generally requires initial care within 14 days of a motor vehicle accident. Coverage depends on your policy, eligibility, and the circumstances of your claim.
          </td>
        </tr>
      </table>`,
  },
};

function greeting(firstName?: string | null): string {
  const trimmed = firstName?.trim();
  return trimmed ? `Thank you, ${trimmed}` : "Thank you for contacting us";
}

export function renderPatientAcknowledgment(props: PatientAckProps): EmailDocument {
  const copy = COPY[props.intent];
  const heading = greeting(props.firstName);

  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:${brand.displayFont};font-size:24px;line-height:1.3;font-weight:700;color:${brand.navy900};">
      ${escapeHtml(heading)}
    </h1>
    ${paragraph(escapeHtml(copy.intro))}
    ${copy.calloutHtml ?? ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:14px 18px;background-color:${brand.panel100};border-left:4px solid ${brand.teal500};border-radius:6px;font-family:${brand.sansFont};font-size:16px;line-height:1.5;color:${brand.ink900};">
          <strong>Our office will contact you shortly to confirm your appointment.</strong>
        </td>
      </tr>
    </table>
    ${paragraph("Need to speak with us sooner?")}
    ${ctaButton(`Call ${practice.phoneDisplay}`, practice.phoneHref)}
    <p style="margin:20px 0 16px;font-family:${brand.sansFont};font-size:14px;line-height:1.6;color:${brand.mute400};">
      For your privacy, please do not reply with medical records, diagnosis details, insurance documents, claim numbers, or other sensitive information. If you need immediate medical attention, call 911 or seek emergency care.
    </p>
    <p style="margin:0;font-family:${brand.sansFont};font-size:14px;line-height:1.6;color:${brand.mute400};">
      This message confirms that we received a request submitted through our website. It does not confirm an appointment or provide medical advice.
    </p>`;

  const html = renderShell({ title: copy.subject, preheader: copy.preheader, bodyHtml });

  const text = [
    heading,
    "",
    copy.intro,
    props.intent === "car_accident"
      ? "\nFlorida PIP generally requires initial care within 14 days of a motor vehicle accident. Coverage depends on your policy, eligibility, and the circumstances of your claim.\n"
      : "",
    "Our office will contact you shortly to confirm your appointment.",
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
    "This message confirms that we received a request submitted through our website. It does not confirm an appointment or provide medical advice.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return { subject: copy.subject, html, text };
}
