"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatters";
import { ShieldCheck, Sparkles, Tag } from "lucide-react";

export const CheckoutSummary: React.FC = () => {
  const { items, getSubtotal, getTotal, discountAmount, couponCode } = useCart();

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card space-y-6 sticky top-24">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-base">Order Summary</h3>
        <span className="text-xs text-slate-500 font-medium">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items list */}
      <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
        {items.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {item.product.name}
              </h4>
              <p className="text-[11px] text-primary-600 font-medium">
                {item.selectedPlan.name} × {item.quantity}
              </p>
            </div>
            <div className="text-xs font-bold text-slate-900 shrink-0">
              {formatPrice(item.selectedPlan.salePrice * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Calculation */}
      <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">{formatPrice(getSubtotal())}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" /> Coupon ({couponCode})
            </span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
          <span>Total Amount</span>
          <span className="text-primary-600 text-xl font-black">{formatPrice(getTotal())}</span>
        </div>
      </div>

      {/* Safe Guarantee */}
      <div className="rounded-2xl bg-slate-50 p-3.5 flex items-start gap-2.5 text-[11px] text-slate-500 border border-slate-200/60">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          Your order will enter <strong>Pending Verification</strong> status until the transaction ID is validated by our admin team.
        </span>
      </div>
    </div>
  );
};
