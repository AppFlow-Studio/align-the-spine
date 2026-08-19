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
/** Basic-auth gate for /admin/*. Fails closed: if ADMIN_DASHBOARD_PASSWORD is
 * unset the whole admin area returns 401, so the lead CRM is never exposed
 * unauthenticated. The username is ignored; only the password must match. */
function adminUnauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Align the Spine Admin", charset="UTF-8"' },
  });
}

function isAdminAuthorized(request: NextRequest): boolean {
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!expected) return false;
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;
  try {
    const decoded = atob(header.slice(6));
    const password = decoded.slice(decoded.indexOf(":") + 1);
    return password === expected;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!isAdminAuthorized(request)) return adminUnauthorized();
  }

  const response = NextResponse.next();
  if (!isProduction()) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: "/:path*",
};
