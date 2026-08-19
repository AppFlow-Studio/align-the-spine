import { z } from "zod";

const safeText = z
  .string()
  .trim()
  .min(1)
  .max(20_000)
  .refine((value) => !/<\/?(?:script|iframe|object|embed|style)\b/i.test(value), {
    message: "Raw executable or embedded HTML is not allowed.",
  })
  .refine((value) => !/\bon\w+\s*=/i.test(value), {
    message: "Inline event handlers are not allowed.",
  });

const blockId = z.string().regex(/^[a-z0-9][a-z0-9_-]{2,63}$/i);

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ id: blockId, type: z.literal("paragraph"), text: safeText }),
  z.object({
    id: blockId,
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
    text: safeText.max(180),
  }),
  z.object({
    id: blockId,
    type: z.literal("list"),
    style: z.enum(["ordered", "unordered"]),
    items: z.array(safeText.max(1_000)).min(1).max(30),
  }),
  z.object({
    id: blockId,
    type: z.literal("quote"),
    text: safeText.max(2_000),
    attribution: safeText.max(200).optional(),
  }),
  z.object({
    id: blockId,
    type: z.literal("callout"),
    tone: z.enum(["answer", "info", "warning", "emergency"]),
    title: safeText.max(160),
    text: safeText.max(4_000),
  }),
  z
    .object({
      id: blockId,
      type: z.literal("image"),
      assetId: z.uuid(),
      alt: z.string().trim().max(300),
      caption: safeText.max(500).optional(),
      decorative: z.boolean().optional(),
    })
    .refine((block) => Boolean(block.decorative) !== Boolean(block.alt), {
      message: "Images require useful alt text, or must be explicitly decorative.",
      path: ["alt"],
    }),
  z
    .object({
      id: blockId,
      type: z.literal("table"),
      caption: safeText.max(300),
      headers: z.array(safeText.max(200)).min(1).max(10),
      rows: z
        .array(z.array(safeText.max(1_000)).min(1).max(10))
        .min(1)
        .max(100),
    })
    .refine((block) => block.rows.every((row) => row.length === block.headers.length), {
      message: "Every table row must match the number of headers.",
      path: ["rows"],
    }),
]);

export const contentBlocksSchema = z
  .array(contentBlockSchema)
  .min(1)
  .max(250)
  .superRefine((blocks, ctx) => {
    const ids = new Set<string>();
    let previousHeading = 1;
    for (const [index, block] of blocks.entries()) {
      if (ids.has(block.id)) {
        ctx.addIssue({ code: "custom", path: [index, "id"], message: "Block IDs must be unique." });
      }
      ids.add(block.id);
      if (block.type === "heading") {
        if (block.level > previousHeading + 1) {
          ctx.addIssue({
            code: "custom",
            path: [index, "level"],
            message: "Heading levels cannot skip a level.",
          });
        }
        previousHeading = block.level;
      }
    }
  });

export const faqItemSchema = z.object({
  id: blockId,
  question: safeText.max(300),
  answer: safeText.max(2_000),
});

export const faqsSchema = z.array(faqItemSchema).max(20);

export const keyTakeawaysSchema = z.array(safeText.max(300)).max(12);

export const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase hyphenated slug.");

export const contentStatusSchema = z.enum([
  "draft",
  "in_review",
  "approved",
  "scheduled",
  "published",
  "archived",
]);

export const editorialUpdateSchema = z
  .object({
    expectedVersion: z.number().int().positive(),
    title: safeText.min(12).max(180),
    excerpt: safeText.min(40).max(500),
    directAnswer: safeText.min(30).max(1_000),
    keyTakeaways: keyTakeawaysSchema,
    faqs: faqsSchema,
    blocks: contentBlocksSchema,
    seoTitle: safeText.min(12).max(180),
    metaDescription: safeText.min(70).max(500),
    /** Optional social-share overrides — fall back to seoTitle/metaDescription
     * when unset, same as every OG consumer already assumes. */
    ogTitle: safeText.max(180).optional().or(z.literal("")),
    ogDescription: safeText.max(300).optional().or(z.literal("")),
    /** CDN URL for the article's hero/featured image (BlogArticleHero) —
     * pasted directly rather than uploaded through this form; there's no
     * asset-management/approval UI here yet, so this trusts the URL as
     * already-hosted, already-approved media the editor has the rights to
     * use. `https://` only, so it can never point at something the app
     * itself would resolve as a local/internal path. */
    featuredImageUrl: z
      .string()
      .trim()
      .max(2_000)
      .refine((value) => value === "" || value.startsWith("https://"), {
        message: "Must be a full https:// URL.",
      })
      .optional()
      .or(z.literal("")),
    featuredImageAlt: safeText.max(200).optional().or(z.literal("")),
    featured: z.boolean(),
    noindex: z.boolean(),
    /** Required whenever noindex is true — mirrors the database's own
     * `noindex_reason_required` check constraint so a bad save fails in the
     * form, not silently at the RPC. */
    noindexReason: safeText.max(300).optional().or(z.literal("")),
    changeNote: safeText.min(3).max(500),
  })
  .refine((value) => !value.noindex || Boolean(value.noindexReason?.trim()), {
    message: "A reason is required whenever this item is marked noindex.",
    path: ["noindexReason"],
  });

export function countWords(blocks: z.infer<typeof contentBlocksSchema>): number {
  return blocks.reduce((total, block) => {
    const strings =
      block.type === "list"
        ? block.items
        : block.type === "table"
          ? [block.caption, ...block.headers, ...block.rows.flat()]
          : block.type === "image"
            ? [block.caption ?? ""]
            : block.type === "callout"
              ? [block.title, block.text]
              : block.type === "quote"
                ? [block.text, block.attribution ?? ""]
                : [block.text];
    return total + strings.join(" ").split(/\s+/).filter(Boolean).length;
  }, 0);
}

export function estimatedReadingMinutes(blocks: z.infer<typeof contentBlocksSchema>): number {
  return Math.max(1, Math.ceil(countWords(blocks) / 220));
}
