"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Plan = "free" | "creator" | "pro" | "enterprise";

export type Goal = {
  title: string;
  metric: string;
  target: number;
  current: number;
  deadline: string;
};

export type User = {
  name: string;
  email: string;
  plan: Plan;
  avatar: string;
  joined: string;
  goal?: Goal;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  upgrade: (plan: Plan) => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "email" | "avatar">>) => void;
  setGoal: (goal: Goal) => void;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  signIn: () => {},
  signOut: () => {},
  upgrade: () => {},
  updateProfile: () => {},
  setGoal: () => {},
});

const KEY = "ytforge.user";

function avatarFor(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff&bold=true&size=128`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User) => {
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };

  const signIn = (email: string, name?: string) => {
    const display = (name || email.split("@")[0]).trim() || "Creator";
    const finalName = display.charAt(0).toUpperCase() + display.slice(1);
    persist({
      name: finalName,
      email,
      plan: "creator",
      avatar: avatarFor(finalName),
      joined: new Date().toISOString().slice(0, 10),
    });
  };

  const signOut = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  const upgrade = (plan: Plan) => {
    if (!user) return;
    persist({ ...user, plan });
  };

  const updateProfile = (patch: Partial<Pick<User, "name" | "email" | "avatar">>) => {
    if (!user) return;
    const next = { ...user, ...patch };
    if (patch.name && !patch.avatar) next.avatar = avatarFor(patch.name);
    persist(next);
  };

  const setGoal = (goal: Goal) => {
    if (!user) return;
    persist({ ...user, goal });
  };

  return (
    <Ctx.Provider value={{ user, loading, signIn, signOut, upgrade, updateProfile, setGoal }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
