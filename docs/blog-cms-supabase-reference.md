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

## The one function you actually need: `save_content_draft`

Rather than writing to `content_items` directly, call this Postgres RPC — it handles optimistic
concurrency (via `version`), snapshots the previous version into `content_revisions`, and (as of
the latest migration) creates/links the featured-image asset row for you from a plain URL.

```
select * from save_content_draft(
  target_id      := '<content_items.id>',
  expected_version := <current version integer>,
  patch          := '<jsonb, see shape below>',
  change_note    := 'Editorial autosave',
  next_gate_result := '<jsonb, see evaluatePublicationGates equivalent below>'
);
```

`patch` accepts (all optional except noted): `title`, `excerpt`, `directAnswer`, `keyTakeaways`
(string array), `faqs` (`{id, question, answer}[]`), `blocks` (see Structured content below),
`seoTitle`, `metaDescription`, `ogTitle`, `ogDescription`, `featuredImageUrl` (must start with
`https://` — leave unset to keep the current image), `featuredImageAlt`, `featured` (boolean),
`noindex` (boolean — requires `noindexReason` if true), `noindexReason`.

**Clinician-review gate removed (2026-08-18):** `clinician_reviewer_id`/`clinician_reviewed_at`
columns still exist on `content_items` for future use, but nothing in this codebase requires them
before publish anymore. Don't build a reviewer-assignment step unless you want one for your own
workflow — the shared publication logic doesn't need it.

If your new CMS project doesn't want to depend on this app's RPC at all, it's fine to write
directly to `content_items` with the service role key instead (below is the full column list) —
`save_content_draft` is a convenience, not a requirement.

## `content_items` — full column list

| Column                        | Type            | Null? | Default              | Notes                                                                  |
| ----------------------------- | --------------- | ----- | -------------------- | ---------------------------------------------------------------------- |
| `id`                          | uuid            | no    | random               | PK                                                                     |
| `content_type`                | enum            | no    | —                    | `blog_post` \| `service_area`                                          |
| `slug`                        | citext          | no    | —                    | unique; used in the URL                                                |
| `title`                       | text            | no    | —                    | visible H1                                                             |
| `excerpt`                     | text            | no    | —                    | card/hub summary                                                       |
| `content_blocks`              | jsonb           | no    | `[]`                 | body — see Structured content below                                    |
| `status`                      | enum            | no    | `draft`              | `draft`, `in_review`, `approved`, `scheduled`, `published`, `archived` |
| `featured`                    | boolean         | no    | `false`              | shows in the large hero-card slot on `/blog`                           |
| `primary_keyword`             | text            | yes   | —                    | internal planning only, never rendered                                 |
| `search_intent`, `audience`   | text            | no    | —                    | internal planning only, never rendered                                 |
| `seo_title`                   | text            | no    | —                    | `<title>` tag                                                          |
| `meta_description`            | text            | no    | —                    | meta description                                                       |
| `canonical_override`          | text            | yes   | —                    | leave null except a real exception                                     |
| `og_title`, `og_description`  | text            | yes   | —                    | falls back to seo_title/meta_description when null                     |
| `og_image_asset_id`           | uuid → assets   | yes   | —                    | falls back to featured image when null                                 |
| `featured_image_asset_id`     | uuid → assets   | yes   | —                    | see `assets` below                                                     |
| `featured_image_alt`          | text            | yes   | —                    | required unless `featured_image_decorative`                            |
| `featured_image_decorative`   | boolean         | no    | `false`              | true = "no image on purpose," skips the alt-text gate                  |
| `author_id`                   | uuid → authors  | no    | —                    | see `authors` below                                                    |
| `clinician_reviewer_id`       | uuid → profiles | yes   | —                    | no longer gates publish (see above)                                    |
| `clinician_reviewed_at`       | timestamptz     | yes   | —                    | no longer gates publish                                                |
| `medical_review_required`     | boolean         | no    | `true`               | informational only now, not enforced                                   |
| `published_at`                | timestamptz     | yes   | —                    | set when status → `published`                                          |
| `scheduled_for`               | timestamptz     | yes   | —                    | required, future, if `status = 'scheduled'`                            |
| `last_substantive_review_at`  | timestamptz     | yes   | —                    | last real content edit, not a build stamp                              |
| `created_by`, `updated_by`    | uuid → profiles | no    | —                    |                                                                        |
| `noindex`                     | boolean         | no    | `true`               | **defaults true** — must be explicitly set false to be indexable       |
| `noindex_reason`              | text            | yes   | —                    | required if `noindex = true`                                           |
| `schema_overrides`            | jsonb           | yes   | —                    | rarely used, escape hatch                                              |
| `direct_answer`               | text            | no    | `''`                 | snippet-style answer paragraph                                         |
| `emergency_guidance_relevant` | boolean         | no    | `false`              | if true, an emergency-tone callout block is required                   |
| `toc_enabled`                 | boolean         | no    | `true`               | table-of-contents sidebar toggle                                       |
| `series_name`                 | text            | yes   | —                    | unused currently                                                       |
| `service_area_evidence`       | jsonb           | yes   | —                    | `service_area` content type only                                       |
| `gate_result`                 | jsonb           | no    | `{passed:false,...}` | latest publication-gate snapshot (see below)                           |
| `version`                     | integer         | no    | `1`                  | optimistic concurrency — bump on every save                            |
| `search_document`             | tsvector        | yes   | —                    | full-text search index, generated                                      |
| `key_takeaways`               | jsonb           | no    | `[]`                 | string array, bulleted list on the page                                |
| `faqs`                        | jsonb           | no    | `[]`                 | `{id, question, answer}[]`, accordion + FAQPage schema                 |

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

