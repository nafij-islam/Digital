"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    setOpen,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
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
      toast.error("Invalid or expired promo code.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Your Cart</h3>
                  <p className="text-xs text-slate-500">
                    {items.length} {items.length === 1 ? "product" : "products"} selected
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">Your cart is empty</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Discover our premium digital subscriptions, AI tools, and genuine license keys.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setOpen(false)}
                  >
                    Browse Catalog
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="h-16 w-16 rounded-xl bg-slate-200 overflow-hidden relative shrink-0 border border-slate-200">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 p-0.5 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-medium text-primary-600 mt-0.5">
                        {item.selectedPlan.name}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-semibold px-1.5 text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {formatPrice(item.selectedPlan.salePrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-white space-y-4 shadow-lg">
                {/* Coupon input */}
                {!couponCode ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. WELCOME10)"
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs uppercase placeholder:normal-case focus:border-primary-500 focus:outline-none"
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Apply
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <Tag className="h-3.5 w-3.5" />
                      <span>{couponCode}</span>
                      <span className="font-normal text-emerald-600">(-{formatPrice(discountAmount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatPrice(getSubtotal())}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span className="text-primary-600 text-base">{formatPrice(getTotal())}</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={() => setOpen(false)} className="block w-full">
                  <Button variant="gradient" size="lg" className="w-full font-bold shadow-md">
                    Proceed to Checkout <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>100% Genuine Licenses & Instant Verification</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
