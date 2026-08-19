import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isProduction } from "@/content/site";

/** Named `proxy.ts` per Next.js 16's rename of the middleware convention
 * (https://nextjs.org/docs/messages/middleware-to-proxy) — same request
 * lifecycle hook, new file/export name.
 *
 * Sets X-Robots-Tag at the HTTP layer outside production — defense-in-depth
 * alongside the noindex meta tag lib/seo/metadata.ts already sets on every
 * page, and app/robots.ts's env-gated robots.txt rules. The meta tag can
 * only ever cover page responses; this also reaches /_next/* asset requests
 * and anything else a page-level check can't. Uses isProduction()
 * (VERCEL_ENV), not NODE_ENV — NODE_ENV is "production" during a Vercel
 * preview build too, which would silently disable this for previews if used
 * instead. Production never receives this header. */
export function proxy(_request: NextRequest) {
  const response = NextResponse.next();
  if (!isProduction()) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: "/:path*",
};
