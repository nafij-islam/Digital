import React from "react";
import { OrderStatus } from "@/types/order";
import { ORDER_STATUS_CONFIG } from "@/lib/constants/statuses";
import { cn } from "@/lib/utils/cn";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  size?: "sm" | "md";
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className,
  size = "md",
}) => {
  const config = ORDER_STATUS_CONFIG[status] || {
    label: status,
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
    borderColor: "border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide",
        config.bgColor,
        config.textColor,
        config.borderColor,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
