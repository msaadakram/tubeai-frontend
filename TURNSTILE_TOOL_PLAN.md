# PLAN: Inline Turnstile on Tool Pages — Replace the Full-Page Gate

## Goal
Remove the full-page `TurnstileGate` card that currently covers every tool page
and replace it with an **inline Turnstile widget at the bottom of the tool's
input form** (below the URL/ID input, above the primary action button). A user
must solve the check **once per session** before any tool feature fires.

## Why (Current state — confirmed by code reading)

| Finding | Location | Implication |
|---|---|---|
| Turnstile today is a **layout-level gate** wrapping all tool children | `components/tools/ToolLayout.tsx:112` (`<TurnstileGate>{children}</TurnstileGate>`) | The whole tool body — helper copy + input + result — is replaced by a stacked "Verify you're human" card. It feels heavy and disconnected from the input. |
| The gate runs only in the browser | `components/tools/TurnstileGate.tsx` (no fetch with `cf-turnstile-response`) | The backend YouTube routes have **no anti-bot protection today**. |
| YouTube tool routes have **zero Turnstile verification** | `tubeai/src/routes/youtubeRoutes.js:7-10` (`/channel-info`, `/channel-analytics`, `/monetization`) have no `verifyTurnstile`, no `authLimiter` | Once the gate is solved, a script can hit these endpoints directly with no challenge. Removing the front-end gate *without* adding backend protection would actually **weaken** the anti-bot surface. |
| All tool pages use the shared `<ToolCard>` + `<PrimaryButton>` | `components/tools/ToolLayout.tsx:123-153`; tool pages call `<ToolLayout><ToolCard>...<PrimaryButton onClick={run}>` | A shared insert point exists — the plan can ship one building block used by every tool. |
| `useTurnstileSession` already exists and exposes `{ token, verified, turnstileRef, onToken, onExpire, invalidate }` | `hooks/useTurnstileSession.ts` | Reuse the existing session-state hook so we don't recreate state plumbing. |
| Not every tool has a live input + run path | Inventory (below) | The inline pattern only applies to *those* tools. Locked/"coming soon" pages keep the existing lock-card (no inline gate, no challenge). |

### Tool inventory (live-input vs locked)

```
Live input + run button → gets inline Turnstile
ai-script-writer       btn=4 api=1   ✅ inline
ai-transcript          btn=4 api=6   ✅ inline
channel-analytics      btn=4 api=1   ✅ inline
channel-id-finder      btn=5 api=1   ✅ inline  ← reference implementation
earnings-calculator    btn=0 api=0   ✅ inline (formula calc, has calculator form)
embed-generator        btn=3 api=0   ✅ inline (no backend, but already protected input → action)
hashtag-generator      btn=4 api=1   ✅ inline
monetization-checker   btn=4 api=1   ✅ inline
qr-code-generator      btn=4 api=0   ✅ inline (client-side QR generation)
seo-analyzer           btn=3 api=1   ✅ inline
shorts-ideas           btn=3 api=0   ✅ inline  ← lives behind chat fetch, treat as live
tag-generator          btn=4 api=1   ✅ inline
thumbnail-downloader   btn=3 api=2   ✅ inline
thumbnail-preview      btn=3 api=0   ✅ inline (client-side iframe builder)
viral-title-generator  btn=3 api=1   ✅ inline

Locked / coming-soon → NO inline Turnstile, keep existing premium lock card
ai-thumbnail-generator btn=0 api=0 locked=1  ❌ no inline (has no real action button)
```

14 tools get the inline widget. 1 tool keeps its premium lock card.

## Design — visual placement

```
┌─ ToolCard (existing) ─────────────────────────────┐
│  [URL / ID / keyword input]                       │
│  [optional secondary input(s)]                    │
│                                                   │
│  ┌── Security check ───────── Verified ──┐        │  ← NEW
│  │ [ Cloudflare Turnstile iframe ]       │        │
│  └────────────────────────────────────────┘       │
│  (hint: Complete the check above to {action}.)    │  ← NEW, hides on solve
│                                                   │
│  [ PrimaryButton: {action} ]                     │  ← GATED on token
└──────────────────────────────────────────────────┘
```

- Matches the pattern already shipped on `forgot-password` and `reset-password`
  (single bordered frame, Required→Verified chip at the label, no box-in-box).
- The widget lives **inside the existing `<ToolCard>`** above `<PrimaryButton>`.
- The `<PrimaryButton>`'s `disabled` gains a third term: `!turnstileToken`.
- Suggested-example chips (the row under the input on some tools) stay where
  they are so users can still one-tap fill the input — but the run button stays
  disabled until the widget is solved.

## Session semantics (so users re-solve at most once per session)

- Today's `useTurnstileSession` is *local to a single `TurnstileGate` mount*.
  Each time the user visits a different tool page, the gate remounts and the
  widget re-renders — solving it again. This is the slowness users feel.
- **Solution:** lift verification to a single `SessionProvider` so the token
  captured by tool A is re-used on tool B later in the same session. Cloudflare
  tokens are valid for 300s; the provider persists `token`, `verifiedAt`, and
  `sessionId`, and **re-validates on the server** at each tool request rather
  than trusting the cached token forever (see Phase 2).

