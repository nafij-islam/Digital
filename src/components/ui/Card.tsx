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
      soft: "bg-white shadow-soft border border-slate-200/80",
      raised: "bg-white shadow-raised border border-slate-200/60",
      inset: "bg-[#F7F8FB] shadow-inset border border-slate-200/90",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-5 sm:p-6 transition-all duration-200",
          surfaceStyles[surface],
          hoverEffect &&
            "hover:-translate-y-0.5 hover:shadow-raised hover:border-primary-300/80 cursor-pointer",
          glass &&
            "bg-white/90 backdrop-blur-md border-white/80 shadow-floating",
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
  <div className={cn("flex flex-col space-y-1.5 pb-4 border-b border-slate-100", className)} {...props} />
);

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("text-base sm:text-lg font-bold tracking-tight text-slate-900", className)}
    {...props}
  />
);

export const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-xs text-slate-500", className)} {...props} />
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
    className={cn("flex items-center pt-4 border-t border-slate-100", className)}
    {...props}
  />
);
