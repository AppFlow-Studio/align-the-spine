# Content platform plan

Status: Milestones 0-1 and the preview-ready public foundation are complete; production remains disconnected  
Last updated: 2026-08-16  
Owner: Align the Spine content platform team

## Operating constraints

- This is an editorial CMS, not a patient CRM. It must never store patient names, contact details, diagnoses, accident narratives, claim numbers, treatment records, or appointment details.
- The only verified office is 811 SE 8th Ave, Ste 101, Deerfield Beach, FL 33441.
- Home visits may only be described as a limited option for eligible car-accident/PIP circumstances, subject to case and location confirmation.
- Hours, canonical domain, non-office service areas, pricing, insurance/PIP handling, reviews, credentials, and clinical claims fail closed until explicitly verified.
- No production database mutation, deployment, merge, DNS/domain change, indexing, or publication is authorized by this plan.
- Privileged Supabase keys shared in chat must be rotated before use. They are not stored in this repository.

## Audit findings

Labels: **Verified** = directly observed; **Inferred** = supported but not authoritative; **Needs confirmation** = business fact required; **Recommendation** = proposed decision.

| Finding                                                                                                                                                                                                                                                          | Evidence/file                                                                                                                    | Impact                                                                                                                                                                        | Decision                                                                                                                                                                   | Priority |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Verified:** the working branch is `seo-foundation-phase-1`, 17 commits ahead of the local `main`; `.claude/` is unrelated and untracked.                                                                                                                       | `git branch -vv`; `git status --short`                                                                                           | Starting from local `main` would discard significant existing work.                                                                                                           | Continue on the current branch and preserve `.claude/`.                                                                                                                    | P0       |
| **Verified:** `chirobackpain.com` currently serves a generic “Chiropractic Back Pain” GoDaddy site, while `alignthespinechiropractic.com` serves the actual practice/NAP. Both are live; the former self-canonicalizes and the legacy homepage has no canonical. | Live render on 2026-08-16; `.env.example`; `content/site.ts`                                                                     | The repository fallback can emit entity-wide canonicals and schema IDs for a domain that does not currently represent the practice. Two live sites split trust and authority. | Hard-gate indexing and production `SITE_URL`. Recommend the branded domain unless the owner confirms a migration constraint. Do not change DNS/redirects without approval. | P0       |
| **Verified:** public hours conflict. Code creates 7 AM–11 PM daily and marks it verified; its comment says 9 AM–7 PM; the legacy homepage shows Tuesday 9–7 and other days by appointment.                                                                       | `content/site.ts`; legacy homepage                                                                                               | Misleading public information and invalid local schema.                                                                                                                       | Set hours to unverified and omit them from UI/schema until owner/GBP evidence resolves the conflict.                                                                       | P0       |
| **Verified:** six service areas are marked unverified, but current schema emits them all in `areaServed`; `/reviews` also names unverified cities.                                                                                                               | `content/site.ts`; `lib/schema.ts`; `app/reviews/page.tsx`                                                                       | Unsupported local claims and doorway/entity risk.                                                                                                                             | Suppress all unverified `areaServed`; publish only Deerfield Beach office truth until evidence gates pass.                                                                 | P0       |
| **Verified:** there is no database, CMS, auth, storage, preview, webhook, Markdown/MDX, or admin implementation.                                                                                                                                                 | repository search                                                                                                                | New platform foundation is required.                                                                                                                                          | Use Supabase Postgres + Auth behind a vendor-neutral repository interface; keep a deterministic fixture adapter for local/test/build.                                      | P0       |
| **Verified:** the static route registry, metadata helper, non-production noindex/X-Robots gate, sitemap parity tests, verified-value type, and JSON-LD serializer are sound foundations.                                                                         | `content/seo.ts`; `lib/seo/metadata.ts`; `proxy.ts`; `app/sitemap.ts`; `content/verified-value.ts`; `components/seo/json-ld.tsx` | Replacing them would create duplicate sources of truth.                                                                                                                       | Extend them with dynamic-content providers and keep fail-closed publication rules.                                                                                         | P1       |
| **Verified:** medical condition/service routes are already draft/noindex pending clinical review.                                                                                                                                                                | `content/seo.ts`; `app/sitemap.test.ts`                                                                                          | Strong safety baseline.                                                                                                                                                       | Preserve and apply the same status/reviewer model to database content.                                                                                                     | P1       |
| **Verified:** GA4, Google Ads, optional enhanced conversions, and unrestricted GTM can load globally; lead forms can include accident date/free text.                                                                                                            | `components/analytics/*`; `lib/analytics.ts`; `app/api/lead/route.ts`                                                            | Health-context and form data may be disclosed or logged; CMS draft values must never enter analytics.                                                                         | Exclude `/admin` and previews from analytics, prohibit draft/editor values from dataLayer, and require privacy/legal review before enabling tags or enhanced conversions.  | P1       |
| **Verified:** the lead API logs full form payloads when Resend is not configured.                                                                                                                                                                                | `app/api/lead/route.ts`                                                                                                          | Sensitive user-provided health/accident context can enter logs.                                                                                                               | Remove payload logging before production; log only opaque event IDs/status. Editorial data remains completely separate.                                                    | P1       |
| **Verified:** current content uses Fraunces/Poppins/Geist, navy/teal tokens, 1568px containers, pill controls, large rounded cards, server-rendered heroes, `FadeIn`/stagger primitives, and reduced-motion CSS.                                                 | `app/globals.css`; `tailwind.config.ts`; `components/ui/*`; `components/sections/*`                                              | New surfaces can match the existing brand with minimal duplication.                                                                                                           | Reuse tokens and primitives; admin uses the palette lightly and prioritizes clarity.                                                                                       | P2       |
| **Verified:** several source PNGs are 5–9 MB; some `fill` images lack accurate `sizes`.                                                                                                                                                                          | `public/figma-exports`; image call sites                                                                                         | Costly image optimization and possible LCP regression.                                                                                                                        | Inventory/reuse assets, but create optimized derivatives before launch and require dimensions/focal metadata in the asset model.                                           | P1       |
| **Verified:** current pages are server rendered, but 28 client components and reveal components starting at opacity 0 can make no-JS content visually absent.                                                                                                    | `components/ui/fade-in.tsx`; client-boundary inventory                                                                           | Indexable HTML is present, but resilience/INP can regress.                                                                                                                    | Keep public content server-first and ensure core copy is visible without client execution.                                                                                 | P2       |
| **Verified:** several PIP phrases say an evaluation “protects” benefits.                                                                                                                                                                                         | `lib/pip-window.ts`; adjustments page                                                                                            | Implies a legal/coverage outcome.                                                                                                                                             | Replace with neutral, sourced timing/eligibility language during hardening.                                                                                                | P1       |
| **Needs confirmation:** the Supabase project exists, but no safe production connection or editor accounts are authorized. Privileged credentials were disclosed in chat.                                                                                         | user-provided project details                                                                                                    | Connecting before rotation could compromise the database and would exceed production-write authorization.                                                                     | Build migrations/types/adapters locally; connect only after rotation, environment setup, migration review, and explicit approval.                                          | P0       |

