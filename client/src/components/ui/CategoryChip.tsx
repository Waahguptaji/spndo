import React from "react";
import clsx from "clsx";

type Props = {
  label: string;
  icon: React.ReactNode;
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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary-brand/60 focus:ring-offset-2",
        "dark:focus:ring-offset-neutral-dark2",
        selected
          ? "bg-primary-brand text-black border-primary-brand"
          : "bg-neutral-white dark:bg-neutral-dark2 text-neutral-dark1 dark:text-neutral-white border-neutral-softGrey1 dark:border-neutral-grey1 hover:bg-neutral-softGrey1 dark:hover:bg-neutral-dark1",
        className
      )}
    >
      <span className="text-base leading-none">{icon}</span>
      <span className="leading-none">{label}</span>
    </button>
  );
};

export default CategoryChip;
