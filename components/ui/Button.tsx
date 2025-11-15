import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 rounded-pill font-mukta font-extrabold transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-card border-2 border-black",
          // Variants
          {
            "bg-yellow text-brown hover:bg-yellow/90": variant === "primary",
            "bg-green text-white hover:bg-green/90": variant === "secondary",
            "bg-red text-white hover:bg-red/90": variant === "danger",
            "bg-transparent border-brown text-brown hover:bg-brown/5":
              variant === "outline",
          },
          // Sizes
          {
            "px-6 py-2 text-base h-12": size === "sm",
            "px-8 py-3 text-2xl h-14": size === "md",
            "px-10 py-4 text-3xl h-16": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
