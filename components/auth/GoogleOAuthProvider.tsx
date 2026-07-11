"use client";
/**
 * GoogleOAuthProvider wrapper
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps the app with the Google OAuth provider from @react-oauth/google.
 * Must be placed high in the tree (e.g. in the root layout), wrapping
 * AuthProvider so all auth hooks have access to the Google context.
 *
 * Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local.
 * If the env var is missing the provider renders children without Google support.
 */

import React from "react";
import { GoogleOAuthProvider as Provider } from "@react-oauth/google";

export default function GoogleOAuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  if (!clientId) {
    // Google OAuth not configured — skip provider. App still works with email/password.
    return <>{children}</>;
  }

  return <Provider clientId={clientId}>{children}</Provider>;
}
