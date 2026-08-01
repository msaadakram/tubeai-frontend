"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { friendlyApiError } from "@/lib/apiError";

export type Plan = "free" | "pro" | "enterprise";

export type Goal = {
  title: string;
  metric: string;
  target: number;
  current: number;
  deadline: string;
};

export type Payment = {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

export type User = {
  id?: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  plan: Plan;
  avatar: string;
  joined: string;
  goal?: Goal;
  referralCode?: string;
  referredBy?: string;
  referrals?: number;
  payment?: Payment;
  planRenewsAt?: string | null;
  googleLinked?: boolean;
  hasPassword?: boolean;
};

type AuthResult = { ok: true; user: User } | { ok: false; error: string; code?: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, turnstileToken?: string, rememberMe?: boolean) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string, referralCode?: string, turnstileToken?: string) => Promise<AuthResult>;
  signInWithGoogle: (idToken: string, referralCode?: string) => Promise<AuthResult>;
  signOut: () => void;
  upgrade: (plan: Plan) => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, "name" | "email" | "avatar">>) => Promise<void>;
  setGoal: (goal: Goal) => Promise<void>;
  deleteAccount: () => Promise<{ ok: boolean; error?: string }>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  signIn: async () => ({ ok: false, error: "Not implemented" }),
  signUp: async () => ({ ok: false, error: "Not implemented" }),
  signInWithGoogle: async () => ({ ok: false, error: "Not implemented" }),
  signOut: () => {},
  upgrade: async () => {},
  updateProfile: async () => {},
  setGoal: async () => {},
  deleteAccount: async () => ({ ok: false, error: "Not implemented" }),
});

export function useAuth() {
  return useContext(Ctx);
}

/**
 * API base URL.
 *
 * Priority order:
 * 1. NEXT_PUBLIC_API_URL env var (set in Vercel dashboard or .env.local)
 * 2. Hardcoded fallback to YOUR backend on Vercel
 *
 * NOTE: This value is baked in at BUILD TIME by Next.js for NEXT_PUBLIC_ vars.
 * If you change it in Vercel, you must redeploy.
 *
 * For local dev: create .env.local with:
 *   NEXT_PUBLIC_API_URL=http://localhost:3001
 */
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.ytforge.app"
).replace(/\/+$/, ""); // strip trailing slash

const TOKEN_KEY = "ytforge.token";
const REFRESH_KEY = "ytforge.refreshToken";
const USER_KEY  = "ytforge.user";
const LOCALE_COOKIE = "NEXT_LOCALE";

// Module-level locale — updated by `setRequestLocale` called from components.
let currentLocale = "en";
export function setRequestLocale(locale: string) {
  currentLocale = locale || "en";
}

function getLocaleHeader(): string {
  // Prefer module-level locale (set during initial render), then cookie.
  if (currentLocale && currentLocale !== "en") return currentLocale;
  try {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
    if (match && match[1]) return match[1];
  } catch {}
  return "en";
}

