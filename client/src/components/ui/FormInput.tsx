"use client";

import React, { forwardRef, useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leadingIcon?: React.ReactNode; // head
  trailingIcon?: React.ReactNode; // tail
  onTrailingClick?: () => void;
  suffixText?: string | React.ReactNode; // small "value" chip
  hasDropdown?: boolean;
  icon?: React.ReactNode;
  dropdownOptions?: { value: string; label: string }[];
  onDropdownSelect?: (value: string) => void;
  variant?: "default" | "password";
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    {
     
      label,
      error,
      leadingIcon,
      trailingIcon,
      onTrailingClick,
      suffixText,
      hasDropdown = false,
      dropdownOptions = [],
      onDropdownSelect,
      variant = "default",
      disabled = false,
      className = "",
      type = "text",
      ...props
    },
    ref
  ) {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);

    const state = disabled
      ? "disabled"
      : error
      ? "error"
      : focused
      ? "focus"
      : "default";

    const base =
      "w-full rounded-lg border outline-none transition-all duration-150 py-2.5";
    const colors =
      state === "disabled"
        ? "bg-neutral-softGrey2 dark:bg-neutral-dark2 text-neutral-grey2 dark:text-neutral-grey2 border-neutral-softGrey1 dark:border-neutral-grey1 cursor-not-allowed"
        : state === "error"
        ? "bg-neutral-white dark:bg-neutral-dark2 text-neutral-dark1 dark:text-white border-system-red ring-1 ring-system-red"
        : state === "focus"
        ? "bg-neutral-white dark:bg-neutral-dark2 text-neutral-dark1 dark:text-white border-primary-brand ring-1 ring-primary-brand"
        : "bg-neutral-white dark:bg-neutral-dark2 text-neutral-dark1 dark:text-white border-neutral-softGrey1 dark:border-neutral-grey1";

    const placeholder =
      "placeholder-neutral-grey2 dark:placeholder-neutral-grey3";

    const hasTail =
      !!suffixText || !!trailingIcon || hasDropdown || variant === "password";
    const paddingLeft = leadingIcon ? "pl-10" : "pl-3";
    const paddingRight = hasTail ? "pr-28" : "pr-3";

    const inputType =
      variant === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block mb-2 text-sm font-medium text-neutral-dark1 dark:text-neutral-white">
            {label}
          </label>
        )}

        <div className="relative">
          {leadingIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-grey2 dark:text-neutral-grey3 pointer-events-none">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            aria-invalid={!!error}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={[
              base,
              colors,
              placeholder,
              paddingLeft,
              paddingRight,
            ].join(" ")}
            {...props}
          />

          {hasTail && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {suffixText && (
                <span className="px-2 py-0.5 text-xs rounded-md bg-neutral-softGrey2 dark:bg-neutral-dark1 text-neutral-grey3">
                  {suffixText}
                </span>
              )}

              {trailingIcon && (
                <button
                  type="button"
                  onClick={onTrailingClick}
                  disabled={disabled}
                  className="text-neutral-grey2 dark:text-neutral-grey3 hover:text-neutral-dark1 dark:hover:text-neutral-white disabled:opacity-50"
                >
                  {trailingIcon}
                </button>
              )}

              {variant === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  disabled={disabled}
                  className="text-neutral-grey2 dark:text-neutral-grey3 hover:text-neutral-dark1 dark:hover:text-neutral-white disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}

              {hasDropdown && (
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  disabled={disabled}
                  className="text-neutral-grey2 dark:text-neutral-grey3 hover:text-neutral-dark1 dark:hover:text-neutral-white disabled:opacity-50"
                  aria-haspopup="listbox"
                  aria-expanded={open}
                >
                  <ChevronDown size={18} />
                </button>
              )}
            </div>
          )}

          {hasDropdown && open && dropdownOptions.length > 0 && (
            <div className="absolute z-50 mt-2 w-full rounded-lg border bg-neutral-white dark:bg-neutral-dark2 border-neutral-softGrey1 dark:border-neutral-grey1 shadow-lg overflow-hidden">
              {dropdownOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  onClick={() => {
                    onDropdownSelect?.(opt.value);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-softGrey2 dark:hover:bg-neutral-dark1 text-neutral-dark1 dark:text-neutral-white"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-system-red">{error}</p>}
      </div>
    );
  }
);

export default FormInput;
