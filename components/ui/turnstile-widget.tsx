"use client";

/**
 * TurnstileWidget
 * ----------------
 * A thin wrapper around the Cloudflare Turnstile JavaScript API that works
 * without any third-party npm package so we don't break the Next.js build.
 *
 * How it works:
 *  - Injects the Cloudflare Turnstile script once per page load.
 *  - Renders an invisible container div that Turnstile replaces with its widget.
 *  - Calls `onToken(token)` when a token is issued.
 *  - Calls `onExpire()` when the token expires and *resets* the widget so the
 *    checkbox reappears (a silently-expired token was the most common cause of
 *    forms whose submit button looked ready but the backend rejected with
 *    `TURNSTILE_MISSING`).
 *  - Exposes a `reset()` / `remove()` imperative handle via React.forwardRef
 *    so parent forms can reset the widget after a failed submission.
 *
 * Race fixes vs. the original implementation:
 *  - `api.js?render=explicit` fires the script `load` event when the JS bytes
 *    arrive, but `window.turnstile` (and its `render`/`reset`/`remove` methods)
 *    is attached *asynchronously* a tick later. We poll for the global instead
 *    of trusting that it exists the moment `load` fires.
 *  - When `loadScript()` resolves and a widget is *already* mounted (because
 *    the script was loaded earlier in the same SPA session by another route),
 *    React may not yet have committed the container div at the exact moment
 *    the `.then` callback runs. We retry on `requestAnimationFrame` until the
 *    container appears (bounded) instead of bailing forever.
 *  - `_turnstileLoaded` was declared on the Window interface but never set —
 *    removed. The script tag's `dataset.loaded` flag is the source of truth.
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
      isExpired?: (widgetId?: string) => boolean;
    };
  }
}

export interface TurnstileHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  siteKey: string;
  onToken: (token: string) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
  className?: string;
}

const SCRIPT_ID = "cf-turnstile-script";
const GLOBAL_READY_TIMEOUT_MS = 4000;
const GLOBAL_READY_POLL_MS = 25;
const CONTAINER_READY_MAX_TRIES = 30; // ~30 rAF frames ≈ 500ms

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") {
        // Script tag finished loading — but the global may not be attached yet.
        waitForGlobal().then(resolve).catch(reject);
        return;
      }
      const onLoaded = () => {
        existing.removeEventListener("load", onLoaded);
        existing.removeEventListener("error", onError);
        existing.dataset.loaded = "true";
        waitForGlobal().then(resolve).catch(reject);
      };
      const onError = () => {
        existing.removeEventListener("load", onLoaded);
        existing.removeEventListener("error", onError);
        reject(new Error("Turnstile script failed to load"));
      };
      existing.addEventListener("load", onLoaded);
      existing.addEventListener("error", onError);
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      waitForGlobal().then(resolve).catch(reject);
    };
    script.onerror = () => {
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(script);
  });
}

/** Poll for `window.turnstile` to be attached after the script tag has loaded. */
function waitForGlobal(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const started = Date.now();
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval);
        resolve();
        return;
      }
      if (Date.now() - started > GLOBAL_READY_TIMEOUT_MS) {
        clearInterval(interval);
        reject(new Error("Turnstile global never became available"));
      }
    }, GLOBAL_READY_POLL_MS);
  });
}

const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  ({ siteKey, onToken, onExpire, theme = "light", size = "normal", className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);
    const onExpireRef = useRef(onExpire);

    onTokenRef.current = onToken;
    onExpireRef.current = onExpire;

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch {
            /* ignore — widget may already be removed */
          }
        }
      },
    }));

    useEffect(() => {
      if (!siteKey) return;

      let mounted = true;
      let cancelled = false;

      const cleanup = () => {
        mounted = false;
        cancelled = true;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            /* ignore */
          }
        }
        widgetIdRef.current = null;
      };

      // Wait for both the script AND the container DOM node to be ready, then
      // render. Retries on rAF so a slightly-late container commit (common when
      // this widget mounts immediately after a route change in the SPA) doesn't
      // silently bail forever — the original bug.
      const renderWhenReady = (retriesLeft: number) => {
        if (cancelled) return;
        if (!mounted || !window.turnstile) return;
        if (containerRef.current) {
          // Remove any previous widget inside the container.
          if (widgetIdRef.current) {
            try {
              window.turnstile.remove(widgetIdRef.current);
            } catch {
              /* ignore */
            }
            widgetIdRef.current = null;
          }
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            size,
            callback: (token: string) => onTokenRef.current(token),
            "expired-callback": () => {
              onExpireRef.current?.();
              onTokenRef.current("");
              // Visual reset so the checkbox reappears — without this a
              // silently-expired token leaves the widget looking "done" while
              // the form thinks it has no token at all.
              if (widgetIdRef.current && window.turnstile) {
                try {
                  window.turnstile.reset(widgetIdRef.current);
                } catch {
                  /* ignore */
                }
              }
            },
            "error-callback": () => {
              onExpireRef.current?.();
              onTokenRef.current("");
              if (widgetIdRef.current && window.turnstile) {
                try {
                  window.turnstile.reset(widgetIdRef.current);
                } catch {
                  /* ignore */
                }
              }
              return true; // Tell Turnstile we handled it; don't throw.
            },
          });
          return;
        }
        if (retriesLeft > 0) {
          requestAnimationFrame(() => renderWhenReady(retriesLeft - 1));
        }
      };

      loadScript()
        .then(() => renderWhenReady(CONTAINER_READY_MAX_TRIES))
        .catch(() => {
          // Script failed to load — surface via expire so the form's submit
          // guard stays disabled and shows a sensible state.
          onExpireRef.current?.();
          onTokenRef.current("");
        });

      return cleanup;
    }, [siteKey, theme, size]);

    return <div ref={containerRef} className={className} />;
  }
);

TurnstileWidget.displayName = "TurnstileWidget";
export default TurnstileWidget;
