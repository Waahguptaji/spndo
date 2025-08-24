"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
  onMoreOptions?: () => void;
  actionSlot?: React.ReactNode;
  showMoreButton?: boolean;
  // New: make the whole card act like a link/button
  href?: string; // route to navigate on click (e.g., "/budget")
  onCardClick?: (e: React.MouseEvent<HTMLDivElement>) => void; // custom click (e.g., open modal)
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  children,
  onMoreOptions,
  actionSlot,
  showMoreButton,
  href,
  onCardClick,
}) => {
  const router = useRouter();
  const isClickable = Boolean(href || onCardClick);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isClickable) return;
    onCardClick?.(e);
    if (e.defaultPrevented) return; // allow parent to cancel navigation
    if (href) router.push(href);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // simulate click
      const evt = new MouseEvent("click", { bubbles: true });
      e.currentTarget.dispatchEvent(evt);
    }
  };

  const shouldShowDefaultMore =
    !actionSlot && (showMoreButton ?? Boolean(onMoreOptions));

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={handleKey}
      className={[
        "bg-neutral-white dark:bg-neutral-dark2 p-6 rounded-xl shadow-md",
        "border border-neutral-softGrey1 dark:border-neutral-grey1",
        isClickable
          ? "cursor-pointer hover:bg-neutral-softGrey2/40 dark:hover:bg-neutral-dark1/40 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-brand"
          : "",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-dark1 dark:text-neutral-white">
          {title}
        </h3>

        {/* Right-side actions (clicks here won't bubble to card) */}
        {actionSlot ? (
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {actionSlot}
          </div>
        ) : shouldShowDefaultMore ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoreOptions?.();
            }}
            className="p-2 rounded-lg hover:bg-neutral-softGrey1 dark:hover:bg-neutral-grey1 transition-colors duration-200 text-neutral-grey2 dark:text-neutral-grey3 hover:text-neutral-dark1 dark:hover:text-neutral-white"
            aria-label="More options"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Content */}
      <div className="text-neutral-dark2 dark:text-neutral-grey3">
        {children}
      </div>
    </div>
  );
};

export default WidgetCard;