## Selected architecture

Use Supabase Postgres + Auth because no provider exists and it fits the installed Next.js/Vercel stack. The public and admin UIs depend only on `ContentRepository`; Supabase is one adapter, while the fixture adapter makes local development, tests, previews, and builds deterministic and prevents accidental live access.

- Public pages are React Server Components and query the repository directly, never through an internal HTTP round trip.
- The content body is validated portable JSON blocks. Supported blocks are paragraph, heading (H2–H4 only), list, quote, callout, image, table, and source-linked note. Raw HTML, scripts, iframes, inline event handlers, and editor-created H1s are not representable.
- Admin mutations are authenticated Server Actions/Route Handlers that repeat server-side authorization, schema validation, transition validation, concurrency checks, and publication gates.
- Supabase browser access uses only the publishable key and RLS. Secret/service-role access is server-only and reserved for migration/administrative operations; normal editorial actions run as the authenticated user so RLS remains effective.
- Scheduled publication uses a protected idempotent endpoint invoked by Vercel Cron or Supabase Cron only after separate production approval. Until then, scheduled records remain non-public.

## Data model and relationships

```text
auth.users 1---1 profiles
profiles 1---* content_items (created_by / updated_by)
authors  1---* content_items
profiles 1---* content_items (clinician_reviewer_id)
content_items 1---* content_revisions
content_items 1---* publication_events
content_items *---* categories (content_categories)
content_items *---* tags (content_tags)
content_items *---* sources (content_sources, block_id + supported_claim)
content_items *---* assets (featured/OG/body relations)
content_items *---* content_items (content_relations: article/service/condition/area)
content_items 1---* redirects
```

