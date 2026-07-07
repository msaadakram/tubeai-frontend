import { defaultLocale, isLocale, locales, type Locale } from "./config";

export type PathLike = string;

export function getLocalePath(locale: Locale, path: PathLike): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return clean;
  }
  return `/${locale}${clean === "/" ? "" : clean}`;
}

export function stripLocale(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  for (const l of locales) {
    const prefix = `/${l}`;
    if (path === prefix) return "/";
    if (path.startsWith(`${prefix}/`)) return path.slice(prefix.length);
  }
  return path;
}

export function getPathLocale(pathname: string): Locale {
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];
  if (first && isLocale(first)) return first;
  return defaultLocale;
}

export { defaultLocale, isLocale, locales, type Locale };
