"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { defaultLocale, isLocale, locales, type Locale } from "./config";
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

  const setLocale = useCallback((next: Locale) => {
    if (!isLocale(next)) return;
    setActiveLocale(next);
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
