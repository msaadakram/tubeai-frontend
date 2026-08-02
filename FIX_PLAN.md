# FRONT-NEXT FIX PLAN

## ANALYSIS SUMMARY
- Project: Next 15 + React 19, i18n (9 locales: en/es/de/fr/it/ja/ko/tr/zh)
- Build: PASSING (after zh.ts fix pushed to main: c2b0614)
- TypeScript: PASSING
- Main issue: viral-title-generator has hardcoded English UI strings
- Component bugs: sidebar hydration, turnstile race, mobile flash
- Router gaps: sitemap chunks missing force-static, [locale]/not-found missing, root html no lang/dir

## PHASE 1: VIRAL TITLE GENERATOR FULL TRANSLATION (Priority: HIGH)
Target: Every word in page.tsx must come from t("toolPages.viralTitleGenerator")
Steps:
1. Read message schema for viralTitleGenerator section
2. Identify all hardcoded strings in page.tsx
3. Add missing keys to messages-schema.ts
4. Add translations to all 9 locale files (en/es/de/fr/it/ja/ko/tr/zh)
5. Replace hardcoded strings in page.tsx with toolContent.* references

## PHASE 2: OTHER TOOL PAGES (Priority: MEDIUM)
Audit remaining 15 tool pages for hardcoded English strings and fix.

## PHASE 3: COMPONENT BUG FIXES (Priority: MEDIUM)
- sidebar.tsx: replace Math.random() with deterministic seed
- turnstile-widget.tsx: fix script loader race + expired callback
- use-mobile.ts: fix hydration flash
- ChatMarkdown.tsx: improve inline/block code detection

## PHASE 4: ROUTER / SEO FIXES (Priority: LOW)
- sitemap routes: add export const dynamic = "force-static"
- middleware / layout: add suppressHydrationWarning and lang/dir
- add [locale]/not-found.tsx
