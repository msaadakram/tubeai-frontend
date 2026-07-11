"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "./LocaleContext";
import { getLocalePath } from "./utils";

/**
 * Drop-in replacement for useRouter that auto-prefixes every push/replace
 * with the current locale. Use this instead of router.push("/some-path")
 * in any client component so navigation always preserves the active locale.
 *
 * Example:
 *   const router = useLocaleRouter();
 *   router.push("/tools/viral-title-generator"); // → /fr/tools/viral-title-generator
 */
export function useLocaleRouter() {
  const router = useRouter();
  const { locale } = useLocale();

  return {
    push: (path: string) => router.push(getLocalePath(locale, path)),
    replace: (path: string) => router.replace(getLocalePath(locale, path)),
    prefetch: (path: string) => router.prefetch(getLocalePath(locale, path)),
    locale,
  };
}
