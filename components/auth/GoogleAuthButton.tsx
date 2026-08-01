"use client";
/**
 * GoogleAuthButton
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a styled "Continue with Google" button.
 *
 * Uses the `GoogleLogin` render-prop pattern from @react-oauth/google to get
 * a signed ID-token (`credential`) directly — the same token that the backend's
 * `POST /api/auth/google` expects for server-side verification via
 * `google-auth-library`'s `verifyIdToken()`.
 *
 * Usage:
 *   <GoogleAuthButton onSuccess={handleGoogleToken} label="Continue with Google" />
 *
 * The `onSuccess` callback receives the raw credential string (Google ID token)
 * which you then pass to `signInWithGoogle(idToken)` from useAuth().
 */

import React from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { Loader2 } from "lucide-react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

type Props = {
  /** Called with the Google ID-token (credential) on success. */
  onSuccess: (idToken: string) => void;
  /** Called with a human-readable error on failure. */
  onError?: (message: string) => void;
  label?: string;
  loading?: boolean;
  className?: string;
};

export default function GoogleAuthButton({
  onSuccess,
  onError,
  label = "Continue with Google",
  loading = false,
  className = "",
}: Props) {
  return (
    <div className={className}>
      <GoogleLogin
        onSuccess={(credentialResponse: CredentialResponse) => {
          const idToken = credentialResponse.credential;
          if (!idToken) {
            onError?.("Google did not return a valid token. Please try again.");
            return;
          }
          onSuccess(idToken);
        }}
        onError={() => {
          onError?.("Google sign-in was cancelled or failed. Please try again.");
        }}
        useOneTap={false}
        type="standard"
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}
