"use client";

import { useMemo } from "react";
import { useTurnstileSession } from "@/lib/turnstile/TurnstileSessionProvider";

/**
 * useTurnstileHeader
 * -------------------
 * Hook used by tool pages whose network calls use plain `fetch()`
 * (most of `/tools/*` pages — they go to public endpoints like
 * `/api/channel-info`, not authed ones).
 *
 * Returns helpers so the page can attach the backend-verified session id to
 * its outbound requests:
 *
 *   const ts = useTurnstileHeader();
 *   if (!ts.ready) return;            // wait for verification
 *   await fetch(`${BASE_URL}/api/channel-info`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json", ...ts.headers },
 *     body: JSON.stringify({ url }),
 *   });
 *
 * The session id lives in `<TurnstileSessionProvider>`, so any number of
 * tool pages sharing this hook reuse a single challenge — the "solve once
 * per session" UX the plan calls for.
 *
 * When Turnstile is not configured (no site key), `ts.enabled` is false,
 * `ts.ready` is true, and `ts.headers` is `{}` — backend middleware also
 * runs in a permissive dev mode when the secret key is missing, so dev
 * stays frictionless.
 */
export function useTurnstileHeader() {
  const { sessionId, verified, siteKey } = useTurnstileSession();
  const enabled = Boolean(siteKey);
  const ready = enabled ? verified && Boolean(sessionId) : true;
  const headers = useMemo<Record<string, string>>(() => {
    if (!enabled || !verified || !sessionId) return {} as Record<string, string>;
    return { "X-Turnstile-Session": sessionId };
  }, [enabled, verified, sessionId]);

  return { enabled, verified, ready, sessionId, headers };
}
