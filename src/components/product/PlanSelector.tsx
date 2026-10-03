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
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#AAAAC1]">
          {"// SELECT DURATION PLAN"}
        </label>
        <span className="text-[11px] font-mono text-[#716DFF] font-bold">
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
                "relative rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none",
                isSelected
                  ? "bg-[#26264A] shadow-pressed border-2 border-[#716DFF] text-[#F5F5FA]"
                  : "bg-[#303057] shadow-raised hover:shadow-floating hover:bg-[#353560] border border-[#383866]/30 text-[#AAAAC1]",
                isOut && "opacity-40 cursor-not-allowed pointer-events-none"
              )}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-[#5754D8] to-[#716DFF] px-2.5 py-0.5 text-[9px] font-mono font-bold text-white shadow-xs flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" /> MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4 text-[#716DFF] shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-[#777790] shrink-0" />
                    )}
                    <span className="font-bold text-sm text-[#F5F5FA] font-heading">
                      {plan.name}
                    </span>
                  </div>

                  {discountPercent > 0 && (
                    <span className="rounded-full bg-[#26264A] text-[#EF7B98] px-2 py-0.5 text-[9px] font-mono font-bold border border-[#EF7B98]/30 shadow-pressed-sm">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <div className="mt-1 text-xs text-[#AAAAC1] pl-6 font-mono">
                  Duration: {formatDuration(plan.durationValue, plan.durationUnit)}
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div className="mt-2.5 pl-6 space-y-1">
                    {plan.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#AAAAC1]">
                        <Check className="h-3 w-3 text-[#6CD6B3] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mt-3.5 pt-2.5 border-t border-[#383866]/30 flex items-baseline justify-between pl-6">
                <span className="text-[10px] font-mono text-[#777790] uppercase">Price</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black font-mono text-[#F5F5FA]">
                    {formatPrice(plan.salePrice)}
                  </span>
                  {plan.regularPrice > plan.salePrice && (
                    <span className="text-xs text-[#777790] line-through font-mono">
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
