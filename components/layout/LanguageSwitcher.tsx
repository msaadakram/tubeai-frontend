"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe, Check, ChevronDown, Loader2 } from "lucide-react";
import { locales, localeNames, LOCALE_COOKIE, defaultLocale, type Locale, isLocale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const choose = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;

    // 1. Persist cookie FIRST so the SSR re-render reads the correct locale
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    // 2. Update React context for instant client-side re-render of all translated strings
    setLocale(next);

    // 3. Build the canonical locale-prefixed path
    const parts = pathname.split("/").filter(Boolean);
    let rawPath: string;
    let newPath: string;

    if (parts.length > 0 && isLocale(parts[0])) {
      // Current URL already has a locale prefix (e.g. /fr/tools/seo-analyzer)
      // Strip the old locale to get the bare path
      rawPath = "/" + parts.slice(1).join("/") || "/";
    } else {
      // Current URL has no locale prefix — it is the default locale (en)
      // The full pathname IS the bare path (e.g. /tools/seo-analyzer)
      rawPath = pathname;
    }

    if (next === defaultLocale) {
      // Switching back to default locale: no prefix needed
      newPath = rawPath || "/";
    } else {
      newPath = `/${next}${rawPath === "/" ? "" : rawPath}`;
    }

    // 4. Navigate inside a transition so React shows isPending while re-rendering
    startTransition(() => {
      router.push(newPath);
    });
  };

  const current = localeNames[locale];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        disabled={isPending}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border-2 border-black bg-white px-2.5 py-1.5 text-xs font-black transition-all hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60",
          open && "shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]"
        )}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
        ) : (
          <Globe className="w-3.5 h-3.5 text-red-600" />
        )}
        <span className="text-base leading-none">{current.flag}</span>
        {!compact && <span className="hidden sm:inline uppercase tracking-wider">{locale}</span>}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-[60]">
          <div className="px-3 py-2 border-b-2 border-black bg-neutral-50 text-[10px] font-black uppercase tracking-wider text-neutral-500">
            {locales.length} languages
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {locales.map((l) => {
              const meta = localeNames[l];
              const active = l === locale;
              return (
                <button
                  key={l}
                  onClick={() => choose(l)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-red-50 transition-colors",
                    active && "bg-red-50"
                  )}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none">{meta.flag}</span>
                    <span className="font-black truncate">{meta.name}</span>
                    <span className="text-[11px] font-bold text-neutral-500 truncate">· {meta.native}</span>
                  </span>
                  {active && <Check className="w-4 h-4 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
