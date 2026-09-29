import React from "react";
import { OrderTimelineEvent } from "@/types/order";
import { formatDate } from "@/lib/utils/formatters";
import { Check, CircleDot, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface OrderTimelineProps {
  events: OrderTimelineEvent[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ events }) => {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {events.map((event, idx) => {
        const isCurrent = event.completed && (!events[idx + 1] || !events[idx + 1].completed);
        return (
          <div key={event.id || idx} className="relative group">
            {/* Timeline node icon */}
            <div
              className={cn(
                "absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white transition-all",
                event.completed
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-xs"
                  : isCurrent
                  ? "border-primary-500 text-primary-600 bg-white ring-4 ring-primary-100"
                  : "border-slate-300 text-slate-300 bg-white"
              )}
            >
              {event.completed ? (
                <Check className="h-3 w-3 stroke-[3]" />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              )}
            </div>

            {/* Event content */}
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-baseline gap-2">
                <h4
                  className={cn(
                    "text-sm font-bold",
                    event.completed
                      ? "text-slate-900"
                      : isCurrent
                      ? "text-primary-600"
                      : "text-slate-400"
                  )}
                >
                  {event.title}
                </h4>
                {event.timestamp && (
                  <span className="text-[11px] text-slate-400">
                    {formatDate(event.timestamp)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
