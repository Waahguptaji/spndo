import React, { useEffect } from "react";
import clsx from "clsx";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  className,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    // Backdrop handles close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Dialog stops bubbling so inside clicks don't close */}
      <div
        className={clsx(
          "bg-neutral-white dark:bg-neutral-dark2 rounded-xl shadow-xl  w-full max-w-md mx-4",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-lg font-semibold mb-4 text-neutral-dark1 dark:text-neutral-white">
            {title}
          </h2>
        )}
        <div>{children}</div>
        {actions && (
          <div className="mt-6 flex justify-end gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
