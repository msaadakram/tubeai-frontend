"use client";

import { useMemo } from "react";
import { useLocale } from "./LocaleContext";
import { createTranslator } from "./index";

export function useTranslations() {
  const { locale, messages, setLocale } = useLocale();
  const t = useMemo(() => createTranslator(locale), [locale]);
  return { t, locale, messages, setLocale };
}
