export const locales = ["en", "es", "de", "fr", "it", "ja", "ko", "tr", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { name: string; native: string; flag: string }> = {
  en: { name: "English", native: "English", flag: "🇺🇸" },
  es: { name: "Spanish", native: "Español", flag: "🇪🇸" },
  de: { name: "German", native: "Deutsch", flag: "🇩🇪" },
  fr: { name: "French", native: "Français", flag: "🇫🇷" },
  it: { name: "Italian", native: "Italiano", flag: "🇮🇹" },
  ja: { name: "Japanese", native: "日本語", flag: "🇯🇵" },
  ko: { name: "Korean", native: "한국어", flag: "🇰🇷" },
  tr: { name: "Turkish", native: "Türkçe", flag: "🇹🇷" },
  zh: { name: "Chinese", native: "中文", flag: "🇨🇳" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const LOCALE_COOKIE = "NEXT_LOCALE";
