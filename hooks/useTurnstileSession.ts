"use client";

import { useRef, useState, useCallback } from "react";
import type { TurnstileHandle } from "@/components/ui/turnstile-widget";

export interface TurnstileSession {
  token: string | null;
  verified: boolean;
  turnstileRef: React.RefObject<TurnstileHandle | null>;
  onToken: (token: string) => void;
  onExpire: () => void;
  invalidate: () => void;
}

/**
 * useTurnstileSession
 * --------------------
 * Manages Cloudflare Turnstile verification state for a single tool session.
 * - `verified` becomes true once Turnstile fires a non-empty token.
 * - `onExpire` / `invalidate` reset state and call widget.reset().
 * - The ref is forwarded to <TurnstileWidget ref={turnstileRef} /> for imperative reset.
 */
export function useTurnstileSession(): TurnstileSession {
  const [token, setToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const turnstileRef = useRef<TurnstileHandle | null>(null);

  const onToken = useCallback((t: string) => {
    if (t) {
      setToken(t);
      setVerified(true);
    } else {
      // Empty string = expiry callback fired internally by the widget
      setToken(null);
      setVerified(false);
    }
  }, []);

  const onExpire = useCallback(() => {
    setToken(null);
    setVerified(false);
    turnstileRef.current?.reset();
  }, []);

  const invalidate = useCallback(() => {
    setToken(null);
    setVerified(false);
    turnstileRef.current?.reset();
  }, []);

  return { token, verified, turnstileRef, onToken, onExpire, invalidate };
}
