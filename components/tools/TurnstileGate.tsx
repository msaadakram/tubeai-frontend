"use client";

import React from "react";
import { Shield } from "lucide-react";
import { motion } from "motion/react";
import TurnstileWidget from "@/components/ui/turnstile-widget";
import { useTurnstileSession } from "@/hooks/useTurnstileSession";

interface TurnstileGateProps {
  children: React.ReactNode;
}

/**
 * TurnstileGate
 * --------------
 * Self-contained gate component — manages its own verification state via
 * useTurnstileSession. Renders a Cloudflare Turnstile challenge when
 * the user has not yet verified. Once verified it renders children transparently.
 *
 * Drop this around any content that should be bot-protected. The hero,
 * navbar, and footer remain visible regardless of verification state.
 *
 * Design system: neobrutalist — black borders, red accents, bold typography.
 */
export function TurnstileGate({ children }: TurnstileGateProps) {
  const { verified, turnstileRef, onToken, onExpire } = useTurnstileSession();

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // If no site key is configured (e.g. local dev without .env), let through.
  if (!siteKey) return <>{children}</>;

  if (verified) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-20 sm:py-28 gap-8"
    >
      {/* Card */}
      <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-auto">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>

        {/* Copy */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full border-2 border-black mb-3">
            Security Check
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight mb-2">
            Verify you&apos;re human
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Complete the quick check below to unlock this tool. You&apos;ll only need to do this once per session.
          </p>
        </div>

        {/* Widget */}
        <TurnstileWidget
          ref={turnstileRef}
          siteKey={siteKey}
          onToken={onToken}
          onExpire={onExpire}
          theme="light"
          size="normal"
        />

        {/* Footer note */}
        <p className="text-[10px] text-neutral-400 text-center">
          Protected by{" "}
          <span className="font-black text-black">Cloudflare Turnstile</span>
          {" "}· No cookies · No tracking
        </p>
      </div>
    </motion.div>
  );
}
