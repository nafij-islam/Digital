import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  growth?: number;
  subtitle?: string;
  variant?: "blue" | "purple" | "emerald" | "amber" | "rose";
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  icon,
  growth,
  subtitle,
  variant = "blue",
}) => {
  const iconBgs = {
    blue: "bg-blue-50 text-blue-600 border-blue-200/60",
    purple: "bg-purple-50 text-purple-600 border-purple-200/60",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    amber: "bg-amber-50 text-amber-600 border-amber-200/60",
    rose: "bg-rose-50 text-rose-600 border-rose-200/60",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div
          className={cn(
            "h-10 w-10 rounded-2xl flex items-center justify-center border shadow-2xs",
            iconBgs[variant]
          )}
        >
          {icon}
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </div>

        {(growth !== undefined || subtitle) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {growth !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center font-bold px-1.5 py-0.5 rounded-md",
                  growth >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                )}
              >
                {growth >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                )}
                {Math.abs(growth)}%
              </span>
            )}
            {subtitle && <span className="text-slate-500">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
