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
    primary:
      "bg-primary-brand text-black hover:bg-primary-dark focus:ring-primary-brand",
    ghost:
      "bg-transparent text-primary-brand hover:bg-neutral-softGrey1 dark:text-primary-brand dark:hover:bg-neutral-dark2 focus:ring-primary-brand",
    outline:
      "border border-primary-green text-primary-green hover:bg-neutral-softGrey1 dark:hover:bg-neutral-dark2 focus:ring-primary-brand focus:ring-primary-brand",
    social:
      " flex w-20 h-12 dark:bg-neutral-grey1 bg-neutral-white rounded-xl shadow-sm flex items-center justify-center hover:bg-neutral-grey2 transition",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], fullWidthStyle, className)}
      {...props}
    />
  );
}
