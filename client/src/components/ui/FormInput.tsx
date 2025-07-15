import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { MdOutlineEmail } from "react-icons/md";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  icon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, type = "text",icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full mb-4">
        <label className="block text-sm font-medium text-primary-light mb-1">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`w-full px-4 py-2  rounded-md bg-secondary-darkBrand text-sm text-primary-light ${icon ?"pl-10":""}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
