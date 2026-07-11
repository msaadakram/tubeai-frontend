"use client";

/**
 * TurnstileWidget
 * ----------------
 * A thin wrapper around the Cloudflare Turnstile JavaScript API that works
 * without any third-party npm package so we don’t break the Next.js build.
 *
 * How it works:
 *  - Injects the Cloudflare Turnstile script once per page load.
 *  - Renders an invisible container div that Turnstile replaces with its widget.
 *  - Calls `onToken(token)` when a token is issued.
 *  - Calls `onExpire()` when the token expires (token becomes empty string).
 *  - Exposes a `reset()` imperative handle via React.forwardRef so parent forms
 *    can reset the widget after a failed submission.
 *
 * Usage:
 *   const ref = useRef<TurnstileHandle>(null);
 *   <TurnstileWidget siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
 *     onToken={(t) => setToken(t)}
 *     onExpire={() => setToken('')}
 *     ref={ref}
 *   />
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    _turnstileLoaded?: boolean;
  }
}

export interface TurnstileHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  siteKey: string;
  onToken: (token: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  className?: string;
}

const SCRIPT_ID = 'cf-turnstile-script';

function loadScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window._turnstileLoaded || document.getElementById(SCRIPT_ID)) {
      // Script already loading or loaded—wait for it.
      if (window.turnstile) { resolve(); return; }
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (existing) { existing.addEventListener('load', () => resolve()); return; }
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => { window._turnstileLoaded = true; resolve(); };
    document.head.appendChild(script);
  });
}

const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  ({ siteKey, onToken, onExpire, theme = 'light', size = 'normal', className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    useEffect(() => {
      if (!siteKey) return;

      let mounted = true;

      loadScript().then(() => {
        if (!mounted || !containerRef.current || !window.turnstile) return;
        // Remove any previous widget inside the container.
        if (widgetIdRef.current) {
          try { window.turnstile.remove(widgetIdRef.current); } catch {}
        }
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: (token: string) => onToken(token),
          'expired-callback': () => { onExpire?.(); onToken(''); },
          'error-callback': () => { onExpire?.(); onToken(''); },
        });
      });

      return () => {
        mounted = false;
        if (widgetIdRef.current && window.turnstile) {
          try { window.turnstile.remove(widgetIdRef.current); } catch {}
          widgetIdRef.current = null;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey]);

    return <div ref={containerRef} className={className} />;
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';
export default TurnstileWidget;
