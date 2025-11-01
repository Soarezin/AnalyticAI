import React from "react";
import { cn } from "../../lib/utils.js";

export const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
