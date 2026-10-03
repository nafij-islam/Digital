"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from "lucide-react";
import { useToast } from "@/hooks/useToast";

import { Container } from "@/components/common/Container";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const toast = useToast();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const code = couponInput.trim().toUpperCase();
    if (code === "WELCOME10") {
      applyCoupon(code, Math.round(getSubtotal() * 0.1));
      toast.success("Coupon WELCOME10 applied! 10% discount added.");
    } else if (code === "SAVE50") {
      applyCoupon(code, 50);
      toast.success("Coupon SAVE50 applied! ৳50 discount added.");
    } else {
      toast.error("Invalid coupon code.");
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-20 text-center space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-[#303057] border border-[#353560]/40 shadow-neu-raised flex items-center justify-center text-[#716DFF] mx-auto animate-neu-fade">
          <ShoppingBag className="h-10 w-10 text-[#716DFF]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#F5F5FA]">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-[#AAAAC1] max-w-sm mx-auto">
            You haven&apos;t added any digital products or subscriptions yet.
          </p>
        </div>
        <Link href="/products">
          <Button variant="primary" size="lg" className="font-bold">
            Explore Products
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#353560]/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F5FA] tracking-tight">
            SELECTED PRODUCTS ({items.length})
          </h1>
          <p className="text-xs text-[#AAAAC1] mt-1">
            Review your selected digital licenses before deploying to your account.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-[#EF7B98] hover:bg-[#29294D] self-start sm:self-auto">
          Purge Queue
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-4 sm:p-5 shadow-neu-raised flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-neu-fade"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-16 w-16 rounded-2xl bg-[#29294D] shadow-neu-pressed overflow-hidden relative shrink-0 border border-[#353560]/40">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-bold text-[#F5F5FA] text-sm sm:text-base hover:text-[#716DFF] transition-colors truncate block"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs font-mono font-bold text-[#716DFF] mt-0.5">
                    Plan: {item.selectedPlan.name}
                  </p>
                  <p className="text-[11px] text-[#777790]">
                    Unit: {formatPrice(item.selectedPlan.salePrice)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-[#353560]/40">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-[#29294D] border border-[#353560]/40 shadow-neu-pressed rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-lg text-[#AAAAC1] hover:text-[#F5F5FA] transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-[#F5F5FA] px-2">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-lg text-[#AAAAC1] hover:text-[#F5F5FA] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-[#F5F5FA]">
                    {formatPrice(item.selectedPlan.salePrice * item.quantity)}
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[#777790] hover:text-[#EF7B98] p-2 rounded-xl hover:bg-[#29294D] transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 sm:p-6 shadow-neu-raised space-y-5 animate-neu-fade">
            <h3 className="font-bold text-[#F5F5FA] text-base pb-3 border-b border-[#353560]/40 font-mono tracking-wider">
              CHECKOUT DECK
            </h3>

            {/* Promo Code Box */}
            {!couponCode ? (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#AAAAC1]">
                  Security Access Voucher
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 rounded-2xl border border-[#353560]/40 bg-[#29294D] px-3.5 py-2 text-xs uppercase placeholder:normal-case text-[#F5F5FA] shadow-neu-pressed focus:border-[#716DFF] focus:outline-none"
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    Apply
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#29294D] border border-[#353560]/40 shadow-neu-pressed text-xs">
                <div className="flex items-center gap-1.5 text-[#6CD6B3] font-semibold">
                  <Tag className="h-4 w-4" />
                  <span>{couponCode}</span>
                  <span className="font-normal text-[#6CD6B3]">
                    (-{formatPrice(discountAmount)})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-[#EF7B98] hover:underline font-bold text-xs"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-[#AAAAC1]">
              <div className="flex justify-between">
                <span>Products Subtotal</span>
                <span className="font-bold text-[#F5F5FA]">{formatPrice(getSubtotal())}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#6CD6B3] font-medium">
                  <span>Voucher Deduction</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#F5F5FA] pt-3 border-t border-[#353560]/40">
                <span>Grand Total</span>
                <span className="text-[#716DFF] text-xl font-black">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button variant="primary" size="lg" className="w-full font-bold shadow-neu-raised">
                Deploy &amp; Pay <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#777790]">
              <ShieldCheck className="h-4 w-4 text-[#6CD6B3]" />
              <span>Manual verification via bKash &amp; Nagad</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
