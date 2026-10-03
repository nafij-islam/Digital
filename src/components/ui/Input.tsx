"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold uppercase tracking-wider text-[#AAAAC1]"
          >
            {label}
            {props.required && <span className="text-[#EF7B98] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#777790]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full h-11 sm:h-12 rounded-xl border border-[#383866]/50 bg-[#26264A] px-3.5 text-xs sm:text-sm text-[#F5F5FA] placeholder:text-[#777790] shadow-pressed transition-all duration-150 focus:bg-[#232342] focus:border-[#716DFF] focus:outline-none focus:ring-2 focus:ring-[#716DFF]/25 disabled:cursor-not-allowed disabled:opacity-60",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[#EF7B98] focus:border-[#EF7B98] focus:ring-[#EF7B98]/20",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#777790]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#EF7B98] font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-[#777790]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