function avatarFor(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff&bold=true&size=128`;
}

function readToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function writeToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}
function readRefreshToken(): string | null {
  try { return localStorage.getItem(REFRESH_KEY); } catch { return null; }
}
function writeRefreshToken(token: string) {
  try { localStorage.setItem(REFRESH_KEY, token); } catch {}
}
function clearTokens() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}
function cacheUser(u: User) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch {}
}
function readCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u || typeof u.email !== "string") return null;
    return u;
  } catch { return null; }
}

/** Fetch wrapper that auto-attaches the bearer token.
 *
 * On 401 (expired access token), transparently attempts a refresh-token
 * exchange via `POST /api/auth/refresh`. If the refresh succeeds, the original
 * request is retried with the new access token. If the refresh fails (e.g.
 * refresh token expired/revoked), all tokens are cleared so the caller can
 * redirect to sign-in.
 */
export async function authFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = readToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  };
  headers["X-Locale"] = getLocaleHeader();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `${API_BASE}${path}`;

  let res: Response;
  try {
    res = await fetch(url, { ...opts, headers });
  } catch (networkErr: any) {
    throw new Error(
      `Cannot reach the server at ${API_BASE}. ` +
      `Check your internet connection or the NEXT_PUBLIC_API_URL Vercel env var. ` +
      `(${networkErr?.message || "Network error"})`
    );
  }

  if (res.status === 401 && !(opts as any).__isRetry) {
    // Token may be expired — try to refresh.
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Retry the original request with the new token.
      headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
      res = await fetch(url, { ...opts, headers, __isRetry: true } as any);
    } else {
      // Refresh failed — user must sign in again.
      clearTokens();
      if (setUserContext) setUserContext(null);
    }
  }

  const text = await res.text();
  let data: any = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      friendlyApiError(text, res.status);
    const err = new Error(
      typeof message === "string" ? message : "Request failed"
    ) as Error & { status?: number; code?: string };
    err.status = res.status;
    err.code = data?.code;
    throw err;
  }

  return data as T;
}

// Internal ref to the React context's setUser — set by AuthProvider.
let setUserContext: React.Dispatch<React.SetStateAction<User | null>> | null = null;

/** Attempt a silent refresh using the stored refresh token. */
async function tryRefreshToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refreshToken = readRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.accessToken) return null;
    writeToken(data.accessToken);
    if (data.refreshToken) writeRefreshToken(data.refreshToken);
    return { accessToken: data.accessToken, refreshToken: data.refreshToken };
  } catch {
    return null;
  }
}

function todayIso() {
  try { return new Date().toISOString().slice(0, 10); } catch { return ""; }
}

function normalizeUser(u: any): User {
  const name = String(u?.name || "Creator").trim();
  return {
    id: u?.id || u?._id,
    name,
    email: String(u?.email || ""),
    emailVerified: Boolean(u?.emailVerified),
    plan: (u?.plan as Plan) || "free",
    avatar: u?.avatar || avatarFor(name),
    joined: u?.joined || todayIso(),
    goal: u?.goal,
    referralCode: u?.referralCode || "",
    referredBy: u?.referredBy || "",
    referrals: Number(u?.referrals) || 0,
    payment: u?.payment || { brand: "", last4: "", expMonth: 0, expYear: 0 },
    planRenewsAt: u?.planRenewsAt || null,
    googleLinked: Boolean(u?.googleLinked),
    hasPassword: Boolean(u?.hasPassword),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  setUserContext = setUser;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const cached = readCachedUser();
    if (cached) setUser(cached);

    const token = readToken();
    if (!token) { setLoading(false); return; }

    authFetch<{ user: any }>("/api/auth/me")
      .then((res) => {
        if (cancelled) return;
        const u = normalizeUser(res.user);
        setUser(u);
        cacheUser(u);
      })
      .catch(() => {
        if (cancelled) return;
        clearTokens();
        setUser(null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const persist = useCallback((u: User, token?: string, refreshToken?: string) => {
    cacheUser(u);
    if (token) writeToken(token);
    if (refreshToken) writeRefreshToken(refreshToken);
    setUser(u);
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string, referralCode?: string, turnstileToken?: string): Promise<AuthResult> => {
      try {
        const body: Record<string, string> = { name, email, password };
        if (referralCode)   body.referralCode = referralCode;
        if (turnstileToken) body["cf-turnstile-response"] = turnstileToken;
        const res = await authFetch<{ user: any; token: string; refreshToken: string }>("/api/auth/signup", { method: "POST", body: JSON.stringify(body) });
        const u = normalizeUser(res.user);
        persist(u, res.token, res.refreshToken);
        return { ok: true, user: u };
      } catch (err: any) {
        return { ok: false, error: err?.message || "Sign up failed", code: err?.code };
      }
    }, [persist]);

  const signIn = useCallback(
    async (email: string, password: string, turnstileToken?: string, rememberMe?: boolean): Promise<AuthResult> => {
      try {
        const body: Record<string, string | boolean> = { email, password };
        if (turnstileToken) body["cf-turnstile-response"] = turnstileToken;
        if (rememberMe === false) body.rememberMe = false;
        const res = await authFetch<{ user: any; token: string; refreshToken: string }>("/api/auth/signin", { method: "POST", body: JSON.stringify(body) });
        const u = normalizeUser(res.user);
        persist(u, res.token, res.refreshToken);
        return { ok: true, user: u };
      } catch (err: any) {
        if (err?.status === 401 || err?.status === 403)
          return { ok: false, error: "Invalid email or password" };
        return { ok: false, error: err?.message || "Sign in failed" };
      }
    }, [persist]);

  /**
   * Google sign-in — passes the ID-token Google issued in the browser
   * to YOUR backend (/api/auth/google) for server-side verification.
   * Never calls api.ytforge.app or any third-party backend.
   */
  const signInWithGoogle = useCallback(
    async (idToken: string, referralCode?: string): Promise<AuthResult> => {
      try {
        const body: Record<string, string> = { idToken };
        if (referralCode) body.referralCode = referralCode;
        const res = await authFetch<{ user: any; token: string; refreshToken: string; isNew: boolean }>(
          "/api/auth/google",
          { method: "POST", body: JSON.stringify(body) }
        );
        const u = normalizeUser(res.user);
        persist(u, res.token, res.refreshToken);
        return { ok: true, user: u };
      } catch (err: any) {
        if (err?.code === "SERVER_CONFIG")
          return { ok: false, error: "Google login is not configured. Please use email/password." };
        return { ok: false, error: err?.message || "Google sign-in failed" };
      }
    }, [persist]);

  const signOut = useCallback(() => { clearTokens(); setUser(null); }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<User, "name" | "email" | "avatar">>) => {
      if (!user) return;
      try {
        const res = await authFetch<{ user: any }>("/api/auth/me", { method: "PATCH", body: JSON.stringify(patch) });
        persist(normalizeUser(res.user));
      } catch {
        const next = { ...user, ...patch };
        if (patch.name && !patch.avatar) next.avatar = avatarFor(patch.name);
        persist(next);
      }
    }, [user, persist]);

  const upgrade = useCallback(
    async (plan: Plan) => {
      if (!user) return;
      try {
        const res = await authFetch<{ user: any }>("/api/auth/me", { method: "PATCH", body: JSON.stringify({ plan }) });
        persist(normalizeUser(res.user));
      } catch {
        persist({ ...user, plan });
      }
    }, [user, persist]);

  const deleteAccount = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    try {
      await authFetch("/api/auth/me", { method: "DELETE" });
      clearTokens();
      setUser(null);
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || "Failed to delete account" };
    }
  }, []);

  const setGoal = useCallback(
    async (goal: Goal) => {
      if (!user) return;
      try {
        const res = await authFetch<{ user: any }>("/api/auth/me", { method: "PATCH", body: JSON.stringify({ goal }) });
        persist(normalizeUser(res.user));
      } catch {
        persist({ ...user, goal });
      }
    }, [user, persist]);

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut, upgrade, updateProfile, setGoal, deleteAccount }}>
      {children}
    </Ctx.Provider>
  );
}
