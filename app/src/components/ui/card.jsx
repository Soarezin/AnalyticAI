import React from "react";
import { cn } from "../../lib/utils.js";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-semibold text-slate-900", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("space-y-3 text-sm text-slate-600", className)} {...props} />;
}
