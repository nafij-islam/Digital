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
    <div className="rounded-[20px] border border-[rgba(15,23,42,0.07)] bg-white p-3.5 sm:p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col justify-between min-h-0 md:min-h-[var(--product-card-height,390px)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-slate-100 border border-slate-200/50">
        <Skeleton className="h-full w-full rounded-[16px]" />
      </div>
      <div className="flex-1 flex flex-col justify-between pt-3 sm:pt-3.5 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5 rounded" />
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-2/3 rounded" />
        </div>
        <div className="pt-3 mt-auto space-y-2.5">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-[44px] w-full rounded-[11px]" />
        </div>
      </div>
    </div>
  );
};
