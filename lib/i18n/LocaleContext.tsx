"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, isLocale, locales, LOCALE_COOKIE, type Locale } from "./config";
import type { Messages } from "./messages-schema";
import { getMessages } from "./messages";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  isLocalized: boolean;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  messages: getMessages(defaultLocale),
  setLocale: () => {},
  isLocalized: true,
});

export function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>(locale);

  // Sync state whenever the server-side locale prop changes (e.g. after router.push)
  useEffect(() => {
    if (isLocale(locale) && locale !== activeLocale) {
      setActiveLocale(locale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    if (!isLocale(next)) return;
    setActiveLocale(next);
    // Persist immediately so SSR picks up the correct locale on the next request
    if (typeof document !== "undefined") {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: activeLocale,
      messages: getMessages(activeLocale),
      setLocale,
      isLocalized: true,
    }),
    [activeLocale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export { locales, defaultLocale, type Locale, type Messages };
