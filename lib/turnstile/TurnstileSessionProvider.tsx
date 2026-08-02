"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { TurnstileHandle } from "@/components/ui/turnstile-widget";
import { setTurnstileSessionId } from "@/lib/turnstile/turnstile-header-bridge";

/**
 * TurnstileSessionProvider
 * ------------------------
 * A single app-level Cloudflare Turnstile verification session shared by
 * every tool page.
 *
 * Why a session?
 * --------------
 * Pre-refactor, `<TurnstileGate>` was mounted once per tool route inside
 * `<ToolLayout>`. Each navigation remounted the gate, the widget re-rendered,
 * and the user had to solve the challenge again — friction for any legitimate
 * user hopping between tools. This provider holds a `sessionId` (a uuid
 * minted client-side, validated server-side via `POST /auth/turnstile-session`
 * once the Cloudflare token lands). All subsequent tool API calls attach
 * `X-Turnstile-Session: <id>` so the backend can confirm a real human drove
 * the session, without re-challenging them per page view.
 *
 * Storage
 * -------
 * `sessionId` persists to `sessionStorage` so a refresh on a tool page does
 * NOT lose verification (it's the same browser session). It is intentionally
 * NOT persisted to `localStorage` — Cloudflare tokens expire (300s) and the
 * backend session entry TTLs out (~10min), so surviving across browser
 * restarts would just produce a stale-session 401.
 *
 * Dev mode
 * --------
 * When `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset, the provider auto-claims
 * `verified=true` so local dev and any staging without creds are frictionless.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const STORAGE_KEY = "ytforge.turnstile.session";
const SESSION_TTL_MS = 10 * 60 * 1000; // 10 minutes — matches backend default

type SessionState = {
  /** Whether the session has a fresh Cloudflare-verified token. */
  verified: boolean;
  /** Backend-issued session id, attached to subsequent tool API calls. */
  sessionId: string | null;
  /** Error from the last server-side validation, if any. Cleared on solve. */
  error: string | null;
  /** Imperative reset handle for the mounted widget, when there is one. */
  turnstileRef: React.RefObject<TurnstileHandle | null>;
  /** Cloudflare site key (so children can decide whether to render). */
  siteKey: string;
  /** Token landed → call backend to register session, flip `verified`. */
  onToken: (token: string) => void;
  /** Cloudflare fired expired/error → clear local state, reset widget. */
  onExpire: () => void;
  /** Force-clear local state (e.g. on a 401 TURNSTILE_SESSION_EXPIRED). */
  invalidate: () => void;
};

const Ctx = createContext<SessionState>({
  verified: SITE_KEY ? false : true,
  sessionId: null,
  error: null,
  turnstileRef: { current: null },
  siteKey: SITE_KEY,
  onToken: () => {},
  onExpire: () => {},
  invalidate: () => {},
});

export function useTurnstileSession(): SessionState {
  return useContext(Ctx);
}

function readStoredSession(): { id: string; at: number } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.id !== "string" || typeof parsed?.at !== "number") return null;
    // Expire stale client entries so a token doesn't get reused past TTL.
    if (Date.now() - parsed.at > SESSION_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredSession(id: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ id, at: Date.now() }));
  } catch {
    /* sessionStorage unavailable (private mode) — in-memory state still works */
  }
}

function clearStoredSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function mintSessionId(): string {
  // Prefer native crypto uuid; fall back to a manual v4 if unavailable.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * NOTE: we import authFetch lazily to avoid a circular dependency
 * (`auth.tsx` is itself a client provider and loads at app boot, and our
 * session endpoint is unauthenticated — `authFetch` would still work, but
 * we want this provider to be self-contained for the tool-page use case).
 */
async function registerSession(token: string): Promise<{ sessionId: string }> {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "https://api.ytforge.app"
  ).replace(/\/+$/, "");
  const res = await fetch(`${base}/api/auth/turnstile-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "cf-turnstile-response": token,
      // The backend echoes this back as the session handle so the client
      // controls the id, matching the way Cloudflare itself recommends
      // client-issued idempotency keys for siteverify flows.
      sessionId: mintSessionId(),
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({} as any));
    const err = new Error(body?.error || "Verification failed") as Error & {
      status?: number;
      code?: string;
    };
    err.status = res.status;
    err.code = body?.code;
    throw err;
  }
  const data = await res.json();
  return { sessionId: data.sessionId };
}

export function TurnstileSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // When the site key is not configured (local dev), short-circuit to
  // always-verified so tool pages render without friction.
  const enabled = Boolean(SITE_KEY);
  const turnstileRef = useRef<TurnstileHandle | null>(null);
  const [verified, setVerified] = useState<boolean>(!enabled);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Rehydrate from sessionStorage on first mount (covers page refresh).
  useEffect(() => {
    if (!enabled) return;
    const stored = readStoredSession();
    if (stored) {
      setSessionId(stored.id);
      setVerified(true);
      setTurnstileSessionId(stored.id);
    }
    return () => {
      // Clear the side-channel if the provider unmounts (e.g. navigation
      // away from the locale subtree). Re-mounted providers re-populate it.
      setTurnstileSessionId(null);
    };
  }, [enabled]);

  useEffect(() => {
    setTurnstileSessionId(sessionId);
  }, [sessionId]);

  const onToken = useCallback(async (token: string) => {
    if (!enabled) return;
    if (!token) {
      setVerified(false);
      setSessionId(null);
      clearStoredSession();
      return;
    }
    setError(null);
    try {
      const { sessionId: id } = await registerSession(token);
      setSessionId(id);
      setVerified(true);
      writeStoredSession(id);
    } catch (err: any) {
      setVerified(false);
      setSessionId(null);
      clearStoredSession();
      setError(
        err?.code === "TURNSTILE_INVALID"
          ? "Security check failed. Please try again."
          : err?.code === "TURNSTILE_SERVICE_ERROR"
            ? "Security check is temporarily unavailable. Please retry."
            : err?.message || "Verification failed. Please try again."
      );
      // Reset the widget so the human can re-solve.
      turnstileRef.current?.reset();
    }
  }, [enabled]);

  const onExpire = useCallback(() => {
    setVerified(false);
    setSessionId(null);
    clearStoredSession();
    turnstileRef.current?.reset();
  }, []);

  const invalidate = useCallback(() => {
    setVerified(false);
    setSessionId(null);
    setError(null);
    clearStoredSession();
  }, []);

  const value = useMemo<SessionState>(
    () => ({
      verified,
      sessionId,
      error,
      turnstileRef,
      siteKey: SITE_KEY,
      onToken,
      onExpire,
      invalidate,
    }),
    [verified, sessionId, error, onToken, onExpire, invalidate]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