## What blocks publication (`evaluatePublicationGates`, mirrored by `gate_result`)

A `blog_post` needs, at minimum:

- Valid slug, title ≥12 chars, SEO title ≥12 chars, meta description ≥70 chars
- Valid `content_blocks` (schema above) with ≥350 words total
- A real `author_id`
- A non-empty `direct_answer`
- At least one `key_takeaways` bullet and at least one FAQ
- A featured image with alt text, **or** `featured_image_decorative = true`
- If `noindex = true`, a `noindex_reason`
- Any objective claim (stats, "PIP," "coverage," "diagnosis," etc.) in the body requires at
  least one linked, `verified` source
- If `emergency_guidance_relevant = true`, at least one `callout` block with `tone: "emergency"`

Only rows where `public_content_items`'s underlying predicate holds — `status = 'published'`,
`published_at <= now()`, `noindex = false`, and `gate_result->>'passed' = 'true'` — are ever
publicly reachable or in the sitemap. Draft/failing-gate rows are invisible to the public site by
RLS, not just app-level filtering.

## Minimal example: inserting one new draft post

```sql
insert into content_items (
  content_type, slug, title, excerpt, content_blocks, status,
  seo_title, meta_description, author_id, direct_answer,
  key_takeaways, faqs, search_intent, audience, created_by, updated_by
) values (
  'blog_post', 'your-new-post-slug', 'Your New Post Title',
  'One or two sentence summary shown on the hub.',
  '[{"id":"block-1","type":"heading","level":2,"text":"First section"},
    {"id":"block-2","type":"paragraph","text":"…body…"}]'::jsonb,
  'draft',
  'Your New Post Title | Align the Spine',
  'A meta description between 70 and roughly 155-160 characters.',
  'a3c2e825-c7cd-4362-a7c4-1eba3e505fdd', -- dr-abe-nasser
  'The direct-answer snippet paragraph.',
  '["Bullet one.", "Bullet two."]'::jsonb,
  '[{"id":"faq-1","question":"…?","answer":"…"}]'::jsonb,
  'informational', 'general public',
  '<your service-role/admin actor uuid>', '<same>'
);
```

Then run it through `evaluatePublicationGates`-equivalent logic (or just fix the checklist above
by eye) and flip `status` to `published` with a real `published_at` and `noindex = false` once
it's ready.
