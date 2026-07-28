import { defaultLocale, isLocale, locales, type Locale } from "./config";
import { getMessages, type Messages } from "./messages";

export { locales, defaultLocale, isLocale, getMessages, type Locale, type Messages };

type Resolve<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof NonNullable<T>
  ? Resolve<NonNullable<T>[K], R>
  : never
  : P extends keyof NonNullable<T>
  ? NonNullable<T>[P]
  : never;

export function createTranslator(locale: Locale) {
  const m = getMessages(locale);
  const fallback = locale !== "en" ? getMessages("en") : null;

  function resolve(root: unknown, parts: string[]): unknown {
    let cur: unknown = root;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return undefined;
      }
    }

    // Treat empty objects from empty stubs as missing translations
    if (cur !== null && typeof cur === "object" && !Array.isArray(cur) && Object.keys(cur).length === 0) {
      return undefined;
    }

    return cur;
  }

  return function t<P extends string>(path: P): Resolve<Messages, P> {
    const parts = path.split(".");
    const result = resolve(m, parts) ?? (fallback ? resolve(fallback, parts) : undefined);
    return result as Resolve<Messages, P>;
  };
}
