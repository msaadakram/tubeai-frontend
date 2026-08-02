"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import TurnstileWidget from "@/components/ui/turnstile-widget";
import { useTurnstileSession } from "@/lib/turnstile/TurnstileSessionProvider";

interface ToolTurnstileProps {
  /**
   * Action verb used in the inline hint when the widget is unsolved, e.g.
   * "Complete the check above to {actionLabel}." Falls back to "use this tool".
   */
  actionLabel?: string;
  /** Compact rendering for cramped tool cards. Defaults to "normal". */
  size?: "normal" | "compact";
  /** Optional className override for the outer wrapper. */
  className?: string;
}

/**
 * ToolTurnstile
 * -------------
 * Inline Cloudflare Turnstile challenge rendered inside a tool's input
 * `<ToolCard>`, directly above the primary action button. Replaces the
 * full-page `<TurnstileGate>` interstitial that previously wrapped every
 * tool page.
 *
 * - Reads/writes the single shared app-level session from
 *   `<TurnstileSessionProvider>`, so a user solves the challenge once per
 *   browser session and any number of tool pages can call `useTurnstileHeader`
 *   to attach the verified session id to their `fetch` calls.
 * - Renders nothing when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset (dev) —
 *   matching the backend's permissive `if (!secretKey) skip` mode.
 * - Visual pattern matches forgot/reset-password: single bordered frame,
 *   Required → Verified chip in the label row, hint copy when pending.
 */
export function ToolTurnstile({
  actionLabel = "use this tool",
  size = "normal",
  className = "",
}: ToolTurnstileProps) {
  const { verified, siteKey, turnstileRef, onToken, onExpire, error } =
    useTurnstileSession();

  // No site key configured (dev) → render nothing, treat as always-verified.
  if (!siteKey) return null;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-neutral-500">
          Security check
        </label>
        {verified ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-neutral-400">
            <ShieldCheck className="w-3 h-3" /> Required
          </span>
        )}
      </div>

      <div className="mt-1 flex w-full justify-start">
        <TurnstileWidget
          ref={turnstileRef}
          siteKey={siteKey}
          onToken={onToken}
          onExpire={onExpire}
          theme="light"
          size={size}
          className="overflow-hidden rounded-lg border-2 border-black"
        />
      </div>

      {/* Inline hint or error.永远是last child so card height is stable. */}
      {error ? (
        <p className="mt-1 text-[11px] text-red-600 font-bold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      ) : (
        !verified && (
          <p className="mt-1 text-[11px] text-neutral-500 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-yellow-600 shrink-0" />
            Complete the check above to {actionLabel}.
          </p>
        )
      )}

      {/* When verified, keep a tiny slot so the card height doesn't collapse
          the moment the hint disappears. */}
      {verified && !error && <span className="block h-[1px]" aria-hidden />}
    </div>
  );
}

export default ToolTurnstile;
