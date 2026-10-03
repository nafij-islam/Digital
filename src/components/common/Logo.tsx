import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface LogoProps {
  className?: string;
  variant?: "light" | "dark" | "admin" | "footer";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  variant = "light",
  size = "md",
  href = "/",
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#29294D] border border-[#353560]/40 shadow-neu-pressed select-none focus-visible:outline-none group transition-all duration-200 hover:border-[#716DFF]/50",
        className
      )}
    >
      <div className="h-6 w-6 rounded-full bg-[#303057] shadow-neu-raised flex items-center justify-center text-[#716DFF] group-hover:scale-105 transition-transform">
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      <span className="font-black text-xs sm:text-sm tracking-widest text-[#F5F5FA] uppercase font-mono">
        NAFIJ DIGITAL
      </span>

      {variant === "admin" && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#303057] text-[#716DFF] border border-[#353560]/40 shadow-neu-raised">
          CONSOLE ADMIN
        </span>
      )}
    </Link>
  );
};