`content_items` contains the shared fields from the brief plus a validated `content_blocks` JSONB document, blog configuration JSONB, service-area evidence JSONB, `version`, and a database-enforced status enum. Separate normalized tables hold taxonomies, sources, assets, relations, revisions, redirects, and audit events. Database constraints prevent case-variant slugs, invalid publish times, `noindex` without a reason, self-relations, and duplicate joins.

## Public route map

| Route                   | Source                                 | Index rule                                                            |
| ----------------------- | -------------------------------------- | --------------------------------------------------------------------- |
| `/blog`                 | published blog query                   | index only on approved production canonical                           |
| `/blog/page/[page]`     | published blog query                   | index for real pages; canonical self; invalid pages 404               |
| `/blog/[slug]`          | public-by-slug query                   | published, past `published_at`, gate snapshot passed, indexable       |
| `/blog/category/[slug]` | taxonomy query                         | only active, non-orphaned categories with published items             |
| `/blog/tag/[slug]`      | taxonomy query                         | noindex initially; promote deliberately after uniqueness/value review |
| `/feed.xml`             | published blog query                   | feed only; never draft/scheduled-future                               |
| `/service-areas`        | published area query plus office truth | index on approved production canonical                                |
| `/service-areas/[slug]` | public-by-slug query                   | same public gates plus operational/uniqueness evidence                |
| `/authors/[slug]`       | active author with published work      | index only when bio/credentials are verified and useful               |
| `/preview/[token]`      | signed short-lived token               | noindex, nofollow; never sitemap/feed/analytics                       |

## Protected admin route map

- `/admin/login` — email/password or magic-link sign-in; no public registration.
- `/admin/content` — dashboard and filterable list.
- `/admin/content/new` — choose blog post or service-area draft.
- `/admin/content/[id]` — editor, evidence, sources, assets, relations, status and concurrency.
- `/admin/content/[id]/preview` — authenticated preview with width controls.
- `/admin/content/[id]/revisions` — immutable history and rollback action.
- `/admin/authors`, `/admin/taxonomies`, `/admin/assets`, `/admin/sources` — supporting records.

Every admin layout and mutation re-checks authentication and active role server-side. Proxy is defense-in-depth only. Admin/preview routes send `noindex, nofollow`, are excluded from public navigation/sitemap/feed, and do not mount public analytics.

## Publish and revalidation flow

```text
Editor mutation
  -> authenticate + authorize role
  -> validate Zod payload + expected version
  -> validate legal transition + publication gates
  -> transaction: immutable revision + item/status + audit event
  -> commit
  -> invalidate content tags and affected paths
  -> append revalidation result to publication event
  -> UI reports success or retryable revalidation failure
```

