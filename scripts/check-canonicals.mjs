#!/usr/bin/env node
/**
 * Fetches a deployed site's sitemap.xml and verifies every URL in it
 * returns 200 with no redirect. app/sitemap.ts maps 1:1 over
 * content/seo.ts's published routes, so this is equivalent to "every
 * published route's canonical resolves" without needing a TS runtime to
 * import the content registry directly — it also confirms sitemap.xml
 * itself is actually reachable on the target deploy.
 *
 * Needs a real deployed URL to run against (local dev/CI never deploys), so
 * this is a standalone script, not a CI step. Usage:
 *   npm run verify:canonicals -- https://chirobackpain.com
 */

const baseUrl = process.argv[2];

if (!baseUrl) {
  console.error("Usage: npm run verify:canonicals -- <baseUrl>");
  console.error("Example: npm run verify:canonicals -- https://chirobackpain.com");
  process.exit(1);
}

const sitemapUrl = new URL("/sitemap.xml", baseUrl).toString();

async function fetchSitemapUrls() {
  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap at ${sitemapUrl}: HTTP ${response.status}`);
  }
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  if (urls.length === 0) {
    throw new Error(`No <loc> entries found in ${sitemapUrl} — is this a valid sitemap?`);
  }
  return urls;
}

async function checkUrl(url) {
  const response = await fetch(url, { redirect: "manual" });
  if (response.status >= 300 && response.status < 400) {
    return { url, ok: false, reason: `redirected (HTTP ${response.status})` };
  }
  if (response.status !== 200) {
    return { url, ok: false, reason: `HTTP ${response.status}` };
  }
  return { url, ok: true };
}

const urls = await fetchSitemapUrls();
console.log(`Checking ${urls.length} URLs from ${sitemapUrl}...\n`);

const results = await Promise.all(urls.map(checkUrl));
const failures = results.filter((result) => !result.ok);

for (const result of results) {
  console.log(result.ok ? `  OK    ${result.url}` : `  FAIL  ${result.url} — ${result.reason}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} of ${urls.length} URL(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${urls.length} URLs OK.`);
