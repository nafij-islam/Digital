"use client";

import React from "react";
import { PaymentMethod } from "@/types/payment";
import { CheckCircle2, Circle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethodId: string;
  onSelect: (id: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedMethodId,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        Choose Manual Payment Method <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {methods.map((method) => {
          const isSelected = selectedMethodId === method.id;
          const isBkash = method.provider === "bkash";
          const isNagad = method.provider === "nagad";

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={cn(
                "relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex items-center justify-between",
                isSelected
                  ? isBkash
                    ? "border-pink-500 bg-pink-50/40 ring-2 ring-pink-500/20 shadow-md"
                    : isNagad
                    ? "border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-md"
                    : "border-primary-500 bg-primary-50/40 ring-2 ring-primary-500/20 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs uppercase text-white shadow-xs",
                    isBkash
                      ? "bg-gradient-to-tr from-pink-600 to-rose-500"
                      : isNagad
                      ? "bg-gradient-to-tr from-orange-600 to-amber-500"
                      : "bg-slate-800"
                  )}
                >
                  {method.provider}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{method.displayName}</h4>
                  <p className="text-xs text-slate-500">
                    {method.accountType} Transfer
                  </p>
                </div>
              </div>

              {isSelected ? (
                <CheckCircle2
                  className={cn(
                    "h-5 w-5",
                    isBkash ? "text-pink-600" : isNagad ? "text-orange-600" : "text-primary-600"
                  )}
                />
              ) : (
                <Circle className="h-5 w-5 text-slate-300" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
