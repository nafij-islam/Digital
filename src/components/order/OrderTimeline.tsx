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
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#353560]/60">
      {events.map((event, idx) => {
        const isCurrent = event.completed && (!events[idx + 1] || !events[idx + 1].completed);
        return (
          <div key={event.id || idx} className="relative group">
            {/* Timeline node icon */}
            <div
              className={cn(
                "absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border bg-[#29294D] transition-all",
                event.completed
                  ? "border-[#6CD6B3] bg-[#6CD6B3] text-[#29294D] shadow-neu-raised"
                  : isCurrent
                  ? "border-[#716DFF] text-[#716DFF] bg-[#29294D] ring-2 ring-[#716DFF]/30 shadow-neu-pressed"
                  : "border-[#353560] text-[#777790] bg-[#29294D]"
              )}
            >
              {event.completed ? (
                <Check className="h-3 w-3 stroke-[3]" />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-[#777790]" />
              )}
            </div>

            {/* Event content */}
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-baseline gap-2">
                <h4
                  className={cn(
                    "text-sm font-bold",
                    event.completed
                      ? "text-[#F5F5FA]"
                      : isCurrent
                      ? "text-[#716DFF]"
                      : "text-[#777790]"
                  )}
                >
                  {event.title}
                </h4>
                {event.timestamp && (
                  <span className="text-[11px] font-mono text-[#777790]">
                    {formatDate(event.timestamp)}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#AAAAC1] leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
