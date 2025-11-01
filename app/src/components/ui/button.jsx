import React from "react";
import { cn } from "../../lib/utils.js";

const baseStyles =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

const variants = {
  default: "bg-brand text-white hover:bg-indigo-600",
  outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100",
  ghost: "text-slate-600 hover:bg-slate-100",
  secondary: "bg-slate-900 text-white hover:bg-slate-800"
};

export const Button = React.forwardRef(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        ref={ref}
        className={cn(baseStyles, variants[variant] ?? variants.default, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
