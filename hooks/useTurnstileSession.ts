"use client";

import { useRef, useState, useCallback } from "react";

export function useTurnstileSession() {
  const [token, setToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const turnstileRef = useRef<{ reset: () => void } | null>(null);

  const onSuccess = useCallback((t: string) => {
    setToken(t);
    setVerified(true);
  }, []);

  const onExpire = useCallback(() => {
    setToken(null);
    setVerified(false);
    turnstileRef.current?.reset();
  }, []);

  const onError = useCallback(() => {
    setToken(null);
    setVerified(false);
  }, []);

  const invalidate = useCallback(() => {
    setToken(null);
    setVerified(false);
    turnstileRef.current?.reset();
  }, []);

  return { token, verified, turnstileRef, onSuccess, onExpire, onError, invalidate };
}
