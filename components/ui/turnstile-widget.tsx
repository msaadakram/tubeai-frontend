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
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      const onLoaded = () => {
        existing.removeEventListener('load', onLoaded);
        existing.removeEventListener('error', onError);
        resolve();
      };
      const onError = () => {
        existing.removeEventListener('load', onLoaded);
        existing.removeEventListener('error', onError);
        reject(new Error('Turnstile script failed to load'));
      };
      existing.addEventListener('load', onLoaded);
      existing.addEventListener('error', onError);
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Turnstile script failed to load'));
    };
    document.head.appendChild(script);
  });
}

const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  ({ siteKey, onToken, onExpire, theme = 'light', size = 'normal', className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);
    const onExpireRef = useRef(onExpire);

    onTokenRef.current = onToken;
    onExpireRef.current = onExpire;

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
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => {
            onExpireRef.current?.();
            onTokenRef.current('');
          },
          'error-callback': () => {
            onExpireRef.current?.();
            onTokenRef.current('');
          },
        });
      });

      return () => {
        mounted = false;
        if (widgetIdRef.current && window.turnstile) {
          try { window.turnstile.remove(widgetIdRef.current); } catch {}
          widgetIdRef.current = null;
        }
      };
    }, [siteKey, theme, size]);

    return <div ref={containerRef} className={className} />;
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';
export default TurnstileWidget;
