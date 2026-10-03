"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  hint?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full appearance-none rounded-2xl border border-[#353560]/40 bg-[#29294D] px-4 py-2.5 pr-10 text-xs sm:text-sm text-[#F5F5FA] shadow-neu-pressed transition-all duration-200 focus:border-[#716DFF] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-[#EF7B98] text-[#EF7B98]",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-[#29294D] text-[#F5F5FA]">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute right-3.5 flex items-center text-[#AAAAC1]">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs text-[#EF7B98] font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-[#777790]">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
