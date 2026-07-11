"use client";

import React from "react";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";
import { Shield } from "lucide-react";

interface Props {
  verified: boolean;
  turnstileRef: React.RefObject<{ reset: () => void } | null>;
  onSuccess: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
  children: React.ReactNode;
}

export function TurnstileGate({ verified, turnstileRef, onSuccess, onExpire, onError, children }: Props) {
  if (verified) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="flex flex-col items-center gap-3 text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-black text-black uppercase tracking-wide">Quick security check</h3>
        <p className="text-sm text-neutral-500">Please complete the verification below to use this tool. You&apos;ll only need to do this once per session.</p>
      </div>
      <TurnstileWidget
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={onSuccess}
        onExpire={onExpire}
        onError={onError}
      />
    </div>
  );
}
