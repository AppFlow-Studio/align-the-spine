export interface JsonLdProps {
  data: object;
}

/** Walks a JSON-LD payload and throws if any string field is exactly the
 * "#" placeholder (e.g. an unconfirmed social URL) — a fragment like
 * "https://x.com/#organization" is fine, only a bare "#" is rejected. Every
 * builder in lib/schema.ts should already omit unverified fields, but this
 * is the last line of defense before anything reaches the page. */
function assertNoPlaceholderUrls(value: unknown, path = "$"): void {
  if (typeof value === "string") {
    if (value.trim() === "#") {
      throw new Error(
        `JsonLd: placeholder "#" URL at ${path} — omit the field until a real URL is confirmed.`,
      );
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoPlaceholderUrls(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      assertNoPlaceholderUrls(nested, `${path}.${key}`);
    }
  }
}

/** Renders a schema.org JSON-LD `<script>` tag. The one place every
 * structured-data block (lib/schema.ts's builders) gets serialized, so
 * script-closing escaping and placeholder-URL rejection stay consistent —
 * replaces the old script-tag serializer this file's sibling once owned. */
export function JsonLd({ data }: JsonLdProps) {
  assertNoPlaceholderUrls(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/[<>]/g, (char) =>
          char === "<" ? "\\u003c" : "\\u003e",
        ),
      }}
    />
  );
}
