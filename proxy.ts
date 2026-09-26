import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  ) {
    return NextResponse.next();
  }

  const remembered = request.cookies.get("science-sim-locale")?.value;
  const accept = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0];
  const locale = locales.find((candidate) => candidate === remembered) ||
    locales.find((candidate) => candidate === accept) ||
    defaultLocale;

  const destination = request.nextUrl.clone();
  destination.pathname = `/${locale}${pathname}`;

  // Keep the public homepage crawlable while still serving the visitor's language.
  // Crawlers get English here, which declares "/" as its own canonical; other languages point to /{locale}.
  if (pathname === "/") return NextResponse.rewrite(destination);

  return NextResponse.redirect(destination);
}

export const config = { matcher: ["/((?!api).*)"] };
