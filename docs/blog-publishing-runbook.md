# Blog publishing runbook

Everything needed to finish rolling out self-publishing blogs and to automate publishing from
outside the app. Schema reference and payload shapes live in
[`blog-cms-supabase-reference.md`](./blog-cms-supabase-reference.md); this file is the operational
side — what to run, in what order, and how to verify it.

Project: **Align The Spine**, `qaaptlxxwfvxzgyzjhub`.

## 1. Current state of the live database

**All four migrations are applied and verified (2026-09-27).** The pipeline is live: a blog post
written through any path now publishes itself.

| File                                              | Applied via                                                                  |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `202609220001_content_medical_review_default.sql` | Supabase MCP (column default; its backfill is a no-op here — 0 content rows) |
| `202609270001_blog_writer_self_publish.sql`       | Supabase MCP                                                                 |
| `202609270002_blog_gate_autopublish.sql`          | SQL editor                                                                   |
| `202609270003_blog_direct_upload.sql`             | SQL editor                                                                   |

Confirmed present afterwards: 11/11 functions, 5/5 triggers, the
`content_publication_readiness` view, the `content_revalidation_config` table, `noindex` and
`medical_review_required` defaulting to `false`, a default on `created_by`, and both
`default_editorial_actor()` and `default_content_author()` resolving to a real row.

`supabase/tests/blog_autopublish_assertions.sql` then returned `assertions_passed` against this
database, and left it with 0 content rows, 0 assets, 0 sources, and 0 publication events — the
suite rolls everything back.

Because two migrations were applied through the MCP and two through the SQL editor, the recorded
versions in `supabase_migrations.schema_migrations` do not match the filenames. A later
`supabase db push` will therefore try to re-apply all four. That is safe: every statement is
idempotent (`create or replace`, `drop ... if exists`, `create table if not exists`, and two
`update` statements that match nothing twice).

## 2. Applying to another environment

Order matters — `202609270003` calls functions that `202609270002` defines.

**SQL editor.** Paste each file whole and run, in filename order. Supabase will warn that the query
"includes destructive operations"; that is its generic DDL heuristic firing on the
`drop trigger if exists` / `drop policy if exists` statements each migration uses to replace its own
objects.

**Supabase CLI.** Not installed on the maintainer's machine; `npm i -g supabase` first.

```bash
supabase link --project-ref qaaptlxxwfvxzgyzjhub
supabase db push
```

## 3. Verify

Run `supabase/tests/blog_autopublish_assertions.sql` in the SQL editor. It creates real posts,
exercises every rule, and rolls the whole thing back, so it is safe to run against a database with
live content.

This suite is worth running after any change to the gate. It has already caught one real bug: every
`blockers := blockers || '…'` append resolved to `anyarray || anyarray` and failed at runtime with
`malformed array literal`, because an untyped string literal next to a `text[]` is ambiguous in
Postgres. The fix is the `::text` cast on each append. Nothing in the TypeScript test suite could
have caught that — it only exists in SQL.

A single `assertions_passed` row means the pipeline works end to end:

- a complete post inserted directly auto-publishes and becomes publicly visible
- `seo_title`, `meta_description`, and `direct_answer` fill in from the writer's own fields
- a thin post stays draft and names its blockers
- attaching a verified source releases a post blocked on citations
- `noindex` and an off-CDN hero image each hold a post back
- `publish_blog_post()` creates, links taxonomy, and is idempotent on slug
- `service_area` rows are untouched by any of it

Any failure raises with a `FAIL <n><letter>` tag naming the exact behavior that broke.

## 4. Turn on instant cache invalidation (optional)

Without this, a post written straight to Supabase appears on the site within 60 seconds (the page
cache TTL in `lib/content/public-content.ts`). With it, the site updates immediately.

`pg_net` is **already enabled** on `qaaptlxxwfvxzgyzjhub`, and the exact call
`content_notify_revalidation()` makes — `net.http_post(url => …, headers => …, body => …)` — was
smoke-tested there inside a rolled-back transaction, so the only thing left is the secret:

1. ~~Enable `pg_net`~~ — done.
2. Generate a secret and set it in Vercel as `CONTENT_REVALIDATION_SECRET` (all environments).
   Generate it yourself rather than reusing anything that has appeared in a chat or a log:
   `openssl rand -base64 32`.
3. Point the database at the deployed endpoint, using that same value:

```sql
update public.content_revalidation_config set
  endpoint_url = 'https://www.chirobackpain.com/api/internal/content-revalidate',
  secret       = '<the same value as CONTENT_REVALIDATION_SECRET>',
  enabled      = true;
```

