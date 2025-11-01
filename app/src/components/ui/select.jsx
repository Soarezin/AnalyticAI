import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils.js";

export function Select({ className, children, icon = true, multiple = false, ...props }) {
  return (
    <div className="relative inline-flex w-full">
      <select
        className={cn(
          "w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand",
          multiple ? "h-auto py-2" : "h-10 py-0",
          className
        )}
        multiple={multiple}
        {...props}
      >
        {children}
      </select>
      {icon && !multiple && (
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      )}
    </div>
  );
}
