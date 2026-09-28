# Blog CMS → Supabase reference

For building the blog CMS as its own repo/project against the existing Supabase database
(`qaaptlxxwfvxzgyzjhub`, "Align The Spine"). This is the live, current schema as of 2026-08-19 —
verified directly against the database, not from memory. Service areas share the same tables
(`content_type = 'service_area'`) but this doc focuses on `blog_post`.

Note: this project replaces an earlier one (`tsbbpjmuvoydojwthofv`) that this doc used to
reference. The schema is identical — same migrations, just reapplied to the project the team
standardized on — but any old connection details from that project no longer work.

## Connection

- Project URL: `https://qaaptlxxwfvxzgyzjhub.supabase.co`
- Anon/publishable key (safe client-side): `sb_publishable_r7Ie6LMugdylYeow9m0Yag_3GVnDNyf`
- For writes: RLS on every table below requires the acting Postgres role to either (a) use the
  **service role key** (bypasses RLS — keep it server-only, never in a browser bundle), or
  (b) be an authenticated Supabase user whose `profiles.role` is `admin` or `editor` (checked via
  `auth.uid()` in every policy and in the `save_content_draft` RPC). There's no public/anon write
  path by design.
- Two existing `profiles.role = 'admin'`-eligible flows already exist in this repo
  (`app/admin/login`, `requireEditorialActor()` in `lib/content/authorization.ts`) if useful as a
  reference for how auth is wired, but your new project doesn't need to reuse them — a service
  role key working straight through the RPC below is simplest for a standalone CMS.

## Posts publish themselves (2026-09-27)

No review step, no approval handoff, no "remember to flip it to published". Whatever you write —
admin form, Supabase table editor, SQL editor, client library — is checked by the database against
the publication gate on every insert and update, and the moment it passes it becomes a live page.

Three migrations own this:

| Migration                               | What it does                                                                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `202609270001_blog_writer_self_publish` | Any editorial account can take its own blog post from draft to published. No second approver, no admin-only publish.                   |
| `202609270002_blog_gate_autopublish`    | `content_gate_result()` runs the gate in SQL; a trigger fills derivable fields, recomputes `gate_result`, and promotes a passing post. |
| `202609270003_blog_direct_upload`       | `publish_blog_post()` — one-call upload — plus the webhook that tells the live site to drop its cache.                                 |

Auto-publish holds back exactly two things, both deliberate:

- `noindex = true` — you are saying "not for the public index", so it stays put.
- `status = 'archived'` — retired on purpose; nothing un-retires it but you.

A future `scheduled_for` sends the post to `scheduled` instead of `published`; the
`/api/cron/publish-scheduled` cron releases it when the time arrives. Operational steps —
applying these migrations, verifying them, wiring the cache webhook, and automating publication
from a script or CI — are in [`blog-publishing-runbook.md`](./blog-publishing-runbook.md).

## The one function you actually need: `publish_blog_post`

One call creates or updates a whole post — body, FAQs, image, citations, taxonomy — and tells you
whether it went live. Keyed on `slug`, so calling it again with the same slug edits that post
rather than creating a second one. Safe to re-run.

```sql
select public.publish_blog_post('{
  "slug": "what-to-do-after-a-car-accident-in-deerfield-beach",
  "title": "What to do after a car accident in Deerfield Beach",
  "excerpt": "Calm, practical next steps after a Deerfield Beach crash: emergency red flags, what to document, and general Florida PIP timing.",
  "markdown": "Most people leave a crash with adrenaline doing the talking.\n\n## Check for emergency red flags first\n\nCall 911 if any of these are present.\n\n- Numbness or weakness in an arm or leg\n- A headache that keeps getting worse\n\n## What to document\n\nPhotos of both vehicles, the other driver details, and how you felt that evening.",
  "imageUrl": "https://align-the-spine.b-cdn.net/images/PHOTO-2026-08-17-17-38-56.jpg",
  "imageAlt": "Chiropractic evaluation room at Align the Spine in Deerfield Beach",
  "faqs": [
    { "question": "How soon should I be evaluated after a crash?", "answer": "Sooner is better." }
  ],
  "keyTakeaways": ["Emergency symptoms come first.", "Write down what you remember the same day."],
  "categories": ["car-accident-care"],
  "tags": ["whiplash", "florida-pip"],
  "sources": [
    {
      "title": "Florida Statute 627.736",
      "publisher": "Florida Legislature",
      "url": "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.736.html",
      "accessedDate": "2026-09-27",
      "claimSupported": "The 14-day initial-services window under Florida PIP."
    }
  ]
}'::jsonb);
```

