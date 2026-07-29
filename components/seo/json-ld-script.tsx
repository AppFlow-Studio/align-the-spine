export interface JsonLdScriptProps {
  data: object;
}

/** Renders a schema.org JSON-LD `<script>` tag. Shared by every structured-
 * data block (LocalBusiness, FAQPage, ...) so escaping stays consistent —
 * lifted from the pattern already used in faq-section.tsx. */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
