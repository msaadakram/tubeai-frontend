import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales, LOCALE_COOKIE } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|webmanifest|woff|woff2|ttf|eot|mp4|mp3|pdf|zip)$/i;
const INTERNAL = ["_next", "api", "favicon.ico"];

function pickLocale(accept: string | null): string | null {
  if (!accept) return null;
  const entries = accept
    .split(",")
    .map((p) => {
      const [tag, q] = p.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const e of entries) {
    const lang = e.tag.split("-")[0];
    if (isLocale(lang)) return lang;
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_FILE.test(pathname)) return NextResponse.next();
  if (INTERNAL.some((p) => pathname === `/${p}` || pathname.startsWith(`/${p}/`))) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Already prefixed with a valid locale → keep going (but re-validate cookie for default)
  if (first && isLocale(first)) {
    return NextResponse.next();
  }

  // No locale prefix — decide one and redirect
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const chosen = (cookie && isLocale(cookie) ? cookie : pickLocale(request.headers.get("accept-language"))) || defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${chosen}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.redirect(url, 308);
  if (!(cookie && isLocale(cookie))) {
    res.cookies.set(LOCALE_COOKIE, chosen, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};

export { defaultLocale, locales };
