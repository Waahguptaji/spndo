import React from "react";
import clsx from "clsx";

type Props = {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

const CategoryChip = ({
  label,
  icon,
  selected = false,
  onClick,
  className,
}: Props) => {
  const hasIcon = !!icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={clsx(
        "rounded-2xl border text-sm font-medium transition-colors p-4",
        "focus:outline-none focus:ring-2 focus:ring-primary-brand/60 focus:ring-offset-2",
        "dark:focus:ring-offset-neutral-dark2",
        selected
          ? "bg-primary-brand text-black border-primary-brand"
          : "bg-neutral-white dark:bg-neutral-dark2 text-neutral-dark1 dark:text-neutral-white border-neutral-softGrey1 dark:border-neutral-grey1 hover:bg-neutral-softGrey1 dark:hover:bg-neutral-dark1",
        className
      )}
    >
      <div
        className={clsx(
          "w-full",
          hasIcon
            ? "flex flex-col items-start justify-start gap-2 text-left"
            : "flex items-center justify-center text-center"
        )}
      >
        {hasIcon && <div className="text-lg leading-none">{icon}</div>}
        <div className="leading-none">{label}</div>
      </div>
    </button>
  );
};

export default CategoryChip;
