"use client";

import React from "react";
import { ProductPlan } from "@/types/product";
import { formatPrice, formatDuration } from "@/lib/utils/formatters";
import { CheckCircle2, Circle, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PlanSelectorProps {
  plans: ProductPlan[];
  selectedPlan: ProductPlan | null;
  onSelectPlan: (plan: ProductPlan) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  plans,
  selectedPlan,
  onSelectPlan,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          className="text-[11px] font-mono font-bold uppercase tracking-wider"
          style={{ color: "var(--site-text-muted, #94A3B8)" }}
        >
          {"// SELECT DURATION PLAN"}
        </label>
        <span
          className="text-[11px] font-mono font-bold"
          style={{ color: "var(--site-details-accent, #6366F1)" }}
        >
          {plans.length} options ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {plans.map((plan) => {
          const isSelected = selectedPlan?.id === plan.id;
          const isOut = plan.stock === 0;
          const discountPercent =
            plan.regularPrice > plan.salePrice
              ? Math.round(((plan.regularPrice - plan.salePrice) / plan.regularPrice) * 100)
              : 0;

          return (
            <div
              key={plan.id}
              onClick={() => !isOut && onSelectPlan(plan)}
              className={cn(
                "relative rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none border",
                isSelected ? "shadow-pressed" : "shadow-raised hover:shadow-floating",
                isOut && "opacity-40 cursor-not-allowed pointer-events-none"
              )}
              style={{
                backgroundColor: isSelected
                  ? "var(--site-details-bay-bg, #0F1424)"
                  : "var(--site-details-bg, #141A2E)",
                borderColor: isSelected
                  ? "var(--site-details-accent, #6366F1)"
                  : "var(--site-details-border, #1E2642)",
              }}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div
                  className="absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[9px] font-mono font-bold text-white shadow-xs flex items-center gap-1"
                  style={{
                    background: "linear-gradient(135deg, var(--site-primary, #4F46E5), var(--site-details-accent, #6366F1))",
                  }}
                >
                  <Sparkles className="h-2.5 w-2.5" /> MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--site-details-accent, #6366F1)" }} />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0" style={{ color: "var(--site-text-muted, #94A3B8)" }} />
                    )}
                    <span
                      className="font-bold text-sm font-heading"
                      style={{ color: "var(--site-text-main, #F8FAFC)" }}
                    >
                      {plan.name}
                    </span>
                  </div>

                  {discountPercent > 0 && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-mono font-bold border shadow-pressed-sm"
                      style={{
                        backgroundColor: "var(--site-details-bay-bg, #0F1424)",
                        borderColor: "rgba(239, 68, 68, 0.3)",
                        color: "#F43F5E",
                      }}
                    >
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <div
                  className="mt-1 text-xs pl-6 font-mono"
                  style={{ color: "var(--site-text-muted, #94A3B8)" }}
                >
                  Duration: {formatDuration(plan.durationValue, plan.durationUnit)}
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div className="mt-2.5 pl-6 space-y-1">
                    {plan.features.slice(0, 2).map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-[11px]"
                        style={{ color: "var(--site-text-secondary, #CBD5E1)" }}
                      >
                        <Check className="h-3 w-3 text-[#10B981] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div
                className="mt-3.5 pt-2.5 border-t flex items-baseline justify-between pl-6"
                style={{ borderColor: "var(--site-details-border, #1E2642)" }}
              >
                <span
                  className="text-[10px] font-mono uppercase"
                  style={{ color: "var(--site-text-muted, #94A3B8)" }}
                >
                  Price
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-base font-black font-mono"
                    style={{ color: "var(--site-details-price, #F8FAFC)" }}
                  >
                    {formatPrice(plan.salePrice)}
                  </span>
                  {plan.regularPrice > plan.salePrice && (
                    <span
                      className="text-xs line-through font-mono"
                      style={{ color: "var(--site-text-muted, #94A3B8)" }}
                    >
                      {formatPrice(plan.regularPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
