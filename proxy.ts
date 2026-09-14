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
  destination.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  // Give the root URL a concrete destination so browsers and CDNs do not have
  // to keep a rewritten response under the non-localized pathname.
  return NextResponse.redirect(destination);
}

export const config = { matcher: ["/((?!api).*)"] };
