import { useEffect, useState } from "react";

/**
 * Countdown for "resend email" buttons. `start()` begins a countdown of
 * `seconds`; `left` reaches 0 and stops automatically.
 */
export function useCountdown(seconds = 60) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [left]);

  return {
    left,
    active: left > 0,
    start: () => setLeft(seconds),
  };
}
