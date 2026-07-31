"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, animate } from "motion/react";

export function TweenNumber({
  value,
  duration = 0.7,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useMotionValueEvent(mv, "change", (v) => setDisplay(Math.round(v)));

  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [value, mv, duration]);

  return <span className={`tabular-nums ${className ?? ""}`}>{display.toLocaleString()}</span>;
}
