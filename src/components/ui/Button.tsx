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
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 cursor-pointer select-none rounded-xl";

    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md hover:shadow-primary-500/20",
      gradient:
        "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/25 hover:brightness-105",
      purple:
        "bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md hover:shadow-purple-500/20",
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80",
      outline:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm",
      ghost:
        "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      danger:
        "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-red-500/20",
      success:
        "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-emerald-500/20",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base font-semibold gap-2.5",
      xl: "h-14 px-8 text-lg font-bold gap-3 rounded-2xl",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
