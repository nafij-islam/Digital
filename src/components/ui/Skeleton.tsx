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
    <div className="rounded-[18px] border border-slate-900/[0.08] bg-white shadow-soft overflow-hidden flex flex-col justify-between">
      <Skeleton className="h-1.5 w-full rounded-none" />
      <div className="p-3.5 sm:p-4 space-y-3.5 flex-1 flex flex-col justify-between">
        <div>
          <Skeleton className="aspect-[16/10] w-full rounded-[13px]" />
          <div className="space-y-1.5 mt-3.5">
            <Skeleton className="h-3 w-1/4 rounded" />
            <Skeleton className="h-5 w-4/5 rounded" />
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-2/3 rounded" />
          </div>
          <div className="mt-3.5 space-y-1.5">
            <Skeleton className="h-2.5 w-10 rounded" />
            <div className="flex gap-1.5">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-18 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100/80 space-y-2.5 mt-auto">
          <div className="space-y-1">
            <Skeleton className="h-2.5 w-14 rounded" />
            <Skeleton className="h-6 w-28 rounded" />
          </div>
          <Skeleton className="h-3 w-32 rounded" />
          <Skeleton className="h-12 w-full rounded-[11px]" />
        </div>
      </div>
    </div>
  );
};