Check it end to end by editing any published post and watching the page update without a redeploy.
If it silently does nothing, the trigger swallowed a failure on purpose — a revalidation that
cannot go out must never cost you the post. Look at `net._http_response` for the delivery record.

## 5. Automating publication

`publish_blog_post()` is exposed over PostgREST, so anything that can make an HTTP request can
publish a post. It is the same function the admin **New post** form calls, so an automated pipeline
and a human writer produce identical rows.

**Auth.** Use the service-role key from a server, a scheduler, or a CI job — never from a browser.
An end-user JWT also works if that user has an active `profiles` row with role `admin`, `editor`,
or `clinician_reviewer`.

```bash
curl -X POST 'https://qaaptlxxwfvxzgyzjhub.supabase.co/rest/v1/rpc/publish_blog_post' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "payload": {
      "slug": "five-questions-before-a-chiropractic-evaluation",
      "title": "Five questions to ask before a chiropractic evaluation",
      "excerpt": "What to ask at a first visit, why each answer matters, and which answers should make you pause.",
      "markdown": "Opening paragraph...\n\n## What to ask first\n\n- How long have you treated this?\n- What changes if it does not improve?",
      "imageUrl": "https://align-the-spine.b-cdn.net/images/PHOTO-2026-08-17-17-38-56.jpg",
      "imageAlt": "Chiropractic evaluation room at Align the Spine in Deerfield Beach",
      "faqs": [{ "question": "How long is a first visit?", "answer": "Plan for about an hour." }],
      "categories": ["patient-education"]
    }
  }'
```

The response is the same object the SQL editor returns:

```json
{
  "id": "…",
  "slug": "five-questions-before-a-chiropractic-evaluation",
  "status": "published",
  "publiclyVisible": true,
  "url": "/blog/five-questions-before-a-chiropractic-evaluation",
  "gate": { "passed": true, "blockers": [], "recommendations": [], "checkedAt": "…" }
}
```

**Build the automation around `publiclyVisible`, not around HTTP 200.** A 200 with
`publiclyVisible: false` means the post was saved but is not live, and `gate.blockers` says exactly
what is missing. A generator that ignores that field will quietly accumulate unpublished drafts.

```ts
const { data, error } = await supabase.rpc("publish_blog_post", { payload });
if (error) throw error;
if (!data.publiclyVisible) {
  throw new Error(`"${data.slug}" saved but not live: ${data.gate.blockers.join(" ")}`);
}
```

**A generator has to supply five things** the gate will not invent: 350+ words of body, an excerpt
of 70+ characters, at least one FAQ, a hero image on `align-the-spine.b-cdn.net` with real alt
text, and a verified source for any objective claim (statute, statistic, coverage, diagnosis,
treatment wording — the full list is in the reference doc). Everything else has a sensible default.

**Scheduling ahead.** Pass `"scheduledFor": "2026-10-04T13:00:00Z"` and the post lands in
`scheduled` instead of `published`. `/api/cron/publish-scheduled` releases it: a Vercel Cron
(`vercel.json`, every 15 minutes) that finds blog posts whose time has passed and touches them so
the trigger re-evaluates. It needs `CRON_SECRET` set in Vercel — Vercel sends it automatically on
cron-triggered requests — and `CONTENT_REPOSITORY_MODE=supabase`; in fixture mode it no-ops instead
of alerting.

The gate still decides. A post that went thin or lost a source between being scheduled and its date
arriving stays unpublished with its blockers intact, and comes back in the response's `stillHeld`
list rather than being forced live.

**Auditing a run.**

```sql
-- What did the automation publish today?
select slug, status, published_at from public.content_publication_readiness
where published_at > now() - interval '1 day' order by published_at desc;

-- Anything saved but stuck?
select slug, explanation, blockers from public.content_publication_readiness
where not publicly_visible and status <> 'archived';
```

## 6. Accounts

`profiles` currently holds one active row: **Israel (AppFlow Studio)**, role `editor`. That account
can now write and publish blog posts on its own — before this work it could do neither, since
approval required `clinician_reviewer` or `admin` and publishing required `admin`.

Add writers as `editor`. Reserve `admin` for whoever also needs to schedule, publish, or archive
**service-area** pages, which keep the older review chain.

`default_editorial_actor()` attributes SQL-editor and service-role writes to the longest-standing
active editorial account, preferring an admin and falling back to an editor — which is why direct
inserts work today with no admin in the table.