Next.js 16.3.1 is installed without Cache Components enabled. The implementation follows the bundled 16.3.1 previous-model caching guidance: database reads use `unstable_cache` with content-type and slug tags, while authorized Route Handlers use `revalidateTag(tag, "max")` plus targeted `revalidatePath` calls for hubs, sitemap, feed, and the changed canonical path. Never mark publication failed after the database transaction committed; instead record a retryable `revalidation_failed` result.

Affected tags: item ID, slug, content type, author, taxonomy IDs, related item IDs, sitemap, feed, and published collections. A slug change creates a redirect record transactionally and invalidates both old and new paths.

## Security and privacy threat model

| Threat                         | Control                                                                                                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Draft leakage                  | Public SQL/RLS policy and repository query require `published`, past publish time, and passing gate snapshot; public DTO excludes editorial fields.                               |
| Privilege escalation           | No self-registration; active profile and role checked server-side on every mutation; role-changing RPC admin-only; RLS on every exposed table.                                    |
| Service-key exposure           | Never `NEXT_PUBLIC`; never logged/committed; rotated before use; normal requests do not use it.                                                                                   |
| CSRF                           | SameSite secure auth cookies, origin validation on mutation endpoints, Server Actions' built-in origin checks, and signed webhook secret with replay window.                      |
| Brute force/abuse              | Supabase Auth limits plus application rate limiting on login, preview-token, webhook, and mutation endpoints.                                                                     |
| XSS/content injection          | Closed structured-block union, text-only fields, URL allowlists, server-side Zod validation, safe React rendering, JSON-LD `<`/`>` escaping, no raw HTML.                         |
| Broken object authorization    | Fetch and mutate through actor-scoped repository methods/RLS; never trust IDs/roles from the browser.                                                                             |
| Lost updates                   | Integer `version`; update requires expected version; return conflict with latest version and preserve editor input.                                                               |
| Audit tampering                | Revisions/events append-only to editors; rollback creates a new revision; admins cannot silently rewrite history through the app.                                                 |
| PHI/consumer-health disclosure | Editorial schema has no patient fields; admin/preview analytics disabled; public analytics cannot receive form values, URL search text, content-block text, or health selections. |
| Database outage                | Public route returns 404 only for authoritative absence; adapter failures render a branded 503/error state and never fall back to drafts or claims.                               |

## SEO/indexing state machine

```text
draft -> in_review -> approved -> scheduled -> published -> archived
                    \------------> published
in_review -> draft
approved  -> draft
scheduled -> approved
published -> archived
archived  -> draft (restore as draft, never silently republish)
```

Public eligibility requires all of: production environment, approved canonical domain, `published`, `published_at <= now`, `noindex = false`, valid canonical, and the latest publication-gate snapshot passing. Preview always sends noindex/nofollow. Archived/missing records return a real 404 unless an active redirect exists. Service-area publication additionally requires operational evidence, relationship classification, unique local purpose/sections, similarity threshold, source traceability, office-truth copy, and home-visit verification whenever mentioned.

## Accessibility test plan

- Automated: eslint, semantic/unit assertions, axe browser tests for hubs, articles, area pages, admin list/editor/preview, error/empty/loading states.
- Keyboard: skip link, nav/drawer, filters, pagination, TOC, editor controls, dialogs, source/asset selectors, publish confirmation, focus restoration, no traps.
- Screen-reader oriented: landmarks/headings, form names/instructions/errors, table captions/headers, breadcrumb, status and toast live regions, preview labels.
- Responsive/reflow: 320, 375, 768, 1024, and 1440 CSS px; 200% and 400% zoom; no horizontal overflow except scrollable data tables.
- Motion: reduced-motion disables reveals, smooth scrolling, persistent animation, and media autoplay; content remains visible without JavaScript.
- WCAG 2.2 AA is the target, not a claim of legal certification.

## Migration and seed strategy

