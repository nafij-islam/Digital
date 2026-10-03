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
  variant = "dark",
  size = "md",
  href = "/",
}) => {
  const sizeClasses = {
    sm: "h-[24px] sm:h-[26px] w-auto",
    md: "h-[32px] sm:h-[36px] w-auto",
    lg: "h-[42px] sm:h-[46px] w-auto",
    xl: "h-[50px] sm:h-[56px] w-auto",
  };

  const imageDimensions = {
    sm: { height: 26, width: 90 },
    md: { height: 36, width: 124 },
    lg: { height: 46, width: 158 },
    xl: { height: 56, width: 192 },
  };

  // On dark backgrounds (#29294D, #303057, #242444, etc), logo-footer.png has white text for "shop."
  // which provides maximum contrast and looks ultra-clean.
  // When variant === 'light' (e.g. on pure white surfaces), use logo.png with dark text.
  const isLight = variant === "light";
  const logoSrc = isLight ? "/logo.png" : "/logo-footer.png";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 select-none focus-visible:outline-none group transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      <div className="relative flex items-center">
        <Image
          src={logoSrc}
          alt="shop.nafij"
          width={imageDimensions[size].width}
          height={imageDimensions[size].height}
          priority
          className={cn(
            "object-contain transition-all duration-200 group-hover:brightness-110",
            sizeClasses[size]
          )}
        />
      </div>

      {variant === "admin" && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#303057] text-[#716DFF] border border-[#353560]/50 shadow-neu-raised">
          CONSOLE ADMIN
        </span>
      )}
    </Link>
  );
};

