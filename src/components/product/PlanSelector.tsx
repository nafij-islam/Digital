"use client";

import React from "react";
import { ProductPlan } from "@/types/product";
import { formatPrice, formatDuration } from "@/lib/utils/formatters";
import { CheckCircle2, Circle, Zap, Sparkles, Check } from "lucide-react";
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
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Select Subscription Plan
        </label>
        <span className="text-xs text-primary-600 font-medium">
          {plans.length} options available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                "relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between",
                isSelected
                  ? "border-primary-500 bg-primary-50/40 ring-2 ring-primary-500/20 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-xs",
                isOut && "opacity-50 cursor-not-allowed pointer-events-none bg-slate-50"
              )}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" /> Most Popular
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4 text-primary-600 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                    )}
                    <span className="font-bold text-slate-900 text-sm">{plan.name}</span>
                  </div>

                  {discountPercent > 0 && (
                    <span className="rounded-md bg-rose-50 text-rose-700 px-1.5 py-0.5 text-[10px] font-bold border border-rose-200">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>

                <div className="mt-1 text-xs text-slate-500 pl-6">
                  Duration: {formatDuration(plan.durationValue, plan.durationUnit)}
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div className="mt-2.5 pl-6 space-y-1">
                    {plan.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-baseline justify-between pl-6">
                <span className="text-[11px] text-slate-400 font-medium">Price</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-slate-900">
                    {formatPrice(plan.salePrice)}
                  </span>
                  {plan.regularPrice > plan.salePrice && (
                    <span className="text-xs text-slate-400 line-through">
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
