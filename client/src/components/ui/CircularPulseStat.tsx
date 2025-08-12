"use client";

import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { motion, animate } from "framer-motion";

type Variant = "savings" | "expense" | "goal";

type Props = {
  amount: number;
  percentage?: number;
  label?: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const pxSize = {
  sm: { wrap: 128, core: 96, ringStroke: 8 },
  md: { wrap: 160, core: 128, ringStroke: 10 },
  lg: { wrap: 224, core: 176, ringStroke: 12 },
};

const classSize = {
  sm: { wrap: "w-32 h-32", core: "w-24 h-24", amount: "text-base" },
  md: { wrap: "w-40 h-40", core: "w-32 h-32", amount: "text-lg" },
  lg: { wrap: "w-56 h-56", core: "w-44 h-44", amount: "text-xl" },
};

const variantMap: Record<
  Variant,
  {
    coreBg: string;
    waveBorder: string;
    progressStroke: string;
    amountText: string;
  }
> = {
  savings: {
    coreBg: "bg-gradient-to-br from-primary-brand to-primary-dark",
    waveBorder: "border-primary-brand/30",
    progressStroke: "stroke-primary-brand",
    amountText: "text-neutral-white",
  },
  expense: {
    coreBg: "bg-gradient-to-br from-system-red to-system-red/80",
    waveBorder: "border-system-red/30",
    progressStroke: "stroke-system-red",
    amountText: "text-neutral-white",
  },
  goal: {
    coreBg: "bg-gradient-to-br from-system-green to-system-green/80",
    waveBorder: "border-system-green/30",
    progressStroke: "stroke-system-green",
    amountText: "text-neutral-white",
  },
};

function formatCurrency(n: number) {
  try {
    return n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
  } catch {
    return `₹${n.toLocaleString("en-IN")}`;
  }
}

const CircularPulseStat: React.FC<Props> = ({
  amount,
  percentage = 0,
  label,
  variant = "savings",
  size = "md",
  className,
}) => {
  const cs = classSize[size];
  const ps = pxSize[size];
  const v = variantMap[variant];

  const [displayAmount, setDisplayAmount] = useState(0);
  useEffect(() => {
    const controls = animate(0, amount, {
      duration: 0.7,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayAmount(latest),
    });
    return () => controls.stop();
  }, [amount]);

  const { r, circumference, dashOffset } = useMemo(() => {
    const r = ps.core / 2 - ps.ringStroke / 2; // radius inside the core circle
    const circumference = 2 * Math.PI * r;
    const clamped = Math.max(0, Math.min(percentage, 100));
    const dashOffset = circumference * (1 - clamped / 100);
    return { r, circumference, dashOffset };
  }, [ps.core, ps.ringStroke, percentage]);

  return (
    <div className={clsx("flex flex-col items-center gap-3", className)}>
      {/* Wave + Core wrapper */}
      <div className={clsx("relative", cs.wrap)}>
        {/* Radiating waves (smooth fade-in/out to avoid pop) */}
        {[0, 0.6, 1.2].map((delay, i) => (
          <motion.span
            key={i}
            className={clsx(
              "absolute inset-0 rounded-full border-4",
              v.waveBorder
            )}
            // Start invisible; fade in a bit, then fade out
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.6], opacity: [0, 0.25, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
              delay,
              // optional gap so the re-start is less noticeable
              repeatDelay: 0.1,
            }}
          />
        ))}

        {/* Core circle */}
        <motion.div
          className={clsx(
            "absolute inset-1 m-auto rounded-full flex items-center justify-center shadow-lg",
            "text-center select-none",
            cs.core,
            v.coreBg
          )}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width={ps.core}
            height={ps.core}
            className="absolute"
            viewBox={`0 0 ${ps.core} ${ps.core}`}
          >
            {/* Track: neutral, readable on gradients (light/dark) */}
            <circle
              cx={ps.core / 2}
              cy={ps.core / 2}
              r={r}
              className="stroke-white/30 dark:stroke-white/15"
              strokeWidth={ps.ringStroke}
              fill="none"
            />
            {/* Progress: variant color */}
            <motion.circle
              cx={ps.core / 2}
              cy={ps.core / 2}
              r={r}
              className={clsx(v.progressStroke)}
              strokeWidth={ps.ringStroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              transform={`rotate(-90 ${ps.core / 2} ${ps.core / 2})`}
            />
          </svg>

          <div className="flex flex-col items-center leading-none">
            <div className={clsx("font-bold", cs.amount, v.amountText)}>
              {formatCurrency(Math.round(displayAmount))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtitle/Info */}
      <div className="text-center">
        {label ? (
          <p className="text-sm text-neutral-dark1 dark:text-neutral-white font-medium">
            {label}
          </p>
        ) : null}
        {typeof percentage === "number" ? (
          <p className="text-xs text-neutral-grey2 dark:text-neutral-grey3 mt-1">
            {Math.max(0, Math.min(percentage, 100))}% of your budget
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default CircularPulseStat;
