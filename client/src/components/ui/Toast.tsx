import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { CheckCircle, Info, XCircle } from "lucide-react";

type ToastProps = {
  open: boolean;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
};

const typeStyles = {
  success: "bg-primary-dark text-white border-primary-dark",
  error: "bg-system-red text-white border-system-red",
  info: "bg-system-green text-black border-system-green",
};

const typeIcons = {
  success: <CheckCircle className="w-5 h-5 mr-2" />,
  error: <XCircle className="w-5 h-5 mr-2" />,
  info: <Info className="w-5 h-5 mr-2" />,
};

const Toast: React.FC<ToastProps> = ({
  open,
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
    if (open) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for transition to finish
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={clsx(
        // Responsive bottom: more space on mobile for navbar
        "fixed bottom-20 sm:bottom-8 left-1/2 z-50 -translate-x-1/2 px-2 w-full flex justify-center",
        "transition-all duration-300 ease-in-out",
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-8 pointer-events-none"
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl border font-semibold text-base",
          "dark:shadow-black/40",
          "w-full max-w-xs sm:max-w-md",
          typeStyles[type]
        )}
        role="status"
        aria-live="polite"
      >
        {typeIcons[type]}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
