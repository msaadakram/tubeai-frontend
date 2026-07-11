"use client";
/**
 * GoogleCredentialButton
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses the `GoogleLogin` component from @react-oauth/google which returns a
 * signed ID-token (`credential`) directly — the cleanest way to integrate
 * with our backend's `POST /api/auth/google` endpoint that expects an idToken.
 *
 * This is the recommended button for signin/signup pages.
 */

import React from "react";
import { GoogleLogin } from "@react-oauth/google";

type Props = {
  onSuccess: (idToken: string) => void;
  onError?: (message: string) => void;
};

export default function GoogleCredentialButton({ onSuccess, onError }: Props) {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
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
  );
}