It returns one JSON object:

```json
{
  "id": "…",
  "slug": "what-to-do-after-a-car-accident-in-deerfield-beach",
  "status": "published",
  "publiclyVisible": true,
  "url": "/blog/what-to-do-after-a-car-accident-in-deerfield-beach",
  "gate": { "passed": true, "blockers": [], "recommendations": [], "checkedAt": "…" }
}
```

When `publiclyVisible` is `false`, `gate.blockers` says why in plain sentences. Fix and re-run the
same call.

### Payload fields

Required: `slug`, `title` (12–180 chars), `excerpt` (40–500 chars; make it 70+ if you want it to
double as the meta description), and a body (`markdown` or `blocks`).

Optional: `directAnswer`, `keyTakeaways[]`, `faqs[{question,answer}]`, `seoTitle`,
`metaDescription`, `ogTitle`, `ogDescription`, `imageUrl`, `imageAlt`, `imageWidth`, `imageHeight`,
`authorSlug`, `primaryKeyword`, `searchIntent`, `audience`, `categories[]`, `tags[]`,
`relatedSlugs[]`, `sources[]`, `featured`, `noindex`, `noindexReason`, `emergencyGuidanceRelevant`,
`scheduledFor`, `actorId`.

Filled in when omitted — each one a copy of something you did write, never an invention:

- `seoTitle` ← `title`
- `metaDescription` ← `excerpt`
- `directAnswer` ← the first paragraph of the body
- `authorSlug` ← `dr-abe-nasser`
- `created_by` / `updated_by` ← your `auth.uid()`, or the longest-standing active editorial
  account (admin first, then editor) for a SQL-editor / service-role call

`categories` and `tags` are created on demand if the slug is new, so you are not blocked on
someone seeding a taxonomy row first. `sources` default to `verification_status = 'verified'` —
pass `"verified": false` on one you have not checked yet, and note that an unverified source is
itself a publication blocker.

### `markdown` → blocks

Blank lines separate blocks. `##`/`###`/`####` become headings (never `#` — the `<h1>` is the
title). Consecutive `- ` or `1. ` lines become a list. A `> ` chunk becomes a quote. Everything
else is a paragraph. Ids are minted `blk1`, `blk2`, … Images and tables cannot be expressed in
prose — pass `blocks` directly for those (shape below).

### From the client library

```ts
const { data, error } = await supabase.rpc("publish_blog_post", { payload });
// data.publiclyVisible === true  ->  live at data.url
```

An authenticated caller needs an active `profiles` row with role `admin`, `editor`, or
`clinician_reviewer`. A service-role or SQL-editor call carries no JWT and is trusted.

### `save_content_draft` (still there)

The admin form's autosave path: optimistic concurrency via `version`, snapshots into
`content_revisions`, creates/links the featured-image asset from a URL. Use it when you are editing
one field of a post whose `version` you already hold; use `publish_blog_post` for anything else. It
no longer refuses to edit a published post, so a writer can fix a typo on a live page.

`patch` accepts: `title`, `excerpt`, `directAnswer`, `keyTakeaways` (string array), `faqs`
(`{id, question, answer}[]`), `blocks`, `seoTitle`, `metaDescription`, `ogTitle`, `ogDescription`,
`featuredImageUrl`, `featuredImageAlt`, `featured`, `noindex`, `noindexReason`.

