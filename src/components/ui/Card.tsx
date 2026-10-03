import React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
  surface?: "raised" | "soft" | "inset";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, glass = false, surface = "soft", children, ...props }, ref) => {
    const surfaceStyles = {
      soft: "bg-[#303057] shadow-raised border border-[#383866]/30 text-[#F5F5FA]",
      raised: "bg-[#303057] shadow-raised-lg border border-[#383866]/40 text-[#F5F5FA]",
      inset: "bg-[#26264A] shadow-pressed border border-[#232342] text-[#F5F5FA]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-5 sm:p-6 transition-all duration-200",
          surfaceStyles[surface],
          hoverEffect &&
            "hover:-translate-y-0.5 hover:shadow-floating hover:border-[#716DFF]/40 cursor-pointer",
          glass &&
            "bg-[#303057]/90 backdrop-blur-md border-[#383866]/50 shadow-floating",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4 border-b border-[#383866]/40", className)} {...props} />
);

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("text-base sm:text-lg font-bold tracking-tight text-[#F5F5FA]", className)}
    {...props}
  />
);

export const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-xs text-[#AAAAC1]", className)} {...props} />
);

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("pt-4", className)} {...props} />
);

export const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center pt-4 border-t border-[#383866]/40", className)}
    {...props}
  />
);
