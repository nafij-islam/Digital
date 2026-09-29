import React from "react";
import { Info, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type NoticeVariant = "INFO" | "SUCCESS" | "WARNING" | "DANGER" | "DEFAULT";

export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NoticeVariant;
  title?: string;
  icon?: React.ReactNode;
}

export const Notice: React.FC<NoticeProps> = ({
  variant = "DEFAULT",
  title,
  icon,
  className,
  children,
  ...props
}) => {
  const styles = {
    DEFAULT: {
      container: "bg-[#F7F8FB] border-slate-200/90 text-slate-800 shadow-soft",
      icon: <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />,
      title: "text-slate-900",
    },
    INFO: {
      container: "bg-blue-50/70 border-blue-200/80 text-blue-900 shadow-soft",
      icon: <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />,
      title: "text-blue-950 font-bold",
    },
    SUCCESS: {
      container: "bg-emerald-50/70 border-emerald-200/80 text-emerald-900 shadow-soft",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />,
      title: "text-emerald-950 font-bold",
    },
    WARNING: {
      container: "bg-amber-50/70 border-amber-200/80 text-amber-900 shadow-soft",
      icon: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />,
      title: "text-amber-950 font-bold",
    },
    DANGER: {
      container: "bg-rose-50/70 border-rose-200/80 text-rose-900 shadow-soft",
      icon: <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />,
      title: "text-rose-950 font-bold",
    },
  };

  const current = styles[variant] || styles.DEFAULT;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5 flex items-start gap-3.5 transition-all text-xs sm:text-sm leading-relaxed",
        current.container,
        className
      )}
      {...props}
    >
      {icon ? <span className="shrink-0 mt-0.5">{icon}</span> : current.icon}
      <div className="flex-1 min-w-0 space-y-1">
        {title && <h5 className={cn("text-xs sm:text-sm font-bold tracking-tight", current.title)}>{title}</h5>}
        <div className="text-slate-700 leading-relaxed break-words">{children}</div>
      </div>
    </div>
  );
};
