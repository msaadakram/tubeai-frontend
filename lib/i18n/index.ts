import { defaultLocale, isLocale, locales, type Locale } from "./config";
import { getMessages, type Messages } from "./messages";

export { locales, defaultLocale, isLocale, getMessages, type Locale, type Messages };

type Resolve<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? Resolve<T[K], R>
    : never
  : P extends keyof T
  ? T[P]
  : never;

export function createTranslator(locale: Locale) {
  const m = getMessages(locale);
  return function t<P extends string>(path: P): Resolve<Messages, P> {
    const parts = path.split(".");
    let cur: unknown = m;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return undefined as unknown as Resolve<Messages, P>;
      }
    }
    return cur as Resolve<Messages, P>;
  };
}
