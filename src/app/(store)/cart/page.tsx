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
        <div className="h-20 w-20 rounded-2xl bg-[var(--bg-surface)] border border-slate-200/80 shadow-soft flex items-center justify-center text-slate-400 mx-auto">
          <ShoppingBag className="h-10 w-10 text-primary-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            You haven&apos;t added any digital products or subscriptions yet.
          </p>
        </div>
        <Link href="/products">
          <Button variant="primary" size="lg" className="font-bold">
            Browse All Products
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your selected digital licenses and proceed to manual checkout.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-rose-600 hover:bg-rose-50 self-start sm:self-auto">
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-3.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-4 sm:p-5 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
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
                    className="font-bold text-slate-900 text-sm sm:text-base hover:text-primary-600 transition-colors truncate block"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs font-semibold text-primary-600 mt-0.5">
                    Plan: {item.selectedPlan.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Unit Price: {formatPrice(item.selectedPlan.salePrice)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-200"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-900 px-2">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-200"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-slate-900">
                    {formatPrice(item.selectedPlan.salePrice * item.quantity)}
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-6 shadow-soft space-y-5">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Promo Code Box */}
            {!couponCode ? (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Have a Coupon?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs uppercase placeholder:normal-case shadow-inset focus:border-primary-500 focus:outline-none"
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    Apply
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <Tag className="h-4 w-4" />
                  <span>{couponCode}</span>
                  <span className="font-normal text-emerald-600">
                    (-{formatPrice(discountAmount)})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(getSubtotal())}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Total</span>
                <span className="text-primary-600 text-xl font-black">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button variant="primary" size="lg" className="w-full font-bold shadow-soft">
                Proceed to Checkout <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Manual verification via bKash &amp; Nagad</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
