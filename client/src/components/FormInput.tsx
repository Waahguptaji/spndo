// src/components/FormInput.tsx

import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FormInput({ label, ...props }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-sm font-medium text-neutral-grey1 dark:text-dark-text"
        htmlFor={props.id}
      >
        {label}
      </label>
      <input
        {...props}
        className="px-4 py-2 rounded-md border border-neutral-grey2 bg-neutral-white text-neutral-dark1
                  placeholder:text-neutral-grey2 focus:outline-none focus:ring-2 focus:ring-primary-brand
                  dark:bg-dark-bg dark:border-dark-muted dark:text-dark-text dark:placeholder-dark-muted"
      />
    </div>
  );
}
