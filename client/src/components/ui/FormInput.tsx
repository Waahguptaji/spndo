import React, { forwardRef, useState } from "react";
import { ChevronDown, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hasDropdown?: boolean;
  dropdownOptions?: { value: string; label: string }[];
  onDropdownSelect?: (value: string) => void;
  variant?: "default" | "password";
}

type InputState = "default" | "focus" | "error" | "disabled";

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      icon,
      hasDropdown = false,
      dropdownOptions = [],
      onDropdownSelect,
      variant = "default",
      disabled = false,
      className = "",
      type = "text",
      placeholder = "Example",
      value = "",
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const getCurrentState = (): InputState => {
      if (disabled) return "disabled";
      if (error) return "error";
      if (isFocused) return "focus";
      return "default";
    };

    const currentState = getCurrentState();
    // const hasContent = value && value.toString().length > 0;

    const stateStyles = {
      default: {
        border: "border-neutral-grey1",
        background: "bg-neutral-dark2",
        text: "text-white",
        placeholder: "placeholder-neutral-grey3",
      },
      focus: {
        border: "border-primary-brand ring-1 ring-primary-brand",
        background: "bg-neutral-dark2",
        text: "text-white",
        placeholder: "placeholder-neutral-grey3",
      },
      error: {
        border: "border-red-500 ring-1 ring-red-500",
        background: "bg-neutral-dark2",
        text: "text-white",
        placeholder: "placeholder-neutral-grey3",
      },
      disabled: {
        border: "border-neutral-grey1",
        background: "bg-neutral-dark2",
        text: "text-neutral-grey2",
        placeholder: "placeholder-neutral-grey3",
      },
    };

    const currentStyles = stateStyles[currentState];

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleDropdownToggle = () => {
      if (!disabled) {
        setIsDropdownOpen(!isDropdownOpen);
      }
    };

    const handleDropdownSelect = (option: { value: string; label: string }) => {
      onDropdownSelect?.(option.value);
      setIsDropdownOpen(false);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType =
      variant === "password" && !showPassword ? "password" : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div
                className={`w-5 h-5 ${
                  currentState === "error"
                    ? "text-red-500"
                    : currentState === "disabled"
                    ? "text-gray-300"
                    : "text-gray-400"
                }`}
              >
                {icon}
              </div>
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              w-full px-3 py-2.5 rounded-lg border transition-all duration-200 outline-none
              ${currentStyles.border}
              ${currentStyles.background}
              ${currentStyles.text}
              ${currentStyles.placeholder}
              ${icon ? "pl-10" : ""}
              ${hasDropdown || variant === "password" ? "pr-10" : ""}
              ${disabled ? "cursor-not-allowed" : "cursor-text"}
              ${className}
            `}
            {...props}
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {variant === "password" && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`w-5 h-5 ${
                  currentState === "disabled"
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                disabled={disabled}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}

            {hasDropdown && (
              <button
                type="button"
                onClick={handleDropdownToggle}
                className={`w-5 h-5 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                } ${
                  currentState === "error"
                    ? "text-red-500"
                    : currentState === "disabled"
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                disabled={disabled}
              >
                <ChevronDown size={20} />
              </button>
            )}
          </div>

          {hasDropdown && isDropdownOpen && dropdownOptions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {dropdownOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDropdownSelect(option)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
