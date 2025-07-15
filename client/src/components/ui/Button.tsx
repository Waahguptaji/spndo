// src/components/Button.tsx

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "social";
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "text-sm font-medium px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-1";
  const fullWidthStyle = fullWidth ? "w-full" : "";

  const variants: Record<string, string> = {
    primary: "bg-primary-green text-white hover:bg-primary.dark dark:bg-primary-green dark:hover:bg-primary.dark",
    ghost: "bg-transparent text-primary-green hover:bg-neutral-softGrey1 dark:text-primary-green dark:hover:bg-neutral-dark2",
    outline:
      "border border-primary-green text-primary-green hover:bg-neutral-softGrey1 dark:hover:bg-neutral-dark2",
    social: " flex items-center justify-center rounded-md bg-secondary-blueLight",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        fullWidthStyle,
        className
      )}
      {...props}
    />
  );
}
