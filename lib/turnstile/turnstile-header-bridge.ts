/**
 * turnstile-header-bridge.ts
 * --------------------------
 * Tiny side-channel so `lib/auth.tsx:authFetch` can read the current verified
 * Turnstile session id to attach as `X-Turnstile-Session` on outbound API
 * calls, without a circular import between `auth.tsx` (a client provider)
 * and `lib/turnstile/TurnstileSessionProvider.tsx`.
 */
let currentSessionId: string | null = null;

export function setTurnstileSessionId(id: string | null) {
  currentSessionId = id;
}

export function getTurnstileSessionId(): string | null {
  return currentSessionId;
}
