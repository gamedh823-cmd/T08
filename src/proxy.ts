import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

const PROTECTED_PAGE_PREFIXES = ["/private", "/settings"];
const PROTECTED_API_PREFIXES = ["/api/private-notes", "/api/passkeys"];

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = matches(pathname, PROTECTED_API_PREFIXES);
  const isPage = matches(pathname, PROTECTED_PAGE_PREFIXES);

  if (!isApi && !isPage) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (session) return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/private",
    "/private/:path*",
    "/settings",
    "/settings/:path*",
    "/api/private-notes",
    "/api/private-notes/:path*",
    "/api/passkeys",
    "/api/passkeys/:path*",
  ],
};
