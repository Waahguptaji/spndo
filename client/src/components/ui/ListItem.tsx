"use client";

import React from "react";

// Interface defining all possible props for the ListItem component
interface ListItemProps {
  variant: "notification" | "goal" | "transaction" | "reminder";
  icon?: React.ReactNode;
  title: string;
  description?: string;
  date?: string;
  amount?: string;
  rightLabel?: string;
  progress?: { current: number; total: number };
  status?: string;
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
}

// Base classes for the main container, applied to ALL variants for consistency.
const baseContainerClasses =
  "p-4 rounded-xl bg-neutral-white dark:bg-neutral-dark2 w-full";

const formatStatusLabel = (value: string) =>
  value
    .split(" ")
    .map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word,
    )
    .join(" ");

const formatInr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const ListItem: React.FC<ListItemProps> = ({
  variant,
  icon,
  title,
  description,

  date,
  amount,
  rightLabel,
  progress,
  status = "",
  icon1 = null,
  icon2 = null,
}) => {
  // Notification Variant
  if (variant === "notification") {
    return (
      <div
        className={`${baseContainerClasses} gap-2 shadow-md border border-neutral-softGrey1 p-2 rounded-lg dark:border-none`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {" "}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neutral-softGrey3 dark:bg-neutral-grey1 flex items-center justify-center">
              {icon}
            </div>
            <div className="min-w-0">
              {" "}
              <div
                className="text-neutral-dark1 dark:text-neutral-white font-semibold truncate"
                title={title}
              >
                {" "}
                {title}
              </div>
              {description && (
                <div
                  className="text-xs text-neutral-grey2 dark:text-neutral-grey3 truncate"
                  title={description}
                >
                  {" "}
                  {description}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {" "}
            {rightLabel && (
              <div className="text-xs text-neutral-grey2 dark:text-neutral-grey3">
                {rightLabel}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Goal Variant
  if (variant === "goal") {
    return (
      <div className={baseContainerClasses}>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neutral-softGrey3 dark:bg-neutral-grey1 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-grow min-w-0">
            {" "}
            <div className="flex justify-between text-neutral-dark1 dark:text-neutral-white font-semibold truncate">
              {" "}
              <span className="flex gap-2">
                <span>{title}</span>
                {(icon1 || icon2) && (
                  <span className="flex text-xs text-neutral-grey2 dark:text-neutral-grey3 gap-2">
                    {icon1 && <span>{icon1}</span>}
                    {icon2 && <span>{icon2}</span>}
                  </span>
                )}
              </span>
              <span className="text-md text-neutral-grey2 dark:text-neutral-grey3">
                {formatStatusLabel(status)}
              </span>
            </div>
            {progress && (
              <div>
                <div className="w-full bg-neutral-grey2 dark:bg-neutral-grey1 h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-primary-brand h-2 rounded-full"
                    style={{
                      width: `${(progress.current / progress.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-grey2 dark:text-neutral-grey3 mt-1">
                  <span>{formatInr(progress.current)}</span>
                  <span>{formatInr(progress.total)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Transaction Variant
  if (variant === "transaction") {
    return (
      <div className={baseContainerClasses}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {" "}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neutral-softGrey3 dark:bg-neutral-grey1 flex items-center justify-center">
              {icon}
            </div>
            <div className="min-w-0">
              {" "}
              <div className="text-neutral-dark1 dark:text-neutral-white font-semibold truncate">
                {" "}
                {title}
              </div>
              {date && (
                <div className="text-xs text-neutral-grey2 dark:text-neutral-grey3">
                  {date}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {" "}
            {amount && (
              <div
                className={`font-semibold ${
                  amount.toString().startsWith("-")
                    ? "text-system-red"
                    : "text-system-green"
                }`}
              >
                {amount}
              </div>
            )}
            {description && (
              <div className="text-xs text-neutral-grey2 dark:text-neutral-grey3">
                {description}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Reminder Variant
  if (variant === "reminder") {
    return (
      <div
        className={`${baseContainerClasses} gap-2 shadow-md border border-neutral-softGrey1 p-2 rounded-lg dark:border-none`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col min-w-0">
            {" "}
            {description && (
              <div className="text-xs text-neutral-grey2 dark:text-neutral-grey3">
                {description}
              </div>
            )}
            <div className="text-neutral-dark1 dark:text-neutral-white font-semibold mt-1 truncate">
              {" "}
              {title}
            </div>
            {amount && (
              <div className="text-xs text-neutral-grey2 dark:text-neutral-grey3 mt-1">
                {amount}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {" "}
            <button className="text-neutral-grey2 dark:text-neutral-grey3 hover:text-neutral-dark1 dark:hover:text-neutral-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
            <div className="text-xs text-neutral-grey2 dark:text-neutral-grey3 text-right mt-2">
              Due on
              <br />
              {rightLabel}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback in case a variant is not matched
  return null;
};

export default ListItem;
