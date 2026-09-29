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
  const sizeClasses = {
    sm: "h-[26px] w-auto",
    md: "h-[36px] sm:h-[38px] md:h-[40px] w-auto",
    lg: "h-[46px] sm:h-[48px] w-auto",
    xl: "h-[56px] w-auto",
  };

  const imageDimensions = {
    sm: { height: 26, width: 111 },
    md: { height: 40, width: 171 },
    lg: { height: 48, width: 205 },
    xl: { height: 56, width: 240 },
  };

  const isDarkVariant = variant === "footer" || variant === "dark" || variant === "admin";
  const logoSrc = isDarkVariant ? "/logo-footer.png" : "/logo.png";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 select-none focus-visible:outline-none group",
        className
      )}
    >
      <div className="relative flex items-center">
        <Image
          src={logoSrc}
          alt="DigiVault"
          width={imageDimensions[size].width}
          height={imageDimensions[size].height}
          priority
          className={cn(
            "object-contain transition-transform duration-200 group-hover:scale-[1.02]",
            sizeClasses[size]
          )}
        />
      </div>

      {variant === "admin" && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 shadow-2xs">
          Admin
        </span>
      )}
    </Link>
  );
};
