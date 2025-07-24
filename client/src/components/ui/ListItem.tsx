"use client";

import Image from "next/image";
import React from "react";

// Interface defining all possible props for the ListItem component
interface ListItemProps {
  variant: "notification" | "goal" | "transaction" | "reminder";
  icon?: string; // Should be the path to the icon in /public
  title: string;
  description?: string;
  date?: string;
  amount?: string;
  rightLabel?: string;
  progress?: { current: number; total: number };
}

// Base classes for the main container, applied to ALL variants for consistency.
const baseContainerClasses =
  "p-4 rounded-xl bg-neutral-white dark:bg-neutral-dark2 w-full";

const ListItem: React.FC<ListItemProps> = ({
  variant,
  icon,
  title,
  description,
  date,
  amount,
  rightLabel,
  progress,
}) => {
  // Notification Variant
  if (variant === "notification") {
    return (
      <div className={baseContainerClasses}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {" "}
            {/* ACTION: Added min-w-0 */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neutral-grey3 dark:bg-neutral-grey1 flex items-center justify-center">
              {icon && <Image src={icon} alt={title} width={28} height={28} />}
            </div>
            <div className="min-w-0">
              {" "}
              {/* ACTION: Added min-w-0 */}
              <div className="text-neutral-dark1 dark:text-neutral-white font-semibold truncate">
                {" "}
                {/* ACTION: Added truncate */}
                {title}
              </div>
              {description && (
                <div className="text-xs text-neutral-grey2 dark:text-neutral-grey3 truncate">
                  {" "}
                  {/* ACTION: Added truncate */}
                  {description}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {" "}
            {/* ACTION: Added flex-shrink-0 */}
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
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neutral-grey3 dark:bg-neutral-grey1 flex items-center justify-center">
            {icon && <Image src={icon} alt={title} width={28} height={28} />}
          </div>
          <div className="flex-grow min-w-0">
            {" "}
            {/* ACTION: Added min-w-0 */}
            <div className="text-neutral-dark1 dark:text-neutral-white font-semibold truncate">
              {" "}
              {/* ACTION: Added truncate */}
              {title}
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
                  <span>${progress.current.toLocaleString()}</span>
                  <span>${progress.total.toLocaleString()}</span>
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
            {/* ACTION: Added min-w-0 */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neutral-grey3 dark:bg-neutral-grey1 flex items-center justify-center">
              {icon && <Image src={icon} alt={title} width={28} height={28} />}
            </div>
            <div className="min-w-0">
              {" "}
              {/* ACTION: Added min-w-0 */}
              <div className="text-neutral-dark1 dark:text-neutral-white font-semibold truncate">
                {" "}
                {/* ACTION: Added truncate */}
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
            {/* ACTION: Added flex-shrink-0 */}
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
      <div className={baseContainerClasses}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col min-w-0">
            {" "}
            {/* ACTION: Added min-w-0 */}
            {description && (
              <div className="text-xs text-neutral-grey2 dark:text-neutral-grey3">
                {description}
              </div>
            )}
            <div className="text-neutral-dark1 dark:text-neutral-white font-semibold mt-1 truncate">
              {" "}
              {/* ACTION: Added truncate */}
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
            {/* ACTION: Added flex-shrink-0 */}
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
