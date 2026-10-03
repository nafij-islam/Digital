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
      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#AAAAC1]">
        Select Payment Protocol <span className="text-[#EF7B98]">*</span>
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
                  ? "border-[#716DFF] bg-[#29294D] shadow-neu-pressed"
                  : "border-[#353560]/40 bg-[#303057] hover:bg-[#353560] shadow-neu-raised"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-neu-pressed border border-[#353560]/40",
                    isBkash
                      ? "bg-[#29294D] text-[#EF7B98]"
                      : isNagad
                      ? "bg-[#29294D] text-[#6CD6B3]"
                      : "bg-[#29294D] text-[#716DFF]"
                  )}
                >
                  {method.provider}
                </div>
                <div>
                  <h4 className="font-bold text-[#F5F5FA] text-sm">{method.displayName}</h4>
                  <p className="text-xs text-[#AAAAC1]">
                    {method.accountType} Transfer
                  </p>
                </div>
              </div>

              {isSelected ? (
                <CheckCircle2
                  className={cn(
                    "h-5 w-5",
                    isBkash ? "text-[#EF7B98]" : isNagad ? "text-[#6CD6B3]" : "text-[#716DFF]"
                  )}
                />
              ) : (
                <Circle className="h-5 w-5 text-[#777790]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
