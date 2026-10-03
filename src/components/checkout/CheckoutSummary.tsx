"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatters";
import { ShieldCheck, Sparkles, Tag } from "lucide-react";

export const CheckoutSummary: React.FC = () => {
  const { items, getSubtotal, getTotal, discountAmount, couponCode } = useCart();

  return (
    <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 sm:p-6 shadow-neu-raised space-y-6 static lg:sticky lg:top-24 animate-neu-fade">
      <div className="flex items-center justify-between pb-4 border-b border-[#353560]/40">
        <h3 className="font-bold text-[#F5F5FA] text-base font-mono tracking-wider">CONSOLE QUEUE</h3>
        <span className="text-xs text-[#716DFF] font-mono font-bold">
          {items.length} {items.length === 1 ? "TITLE" : "TITLES"}
        </span>
      </div>

      {/* Items list */}
      <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-[#353560]/40 pr-1">
        {items.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-[#29294D] shadow-neu-pressed relative overflow-hidden shrink-0 border border-[#353560]/40">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#F5F5FA] truncate">
                {item.product.name}
              </h4>
              <p className="text-[11px] text-[#716DFF] font-mono font-medium">
                {item.selectedPlan.name} × {item.quantity}
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-[#F5F5FA] shrink-0">
              {formatPrice(item.selectedPlan.salePrice * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Calculation */}
      <div className="space-y-2 pt-4 border-t border-[#353560]/40 text-xs text-[#AAAAC1]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-[#F5F5FA]">{formatPrice(getSubtotal())}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-[#6CD6B3] font-medium">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" /> Voucher ({couponCode})
            </span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-black text-[#F5F5FA] pt-3 border-t border-[#353560]/40">
          <span>Total Required</span>
          <span className="text-[#716DFF] text-xl font-black">{formatPrice(getTotal())}</span>
        </div>
      </div>

      {/* Safe Guarantee */}
      <div className="rounded-2xl bg-[#29294D] p-3.5 flex items-start gap-2.5 text-[11px] text-[#AAAAC1] border border-[#353560]/40 shadow-neu-pressed">
        <ShieldCheck className="h-4 w-4 text-[#6CD6B3] shrink-0 mt-0.5" />
        <span>
          Your order will enter <strong>Pending Verification</strong> status until the transaction ID is validated by our console admin.
        </span>
      </div>
    </div>
  );
};
