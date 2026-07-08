import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Gate for authenticated areas (this Next.js version's rename of
 * middleware.ts). Visitors without the og_session hint cookie — set by
 * src/lib/api/client.ts whenever a Sanctum token is stored — are sent to
 * /login with a callback so they land back where they were headed.
 *
 * The cookie is a routing hint only; the Laravel API authenticates every
 * request with the bearer token regardless.
 */
const SESSION_COOKIE = "og_session";

export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "redirect",
    request.nextUrl.pathname + request.nextUrl.search,
  );
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // /admin and /worker have no routes yet (roles live inside /dashboard),
  // but are matched so future top-level areas are protected by default.
  matcher: ["/dashboard/:path*", "/admin/:path*", "/worker/:path*"],
};
