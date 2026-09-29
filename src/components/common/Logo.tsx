import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface LogoProps {
  className?: string;
  variant?: "light" | "dark" | "admin";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  variant = "light",
  size = "md",
  href = "/",
}) => {
  const sizeClasses = {
    sm: "h-7 w-auto",
    md: "h-8 sm:h-9 w-auto",
    lg: "h-10 sm:h-12 w-auto",
  };

  const imageDimensions = {
    sm: { height: 28, width: 120 },
    md: { height: 36, width: 154 },
    lg: { height: 48, width: 205 },
  };

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
          src="/logo.png"
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
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200/80 shadow-2xs">
          Admin
        </span>
      )}
    </Link>
  );
};
