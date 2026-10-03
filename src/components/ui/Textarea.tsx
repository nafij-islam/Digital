"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, rows = 3, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono font-bold uppercase tracking-wider text-[#AAAAC1]"
          >
            {label}
            {props.required && <span className="text-[#EF7B98] ml-0.5">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full rounded-2xl border border-[#353560]/40 bg-[#29294D] px-4 py-3 text-xs sm:text-sm text-[#F5F5FA] placeholder:text-[#777790] shadow-neu-pressed transition-all duration-200 focus:border-[#716DFF] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#EF7B98] focus:border-[#EF7B98]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#EF7B98] font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-[#777790]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