## Backend query (`session.id`)
- Front-end creates a `crypto.randomUUID()` `sessionId`, sends it with the
  Turnstile token to `POST /auth/turnstile-session`, backend returns
  `{ sessionId, valid: true, expiresAt }`.
- Front-end persists `sessionId` (memory + sessionStorage).
- All `/api/*` tool requests include `X-Turnstile-Session: <id>` header or
  send `sessionId` in the body; backend middleware `requireTurnstileSession`
  looks up the Redis entry and rejects with `TURNSTILE_SESSION_EXPIRED` 401.
- This is the proper fix for audit Issue B4: "Verification is skipped when
  `TURNSTILE_SECRET_KEY` is not set" — in dev the session is created without
  Cloudflare verification but still rate-limited.

## Backend enrichment (NEW — required because today's routes have none)

> Removing the front-end gate without this phase would *weaken* anti-bot
> coverage vs. today. Phase 2 ships **before** Phase 3 (gate removal).

### 2A. Per-tool rate limiting
| File | Change |
|---|---|
| `tubeai/src/routes/youtubeRoutes.js` | wrap `/channel-info`, `/channel-analytics`, `/monetization` with `toolLimiter` (30 / 15min / IP) |
| `tubeai/src/routes/seoRoutes.js` | same for `/seo-analyzer` |
| `tubeai/src/routes/hashtagRoutes.js` | same for `/hashtag*` |
| `tubeai/src/routes/titleRoutes.js` | same for `/viral-title*` |
| `tubeai/src/routes/transcriptRoutes.js` | same for `/transcript*` |
| `tubeai/src/routes/scriptRoutes.js` | same for `/script*` |
| `tubeai/src/routes/thumbnailRoutes.js` | same for `/thumbnail*` (downloader, preview, etc.) |

