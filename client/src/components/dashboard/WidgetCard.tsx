import React from "react";

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
  onMoreOptions?: () => void;
  actionSlot?: React.ReactNode;
  showMoreButton?: boolean;
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  children,
  onMoreOptions,
  actionSlot,
  showMoreButton,
}) => {
  const shouldShowDefaultMore =
    !actionSlot && (showMoreButton ?? Boolean(onMoreOptions));

  return (
    <div className="bg-neutral-white dark:bg-neutral-dark2 p-6 rounded-xl shadow-md border border-neutral-softGrey1 dark:border-neutral-grey1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-dark1 dark:text-neutral-white">
          {title}
        </h3>

        {/* Right-side actions */}
        {actionSlot ? (
          <div className="flex items-center gap-2">{actionSlot}</div>
        ) : shouldShowDefaultMore ? (
          <button
            onClick={onMoreOptions}
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
