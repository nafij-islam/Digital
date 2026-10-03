import React from "react";
import { cn } from "@/lib/utils/cn";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-[#26264A]", className)}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-[#303057] p-5 shadow-raised border border-[#383866]/30 overflow-hidden flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#383866]/30">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
      <div className="flex items-start gap-3">
        <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-4/5 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-2/3 rounded-md" />
        </div>
      </div>
      <div className="pt-3 border-t border-[#383866]/30 flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
};
