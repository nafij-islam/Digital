import React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "danger"
    | "purple"
    | "cyan"
    | "pink";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "primary",
  size = "md",
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    primary: "bg-blue-50 text-blue-700 border-blue-200/80",
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
    outline: "border-slate-300 text-slate-700 bg-white",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    warning: "bg-amber-50 text-amber-700 border-amber-200/80",
    danger: "bg-rose-50 text-rose-700 border-rose-200/80",
    purple: "bg-purple-50 text-purple-700 border-purple-200/80",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
    pink: "bg-pink-50 text-pink-700 border-pink-200/80",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1 font-semibold",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3 py-1.5 gap-2 font-medium",
  };

  const dotColors = {
    primary: "bg-blue-500",
    secondary: "bg-slate-400",
    outline: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
    pink: "bg-pink-500",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border shadow-2xs transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0 animate-pulse", dotColors[variant])} />
      )}
      {children}
    </div>
  );
};
