import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text,
  size = "md",
  className,
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 gap-3 text-slate-500",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-primary-600", sizes[size])} />
      {text && <p className="text-xs font-medium text-slate-600">{text}</p>}
    </div>
  );
};