### 2D. Audit Issue #17 — `resend-verification` Turnstile parity
While we're touching `authRoutes.js`, apply `verifyTurnstile` to
`/auth/resend-verification` so it matches `/auth/forgot-password`
(per `AUTH_ISSUES_ANALYSIS_NEW.md` Issue #17). One-line edit; falls
out of Phase 2 cleanly.

## Phase 3 — front-end inline widget + remove the layout gate

### 3A. New shared component `ToolTurnstile`
| File | Lines | Purpose |
|---|---|---|
| `components/tools/ToolTurnstile.tsx` | ~110 | see spec below |

Spec:
- Reads from `useTurnstileSessionContext()`.
- Renders:
  ```
  <div className="flex flex-col gap-1.5 mb-4">
    <div className="flex items-center justify-between">
      <label className="text-xs font-black uppercase tracking-wider text-neutral-500">Security check</label>
      {verified ? <VerifiedChip/> : <RequiredChip/>}
    </div>
    <TurnstileWidget size="normal" className="overflow-hidden rounded-lg border-2 border-black self-start" ... />
    {!verified && <hint/>}
  </div>
  ```
- Accepts an optional `actionLabel` prop used in the hint copy:
  "Complete the check above to {actionLabel}." (default "use this tool").
- Accepts an optional `size="compact"` for the cramped sidebar tools.
- If no `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, renders nothing (dev convenience).
- Token capture writes through `sessionContext.onSolved(token)` so the
  shared provider records the `sessionId` as well as the local `verified` flag.

### 3B. Wire each tool's primary action
Per-tool page (14 pages) — minimal one-block insert:

```tsx
// in each tool's input ToolCard, above <PrimaryButton>:
<ToolTurnstile actionLabel={toolContent.btnFind} size="normal" />

// and tighten disabled on the existing PrimaryButton:
<PrimaryButton onClick={run} disabled={loading || !input.trim() || !turnstileVerified}>
```

Pages in alphabetical order (file → property name used as `actionLabel`):

| Tool page file | `actionLabel` source |
|---|---|
| `ai-script-writer/page.tsx` | `toolContent.btnGenerate` |
| `ai-transcript/page.tsx` | `toolContent.btnFetch` |
| `channel-analytics/page.tsx` | `toolContent.btnAnalyze` |
| `channel-id-finder/page.tsx` | `toolContent.btnFind` |
| `earnings-calculator/page.tsx` | `toolContent.btnCalculate` |
| `embed-generator/page.tsx` | `toolContent.btnGenerate` |
| `hashtag-generator/page.tsx` | `toolContent.btnGenerate` |
| `monetization-checker/page.tsx` | `toolContent.btnCheck` |
| `qr-code-generator/page.tsx` | `toolContent.btnGenerate` |
| `seo-analyzer/page.tsx` | `toolContent.btnAnalyze` |
| `shorts-ideas/page.tsx` | `toolContent.btnGenerate` |
| `tag-generator/page.tsx` | `toolContent.btnGenerate` |
| `thumbnail-downloader/page.tsx` | `toolContent.btnDownload` |
| `thumbnail-preview/page.tsx` | `toolContent.btnPreview` |
| `viral-title-generator/page.tsx` | `toolContent.btnGenerate` |

Each edit is **no larger than 8 lines**. No other UI changes per page.
Result panels below `<PrimaryButton>` render normally — no gate hides them.

### 3C. Remove the layout-level gate
| File | Change |
|---|---|
| `components/tools/ToolLayout.tsx:8` | drop `import { TurnstileGate }` |
| `components/tools/ToolLayout.tsx:109-115` | replace `<TurnstileGate>{children}</TurnstileGate>` with `{children}` |
| `components/tools/TurnstileGate.tsx` | **delete the file** (dead after Phase 3) |

`ai-thumbnail-generator` keeps its existing premium lock card. **No Turnstile
on the lock-card page** — it has no real input, so the existing pattern stays.
(Sec-aware note: add a future task to verify the AI tool endpoints in `chatRoutes.js`
also go behind `requireTurnstileSession` once `chatRoutes.js` starts accepting
AI-tool calls.)

## Phase 4 — migration safety

- **Phases ship back-to-front in PRs**: 1 (provider) → 2 (backend) → 3 (UI).
- The frontend gate stays in place until Phase 3 lands; Phase 2 backend guards
  are additive only and don't yet break the existing gate flow (the gate never
  sends the token anyway).
- Every tool's `run()` already lives in the page component, untouched; we only
  add one new line above `<PrimaryButton>` and one extra `disabled` clause.
- If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset (local dev, staging without
  creds), `ToolTurnstile` renders nothing and `useTurnstileSessionContext`
  returns `verified=true` — zero friction for dev/testing.
- No new env vars required for `front-next`. Backend `INSTALLED_TURNSTILE=true`
  is optional (see Phase 2C).
- i18n: no string keys added in Phase 3. The four literal labels (`Security check`,
  `Verified`, `Required`, `Complete the check above to {actionLabel}.`) will be
  localized in Phase 5 (same `messages/*.ts` pattern as the rest of the app).

## Phase 5 — i18n + telemetry (post-merge tidy-up)

- Add `toolPages.shared.securityCheck`, `toolPages.shared.verified`,
  `toolPages.shared.required`, `toolPages.shared.completeTheCheck` to
  `messages/messages-schema.ts` and all 9 locale files.
- Replace the English literals in `ToolTurnstile.tsx` with `t()` calls.
- Add a `turnstile_solved` analytics event pixel after solve so we can measure
  solve-rate vs. drop-off per tool (currently invisible because the gate
  succeeds silently).
- Add Mixpanel-style telemetry on `turnstile_session_created` and
  `turnstile_session_expired` counters.

## Phase 6 — observability & docs

- Update `tubeai/docs/AUTH.md` "Turnstile" section to document the new
  `POST /auth/turnstile-session` endpoint and `requireTurnstileSession`
  middleware.
- Add a unit test for `requireTurnstileSession` (created / expired / revoked /
  missing-key / dev-mode-without-Cloudflare).
- Add a front-end Playwright e2e path: visit channel-id-finder, fill URL,
  solve Turnstile, click Find, verify network call has
  `X-Turnstile-Session` header, verify result card renders.
- Update `AUTH_ISSUES_ANALYSIS_NEW.md` Issue #17 status to ✅ FIXED once
  Phase 2D ships.

## File touch summary (final)

| Layer | Files | Status |
|---|---|---|
| Front — new | `components/tools/ToolTurnstile.tsx`, `components/providers/TurnstileSessionProvider.tsx`, `hooks/useTurnstileSession.ts` (extended) | **new / modified** |
| Front — touch (14) | `app/[locale]/tools/<tool>/page.tsx` × 14 | one insert + one `disabled` clause each |
| Front — touch (1) | `components/tools/ToolLayout.tsx` | remove `<TurnstileGate>` wrap |
| Front — delete | `components/tools/TurnstileGate.tsx` | dead file → removed |
| Back — touch (8) | `tubeai/src/routes/{youtube,seo,hashtag,title,transcript,script,thumbnail,auth}Routes.js` + `tubeai/src/app.js` (CORS allows X-Turnstile-Session) | guard routes + new session endpoint |
| Back — new (1) | `tubeai/src/controllers/turnstileSessionController.js` | create-session logic |
| Back — new (1) | `tubeai/src/middlewares/requireTurnstileSession.js` | per-request lookup |
| Back — touch (1) | `tubeai/src/controllers/authController.js` | add `createTurnstileSession` export |
| Docs | `tubeai/docs/AUTH.md`, `front-next/AUTH_ISSUES_ANALYSIS_NEW.md` (status) | updates |

## Expected outcome

- The full-page "Verify you're human" interstitial on tool pages disappears.
- On `channel-id-finder` (and every other live-input tool) the Turnstile widget
  sits **directly under the URL/ID input**, above the Find button.
- The Find button is disabled until the widget is solved; copy and suggestion
  chips remain usable.
- Verification persists across tools within the same session (no re-solve when
  navigating from `channel-id-finder` to `tag-generator`).
- The backend finally **enforces** Turnstile on tool endpoints (in addition to
  the front-end prompt), so direct API calls by bots are rejected.