`next_gate_result` is now advisory: the trigger recomputes `gate_result` server-side on every write
and overwrites whatever you pass.

**No clinician review anywhere in this flow.** `clinician_reviewer_id`/`clinician_reviewed_at`
still exist as columns, and a blog post never writes them — the article byline renders "Clinically
reviewed by …" from that field, and it must not appear on a post nobody reviewed. Do not build a
reviewer step.

### Why is my post not live?

```sql
select slug, status, publicly_visible, explanation, blockers
from public.content_publication_readiness
where not publicly_visible;
```

One row per blog post, carrying the gate's own blocker list and a sentence explaining the hold.

### Making the live site notice a direct write

The site caches `/blog` and `/blog/[slug]`. The admin API purges those caches itself; a write made
straight to Supabase cannot, so it waits out a 60-second TTL unless you wire the webhook once:

```sql
-- Needs the pg_net extension enabled (Database → Extensions → pg_net).
update public.content_revalidation_config set
  endpoint_url = 'https://alignthespine.com/api/internal/content-revalidate',
  secret = '<same value as CONTENT_REVALIDATION_SECRET in the app environment>';
```

With it set, a direct insert or update posts the changed slug to the app and the page refreshes
within a second. Without it, nothing breaks — the post just appears up to a minute later.

## `content_items` — full column list

| Column                        | Type            | Null? | Default                                                | Notes                                                                  |
| ----------------------------- | --------------- | ----- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| `id`                          | uuid            | no    | random                                                 | PK                                                                     |
| `content_type`                | enum            | no    | —                                                      | `blog_post` \| `service_area`                                          |
| `slug`                        | citext          | no    | —                                                      | unique; used in the URL                                                |
| `title`                       | text            | no    | —                                                      | visible H1                                                             |
| `excerpt`                     | text            | no    | —                                                      | card/hub summary                                                       |
| `content_blocks`              | jsonb           | no    | `[]`                                                   | body — see Structured content below                                    |
| `status`                      | enum            | no    | `draft`                                                | `draft`, `in_review`, `approved`, `scheduled`, `published`, `archived` |
| `featured`                    | boolean         | no    | `false`                                                | shows in the large hero-card slot on `/blog`                           |
| `primary_keyword`             | text            | yes   | —                                                      | internal planning only, never rendered                                 |
| `search_intent`, `audience`   | text            | no    | `''`                                                   | internal planning only, never rendered                                 |
| `seo_title`                   | text            | no    | `''`                                                   | `<title>` tag; filled from `title` when blank                          |
| `meta_description`            | text            | no    | `''`                                                   | meta description; filled from `excerpt` when blank                     |
| `canonical_override`          | text            | yes   | —                                                      | leave null except a real exception                                     |
| `og_title`, `og_description`  | text            | yes   | —                                                      | falls back to seo_title/meta_description when null                     |
| `og_image_asset_id`           | uuid → assets   | yes   | —                                                      | falls back to featured image when null                                 |
| `featured_image_asset_id`     | uuid → assets   | yes   | —                                                      | see `assets` below                                                     |
| `featured_image_alt`          | text            | yes   | —                                                      | required unless `featured_image_decorative`                            |
| `featured_image_decorative`   | boolean         | no    | `false`                                                | true = "no image on purpose," skips the alt-text gate                  |
| `author_id`                   | uuid → authors  | no    | `dr-abe-nasser`                                        | see `authors` below; the default resolves the house author             |
| `clinician_reviewer_id`       | uuid → profiles | yes   | —                                                      | never written for a blog post (see above)                              |
| `clinician_reviewed_at`       | timestamptz     | yes   | —                                                      | never written for a blog post                                          |
| `medical_review_required`     | boolean         | no    | `false`                                                | not read at all for blog posts                                         |
| `published_at`                | timestamptz     | yes   | —                                                      | set when status → `published`                                          |
| `scheduled_for`               | timestamptz     | yes   | —                                                      | required, future, if `status = 'scheduled'`                            |
| `last_substantive_review_at`  | timestamptz     | yes   | —                                                      | last real content edit, not a build stamp                              |
| `created_by`, `updated_by`    | uuid → profiles | no    | `auth.uid()`, else the oldest active editorial account | omit them; the default resolves an actor                               |
| `noindex`                     | boolean         | no    | `false`                                                | **defaults false** — blog posts are indexable unless you say otherwise |
| `noindex_reason`              | text            | yes   | —                                                      | required if `noindex = true`                                           |
| `schema_overrides`            | jsonb           | yes   | —                                                      | rarely used, escape hatch                                              |
| `direct_answer`               | text            | no    | `''`                                                   | snippet-style answer paragraph                                         |
| `emergency_guidance_relevant` | boolean         | no    | `false`                                                | if true, an emergency-tone callout block is required                   |
| `toc_enabled`                 | boolean         | no    | `true`                                                 | table-of-contents sidebar toggle                                       |
| `series_name`                 | text            | yes   | —                                                      | unused currently                                                       |
| `service_area_evidence`       | jsonb           | yes   | —                                                      | `service_area` content type only                                       |
| `gate_result`                 | jsonb           | no    | `{passed:false,...}`                                   | latest publication-gate snapshot (see below)                           |
| `version`                     | integer         | no    | `1`                                                    | optimistic concurrency — bump on every save                            |
| `search_document`             | tsvector        | yes   | —                                                      | full-text search index, generated                                      |
| `key_takeaways`               | jsonb           | no    | `[]`                                                   | string array, bulleted list on the page                                |
| `faqs`                        | jsonb           | no    | `[]`                                                   | `{id, question, answer}[]`, accordion + FAQPage schema                 |

