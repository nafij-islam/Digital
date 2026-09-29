import React from "react";
import { cn } from "@/lib/utils/cn";

export interface StatusIndicatorProps {
  status: "success" | "warning" | "danger" | "info" | "neutral";
  label: string;
  size?: "sm" | "md";
  className?: string;
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = "md",
  className,
  pulse = false,
}) => {
  const styles = {
    success: {
      pill: "bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-2xs",
      dot: "bg-emerald-500",
    },
    warning: {
      pill: "bg-amber-50 text-amber-800 border-amber-200/80 shadow-2xs",
      dot: "bg-amber-500",
    },
    danger: {
      pill: "bg-rose-50 text-rose-800 border-rose-200/80 shadow-2xs",
      dot: "bg-rose-500",
    },
    info: {
      pill: "bg-blue-50 text-blue-800 border-blue-200/80 shadow-2xs",
      dot: "bg-blue-500",
    },
    neutral: {
      pill: "bg-slate-100 text-slate-700 border-slate-200/80 shadow-2xs",
      dot: "bg-slate-400",
    },
  };

  const current = styles[status] || styles.neutral;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider",
        current.pill,
        size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          current.dot,
          pulse && "animate-pulse"
        )}
      />
      <span className="truncate">{label}</span>
    </span>
  );
};
