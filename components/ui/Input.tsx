import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xl font-mukta font-semibold text-brown mb-2">
            {label}
            {required && <span className="text-red ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full rounded-input border border-black bg-cream-light px-6 py-3 text-xl font-inter text-brown placeholder:text-brown/40 placeholder:font-thin focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[52px] transition-all",
            error && "border-red focus-visible:ring-red",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red font-inter">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