## Related tables

| Table                | Purpose                                          | Key columns                                                                                                                                                                      |
| -------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authors`            | Byline. One row already exists: `dr-abe-nasser`. | `slug`, `name`, `credentials`, `short_bio`, `profile_url`, `active`                                                                                                              |
| `assets`             | Uploaded/linked media metadata.                  | `url`, `provider` (`local`/`bunny_cdn`/`approved_external`), `mime_type`, `width`, `height`, `alt`, `approval_state` (`pending`/`approved`/`rejected` — only `approved` renders) |
| `categories`, `tags` | Controlled taxonomies (not free text).           | `slug`, `name`, `active`                                                                                                                                                         |
| `content_categories` | Join: content ↔ category.                        | `content_id`, `category_id`                                                                                                                                                      |
| `content_tags`       | Join: content ↔ tag.                             | `content_id`, `tag_id`                                                                                                                                                           |
| `sources`            | Citation records.                                | `title`, `publisher`, `url`, `source_type`, `accessed_date`, `verification_status` (`pending`/`verified`/`expired` — must be `verified` to publish)                              |
| `content_sources`    | Join: which source backs which claim/block.      | `content_id`, `source_id`, `block_id` (optional), `claim_supported`                                                                                                              |
| `content_relations`  | "Related articles" links.                        | `source_content_id`, `target_content_id`, `relation_type`, `sort_order`                                                                                                          |

## Structured content (`content_blocks`)

A JSON array. Each block has a stable `id` (`^[a-z0-9][a-z0-9_-]{2,63}$`, lowercase, ≥3 chars —
IDs like `"b1"` are rejected) and a `type`:

```jsonc
{ "id": "intro", "type": "paragraph", "text": "…" }
{ "id": "block-1", "type": "heading", "level": 2, "text": "What happens at your first evaluation" }
{ "id": "block-2", "type": "list", "style": "unordered", "items": ["…", "…"] }
{ "id": "block-3", "type": "quote", "text": "…", "attribution": "optional" }
{ "id": "block-4", "type": "callout", "tone": "answer" | "info" | "warning" | "emergency", "title": "…", "text": "…" }
{ "id": "block-5", "type": "image", "assetId": "<assets.id>", "alt": "…", "caption": "optional", "decorative": false }
{ "id": "block-6", "type": "table", "caption": "…", "headers": ["…"], "rows": [["…"]] }
```

Heading `level` is 2, 3, or 4 only — **never 1** (the page's own `<h1>` is the title, rendered
separately). No raw HTML, scripts, iframes, or inline event handlers — content is validated
against this closed schema before it can save.

## What blocks publication

This is the whole list. There is nothing else — no human step, no queue, no sign-off.

A `blog_post` needs:

- Valid slug, title ≥12 chars, SEO title ≥12 chars, meta description ≥70 chars
- Valid `content_blocks` (schema above) with ≥350 words total
- A real `author_id`
- A non-empty `direct_answer`
- At least one FAQ — it renders on the page and carries the FAQPage structured data
- A featured image with alt text, **or** `featured_image_decorative = true`
- The featured image hosted on `align-the-spine.b-cdn.net` — `next/image` only optimizes that
  host, and an image elsewhere throws at render instead of degrading
- If `noindex = true`, a `noindex_reason`
- Any objective claim (stats, "PIP", "coverage", "diagnosis", …) in the body requires at least one
  linked, `verified` source
- If `emergency_guidance_relevant = true`, at least one `callout` block with `tone: "emergency"`

Key-takeaway bullets are a **recommendation**, not a blocker: the summary box already renders the
required `direct_answer`, so a post without bullets is publishable, just less scannable.

The gate lives in two places that must stay identical — `evaluatePublicationGates()` in
`lib/content/publication-gates.ts` (what the admin form previews) and `public.content_gate_result()`
in `202609270002` (what actually decides). `lib/content/gate-sql-parity.test.ts` fails the build if
they drift. The SQL copy wins: it recomputes `gate_result` on every write, overwriting whatever the
app passed.

Only rows where `is_public_content()` holds — `status = 'published'`, `published_at <= now()`,
`noindex = false`, `gate_result->>'passed' = 'true'` — are publicly reachable or in the sitemap.
Draft and failing-gate rows are invisible to the public site by RLS, not just app-level filtering.

That last point is worth stating plainly: an edit that breaks the gate on a live post takes the page
out of the public index until it passes again. Check `content_publication_readiness` after a big
edit.

## Minimal example: a raw INSERT that publishes itself

`publish_blog_post()` above is the easier path, but a plain INSERT works too, and the column
defaults mean you only name what you actually know. No `status`, no `published_at`, no
`gate_result`, no `created_by` — the trigger handles all four.

```sql
insert into content_items (
  content_type, slug, title, excerpt, content_blocks, faqs,
  featured_image_asset_id, featured_image_alt
) values (
  'blog_post', 'your-new-post-slug', 'Your New Post Title',
  'One or two sentences shown on the hub — 70+ characters and it doubles as the meta description.',
  '[{"id":"intro","type":"paragraph","text":"…350+ words across all blocks…"},
    {"id":"section-one","type":"heading","level":2,"text":"First section"},
    {"id":"body-one","type":"paragraph","text":"…"}]'::jsonb,
  '[{"id":"faq-1","question":"A real question?","answer":"A real answer."}]'::jsonb,
  (select id from assets where url = 'https://align-the-spine.b-cdn.net/images/PHOTO-2026-08-17-17-38-56.jpg'),
  'Chiropractic evaluation room at Align the Spine in Deerfield Beach'
);

-- Did it go live?
select status, publicly_visible, explanation, blockers
from content_publication_readiness where slug = 'your-new-post-slug';
```

If the body makes an objective claim, the row publishes only once its citations land — so insert
the post, insert its `sources` + `content_sources`, and the trigger republishes on its own. You do
not have to touch `status` again.

Updating a post later is the same story: change the columns, and the gate re-runs. Nothing needs to
be re-approved.
