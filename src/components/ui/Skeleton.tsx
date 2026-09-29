import React from "react";
import { cn } from "@/lib/utils/cn";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-slate-200/80", className)}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-[18px] sm:rounded-[20px] border border-slate-900/[0.08] bg-white shadow-soft overflow-hidden flex flex-col justify-between">
      <div className="p-3 sm:p-3.5 border-b border-slate-100 bg-slate-50/60">
        <Skeleton className="aspect-[16/9] w-full rounded-[13px]" />
      </div>
      <div className="p-5 sm:p-5.5 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-1/4 rounded" />
          <Skeleton className="h-5 w-4/5 rounded" />
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-2/3 rounded" />
          <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
            <Skeleton className="h-2.5 w-20 rounded" />
            <Skeleton className="h-3 w-44 rounded" />
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100/90 space-y-2.5 mt-auto">
          <div className="space-y-1">
            <Skeleton className="h-2.5 w-10 rounded" />
            <Skeleton className="h-6 w-28 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
          <div className="pt-2 flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
