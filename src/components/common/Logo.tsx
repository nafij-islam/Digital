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
    sm: "h-[30px] sm:h-[32px] w-auto",
    md: "h-[38px] sm:h-[42px] w-auto",
    lg: "h-[48px] sm:h-[52px] w-auto",
    xl: "h-[56px] sm:h-[62px] w-auto",
  };

  const imageDimensions = {
    sm: { height: 32, width: 110 },
    md: { height: 42, width: 145 },
    lg: { height: 52, width: 180 },
    xl: { height: 62, width: 214 },
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

