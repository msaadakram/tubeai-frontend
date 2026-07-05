"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { friendlyApiError } from "@/lib/apiError";

export type Plan = "free" | "creator" | "pro" | "enterprise";

export type Goal = {
  title: string;
  metric: string;
  target: number;
  current: number;
  deadline: string;
};

export type User = {
  id?: string;
  name: string;
  email: string;
  plan: Plan;
  avatar: string;
  joined: string;
  goal?: Goal;
};

type AuthResult = { ok: true; user: User } | { ok: false; error: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => void;
  upgrade: (plan: Plan) => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, "name" | "email" | "avatar">>) => Promise<void>;
  setGoal: (goal: Goal) => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  signIn: async () => ({ ok: false, error: "Not implemented" }),
  signUp: async () => ({ ok: false, error: "Not implemented" }),
  signOut: () => {},
  upgrade: async () => {},
  updateProfile: async () => {},
  setGoal: async () => {},
});

export function useAuth() {
  return useContext(Ctx);
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tubeai-backend.vercel.app";

const TOKEN_KEY = "ytforge.token";
const USER_KEY = "ytforge.user";

function avatarFor(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff&bold=true&size=128`;
}

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}

function cacheUser(u: User) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  } catch {}
}

function readCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u || typeof u.email !== "string") return null;
    return u;
  } catch {
    return null;
  }
}

/** Fetch wrapper that auto-attaches the bearer token. Throws on non-2xx. */
export async function authFetch<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const token = readToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...opts, headers });
  const text = await res.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
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

function todayIso() {
  try {
    return new Date().toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function normalizeUser(u: any): User {
  const name = String(u?.name || "Creator").trim();
  return {
    id: u?.id || u?._id,
    name,
    email: String(u?.email || ""),
    plan: (u?.plan as Plan) || "creator",
    avatar: u?.avatar || avatarFor(name),
    joined: u?.joined || todayIso(),
    goal: u?.goal,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount: optimistically show cached user, then verify
  // the token against /api/auth/me so a stale/expired token is cleared.
  useEffect(() => {
    let cancelled = false;
    const cached = readCachedUser();
    if (cached) setUser(cached);

    const token = readToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authFetch<{ user: any }>("/api/auth/me")
      .then((res) => {
        if (cancelled) return;
        const u = normalizeUser(res.user);
        setUser(u);
        cacheUser(u);
      })
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((u: User, token?: string) => {
    cacheUser(u);
    if (token) writeToken(token);
    setUser(u);
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      try {
        const res = await authFetch<{ user: any; token: string }>(
          "/api/auth/signup",
          {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
          }
        );
        const u = normalizeUser(res.user);
        persist(u, res.token);
        return { ok: true, user: u };
      } catch (err: any) {
        return { ok: false, error: err?.message || "Sign up failed" };
      }
    },
    [persist]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const res = await authFetch<{ user: any; token: string }>(
          "/api/auth/signin",
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          }
        );
        const u = normalizeUser(res.user);
        persist(u, res.token);
        return { ok: true, user: u };
      } catch (err: any) {
        return { ok: false, error: err?.message || "Sign in failed" };
      }
    },
    [persist]
  );

  const signOut = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<User, "name" | "email" | "avatar">>) => {
      if (!user) return;
      try {
        const res = await authFetch<{ user: any }>("/api/auth/me", {
          method: "PATCH",
          body: JSON.stringify(patch),
        });
        const u = normalizeUser(res.user);
        persist(u);
      } catch {
        const next = { ...user, ...patch };
        if (patch.name && !patch.avatar) next.avatar = avatarFor(patch.name);
        persist(next);
      }
    },
    [user, persist]
  );

  const upgrade = useCallback(
    async (plan: Plan) => {
      if (!user) return;
      try {
        const res = await authFetch<{ user: any }>("/api/auth/me", {
          method: "PATCH",
          body: JSON.stringify({ plan }),
        });
        const u = normalizeUser(res.user);
        persist(u);
      } catch {
        persist({ ...user, plan });
      }
    },
    [user, persist]
  );

  const setGoal = useCallback(
    async (goal: Goal) => {
      if (!user) return;
      try {
        const res = await authFetch<{ user: any }>("/api/auth/me", {
          method: "PATCH",
          body: JSON.stringify({ goal }),
        });
        const u = normalizeUser(res.user);
        persist(u);
      } catch {
        persist({ ...user, goal });
      }
    },
    [user, persist]
  );

  return (
    <Ctx.Provider
      value={{ user, loading, signIn, signUp, signOut, upgrade, updateProfile, setGoal }}
    >
      {children}
    </Ctx.Provider>
  );
}
