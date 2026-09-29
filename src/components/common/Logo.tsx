import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface LogoProps {
  className?: string;
  variant?: "light" | "dark" | "admin";
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  className,
  variant = "light",
  size = "md",
}) => {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const iconSizes = {
    sm: "h-6 w-6 p-1",
    md: "h-8 w-8 p-1.5",
    lg: "h-10 w-10 p-2",
  };

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 font-bold tracking-tight group", className)}
    >
      <div
        className={cn(
          "rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200",
          iconSizes[size]
        )}
      >
        {variant === "admin" ? (
          <ShieldCheck className="h-full w-full" />
        ) : (
          <Sparkles className="h-full w-full" />
        )}
      </div>
      <div className="flex flex-col leading-none">
        <span className={cn("font-black tracking-tight text-slate-900", sizes[size])}>
          Digi<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Vault</span>
        </span>
        {variant === "admin" && (
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-purple-600 mt-0.5">
            Admin Panel
          </span>
        )}
      </div>
    </Link>
  );
};
