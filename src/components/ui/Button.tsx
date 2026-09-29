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
        "bg-primary-500 text-white hover:bg-primary-600 shadow-soft hover:shadow-raised border border-primary-600/30",
      gradient:
        "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-soft hover:shadow-raised border border-white/20 hover:brightness-105",
      purple:
        "bg-purple-600 text-white hover:bg-purple-700 shadow-soft hover:shadow-raised border border-purple-700/30",
      secondary:
        "bg-[#F7F8FB] text-slate-800 hover:bg-white shadow-soft hover:shadow-raised border border-slate-200/80 active:shadow-inset",
      "soft-raised":
        "bg-white text-slate-800 hover:bg-[#F7F8FB] shadow-soft hover:shadow-raised border border-slate-200/70",
      outline:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-xs",
      ghost:
        "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 border border-transparent",
      danger:
        "bg-red-500 text-white hover:bg-red-600 shadow-soft hover:shadow-raised border border-red-600/30",
      success:
        "bg-emerald-500 text-white hover:bg-emerald-600 shadow-soft hover:shadow-raised border border-emerald-600/30",
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
