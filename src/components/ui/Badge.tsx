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
    primary: "bg-[#353560] text-[#F5F5FA] border border-[#716DFF]/30 shadow-raised-sm",
    secondary: "bg-[#2C2C52] text-[#AAAAC1] border border-[#383866]/40 shadow-raised-sm",
    outline: "border border-[#383866] text-[#AAAAC1] bg-transparent",
    success: "bg-[#2C2C52] text-[#6CD6B3] border border-[#6CD6B3]/30 shadow-raised-sm",
    warning: "bg-[#2C2C52] text-[#F59E0B] border border-[#F59E0B]/30 shadow-raised-sm",
    danger: "bg-[#2C2C52] text-[#EF7B98] border border-[#EF7B98]/30 shadow-raised-sm",
    purple: "bg-[#5754D8]/25 text-[#716DFF] border border-[#716DFF]/40 shadow-raised-sm",
    cyan: "bg-[#2C2C52] text-[#6CD6B3] border border-[#6CD6B3]/30 shadow-raised-sm",
    pink: "bg-[#2C2C52] text-[#EF7B98] border border-[#EF7B98]/30 shadow-raised-sm",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1 font-semibold",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3 py-1.5 gap-2 font-medium",
  };

  const dotColors = {
    primary: "bg-[#716DFF]",
    secondary: "bg-[#AAAAC1]",
    outline: "bg-[#AAAAC1]",
    success: "bg-[#6CD6B3]",
    warning: "bg-[#F59E0B]",
    danger: "bg-[#EF7B98]",
    purple: "bg-[#716DFF]",
    cyan: "bg-[#6CD6B3]",
    pink: "bg-[#EF7B98]",
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
