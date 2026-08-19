/**
 * Shared email-safe HTML shell + helpers. Single-column, ~600px, table-based
 * with inline styles (the only reliably-rendered approach across Gmail
 * desktop/mobile, Outlook, and Apple Mail). No external CSS, no web fonts,
 * no tracking pixels, no animation.
 */
import { brand, practice } from "./theme";

/** Escapes the five HTML-significant characters. EVERY interpolated dynamic
 * value passes through this so a form value can never inject markup. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface EmailDocument {
  subject: string;
  html: string;
  text: string;
}

/**
 * Photo hero band, same treatment the site's own hero sections use (a real
 * photo + a navy diagonal tint — see blog-hero.tsx's identical gradient) —
 * not a literal CSS blur, which most email clients don't apply reliably.
 * `background-color` is the fallback for clients that ignore
 * `background-image` entirely (Outlook desktop): still solid navy, still
 * fully readable, nothing breaks.
 */
function header(): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td
          align="center"
          bgcolor="${brand.navy900}"
          style="background-color:${brand.navy900};background-image:linear-gradient(rgba(20,26,56,0.88),rgba(20,26,56,0.72)),url('${practice.heroImageUrl}');background-size:cover;background-position:center 30%;padding:36px 32px;"
        >
          <img
            src="${practice.logoUrl}"
            alt="${escapeHtml(practice.name)}"
            width="96"
            height="96"
            style="display:block;width:96px;height:96px;border:0;outline:none;margin:0 auto;filter:drop-shadow(0 1px 4px rgba(0,0,0,0.35));"
          />
        </td>
      </tr>
    </table>`;
}

function footer(): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:20px 32px 28px;border-top:1px solid ${brand.border};font-family:${brand.sansFont};font-size:12px;line-height:1.6;color:${brand.mute400};">
          ${escapeHtml(practice.name)}<br />
          ${escapeHtml(practice.addressLine1)}<br />
          ${escapeHtml(practice.addressLine2)}
        </td>
      </tr>
    </table>`;
}

/**
 * Wraps body content in the branded shell. `preheader` is the hidden inbox
 * preview line. `bodyHtml` is trusted HTML the caller has already assembled
 * from escaped values.
 */
export function renderShell(options: {
  title: string;
  preheader: string;
  bodyHtml: string;
}): string {
  const { title, preheader, bodyHtml } = options;
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light only" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${brand.panel100};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${brand.panel100};">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background-color:${brand.white};border-radius:12px;overflow:hidden;border:1px solid ${brand.border};">
            <tr><td>${header()}</td></tr>
            <tr><td style="padding:28px 32px 8px;">${bodyHtml}</td></tr>
            <tr><td>${footer()}</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** A primary pill CTA button (table-based so Outlook renders it). Min 44px tall. */
export function ctaButton(label: string, href: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">
      <tr>
        <td align="center" bgcolor="${brand.teal500}" style="border-radius:40px;">
          <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 32px;min-height:44px;box-sizing:border-box;font-family:${brand.sansFont};font-size:16px;line-height:20px;font-weight:600;color:${brand.white};text-decoration:none;border-radius:40px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

/** Paragraph helper with brand body styling. `html` is already-escaped/assembled. */
export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${brand.sansFont};font-size:16px;line-height:1.6;color:${brand.ink900};">${html}</p>`;
}