1. Review SQL locally and run policy assertions against a disposable/local Supabase instance.
2. Rotate disclosed privileged keys.
3. With explicit approval, link the CLI to the named project and apply migrations once to a non-production/staging project first.
4. Provision initial users administratively; no self-registration.
5. Import approved local/Bunny assets as metadata only.
6. Load development fixtures only through the fixture adapter. Database seed files create drafts/noindex and never clinician approval.
7. Verify anonymous, editor, clinician, and admin policies before enabling admin access.
8. Production migration requires a database backup and a reviewed rollback window.

## Milestones

- [x] Milestone 0: inspect repo, current branches, domains, framework guidance, SEO/content risks, visual system, and provider absence.
- [x] Milestone 0: select local architecture and define hard approval gates.
- [x] Milestone 1: migrations, RLS, types, repository, state machine, sanitizer/block validation, audit/revisions, fixtures, and local tests. Applying migrations and SQL assertions remains an approval-gated staging step.
- [ ] Milestone 2: protected dashboard, list, editor autosave, source display, blocker checklist, and responsive preview are implemented. New-item creation, asset/source management, scheduling, revision rollback, and clinician-review controls still require production-grade UI completion.
- [ ] Milestone 3: blog hub/article/feed/metadata/schema/sitemap and crawlable query filters are implemented. Dedicated taxonomy landing pages and an approved published article remain gated.
- [x] Milestone 4: evidence-gated service-area hub/page templates, office truth, and evidence matrix are implemented. All database service-area fixtures remain draft/noindex.
- [ ] Milestone 5: tagged revalidation, RLS assertions, XSS/public-query tests, privacy fixes, and regression checks are implemented. Connected-database, axe/E2E, performance, canonical-preview, and crawl validation remain.
- [ ] Milestone 6: local preview handoff is documented; preview deployment and every production action require explicit approval.

## Required environment variables

Names only; never commit values.

- `SITE_URL` — required production canonical; currently unresolved.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` — server-only, optional for explicitly approved administrative jobs; never used in browser code.
- `CONTENT_REPOSITORY_MODE` — `fixture` for local/test by default, `supabase` only when explicitly configured.
- `CONTENT_REVALIDATION_SECRET` — high-entropy webhook secret.
- `CONTENT_PREVIEW_SIGNING_SECRET` — high-entropy preview-token secret.
- `CRON_SECRET` — scheduler endpoint secret if scheduling is activated.
- Existing analytics/lead variables remain documented in `.env.example`; admin and preview code must ignore them.

## Rollback strategy

- Code: revert the content-platform commit(s) or redeploy the last known-good deployment; dynamic routes disappear and static registry behavior remains.
- Database: migrations are additive first. Disable the application adapter (`CONTENT_REPOSITORY_MODE=fixture` or maintenance mode), restore the pre-migration backup for destructive rollback, or apply the reviewed down migration in staging first.
- Content: archive/unpublish through a new revision; do not delete history. Slug rollback creates/updates redirects.
- Cache: invalidate the affected item/collection/sitemap/feed tags after rollback.
- Domain: DNS/redirect changes are outside this implementation. Roll them back at the provider only under a separately approved change plan.

## Unresolved facts and approval gates

1. Canonical domain and mapped redirect policy between the two live domains.
2. Exact office hours and authoritative source.
3. Rotated Supabase privileged credentials, target environment, database connection, and migration approval.
4. Dr. Abe's exact credentials, Florida license display, bio claims, languages, and clinician-review process.
5. In-office catchment evidence and home-visit eligibility/radius/hours/geography/availability/pricing/payer rules.
6. Insurance/PIP handling claims and compliance-approved wording.
7. Review count/rating/provenance and allowed excerpts.
8. Search Console/Keyword Planner access and first-party patient-origin evidence.
9. Public analytics consent/health-context policy and Enhanced Conversions authorization.
10. Production migration, deploy, redirect, indexing, and content-publishing approvals.
