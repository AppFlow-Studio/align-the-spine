# Content platform verification

Last updated: 2026-08-16

## Commands

| Command                                           | Result                                                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm install @supabase/ssr @supabase/supabase-js` | Passed. Supabase server-session and repository adapters installed.                                          |
| `npm audit --json`                                | Passed: 0 known vulnerabilities across 543 dependencies.                                                    |
| `npm run format:check`                            | Passed: all matched files use Prettier formatting.                                                          |
| `npm run lint`                                    | Passed with 0 errors and 10 pre-existing unused-variable warnings outside the new content-platform modules. |
| `npm run typecheck`                               | Passed: `tsc --noEmit`.                                                                                     |
| `npm test`                                        | Passed: 22 files, 158 tests.                                                                                |
| `npm run build`                                   | Passed on Next.js 16.3.1; 31 static pages generated and all dynamic content/admin handlers compiled.        |

## Pending release checks

- `npm run verify:canonicals -- <approved preview origin>`
- Axe/Playwright E2E workflow after an approved staging Supabase instance and authenticated editor are active.
- SQL/RLS assertions against a disposable/local Supabase instance.
- Google Rich Results/schema validation on an approved preview.
- Link/crawl audit and performance budgets on deployed preview.

## Visual inspection completed

Browser inspection covered `/blog`, `/service-areas`, `/admin/content`, an editor, and draft preview at 375, 768, 1024, and 1440 CSS pixels. The checks found one H1/main landmark, no nested interactive controls, no page-level horizontal overflow, readable mobile ordering, admin/public-shell separation, and draft `noindex`. The admin table intentionally uses a contained horizontal scroll region at narrow widths. Keyboard and reduced-motion behavior were spot-checked through the existing focus and motion primitives; a formal axe/screen-reader certification was not performed.

No production connection, migration, deploy, merge, DNS change, indexing, or publication occurred.
