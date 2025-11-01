import React from "react";
import { cn } from "../../lib/utils.js";

export function Badge({ variant = "default", className, ...props }) {
  const variants = {
    default: "bg-indigo-100 text-indigo-800",
    outline: "border border-slate-200 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        variants[variant] ?? variants.default,
        className
      )}
      {...props}
    />
  );
}
