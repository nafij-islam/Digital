"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "gradient"
    | "secondary"
    | "soft-raised"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "purple";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-bold tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 active:scale-[0.98] active:shadow-pressed disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#5754D8] to-[#716DFF] text-white hover:brightness-110 shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px] border border-[#716DFF]/30",
      gradient:
        "bg-gradient-to-r from-[#5754D8] via-[#716DFF] to-[#8682FF] text-white shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px]",
      purple:
        "bg-[#5754D8] text-white hover:bg-[#716DFF] shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px]",
      secondary:
        "bg-[#303057] text-[#F5F5FA] hover:bg-[#353560] shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px] border border-[#383866]/30",
      "soft-raised":
        "bg-[#303057] text-[#F5F5FA] hover:bg-[#353560] shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px] border border-[#383866]/40",
      outline:
        "border border-[#383866] bg-[#2C2C52] text-[#F5F5FA] hover:bg-[#303057] shadow-raised-sm active:shadow-pressed active:translate-y-[1px]",
      ghost:
        "text-[#AAAAC1] hover:text-[#F5F5FA] hover:bg-[#303057]/60 active:shadow-pressed border border-transparent",
      danger:
        "bg-[#EF7B98] text-white hover:brightness-110 shadow-raised active:shadow-pressed active:translate-y-[1px]",
      success:
        "bg-[#6CD6B3] text-[#1E1E38] font-bold hover:brightness-110 shadow-raised active:shadow-pressed active:translate-y-[1px]",
    };

    const sizes = {
      sm: "h-8.5 px-3 text-xs gap-1.5 rounded-lg",
      md: "h-10 sm:h-11 px-4 text-xs sm:text-sm gap-2 rounded-xl",
      lg: "h-12 sm:h-12.5 px-6 text-sm sm:text-base gap-2.5 rounded-xl",
      xl: "h-13 sm:h-14 px-8 text-base sm:text-lg gap-3 rounded-2xl",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
