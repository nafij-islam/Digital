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
            className="fixed inset-0 bg-[#161623]/70 backdrop-blur-xs"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-[#29294D] h-full shadow-floating flex flex-col z-10 border-l border-[#383866]/40 text-[#F5F5FA]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#383866]/30">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-[#303057] text-[#716DFF] shadow-raised-sm flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-black text-[#F5F5FA] text-base font-heading uppercase">Your Cart</h3>
                  <p className="text-xs font-mono text-[#AAAAC1]">
                    {items.length} {items.length === 1 ? "product" : "products"} selected
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-full bg-[#26264A] shadow-pressed-sm border border-[#383866]/40 flex items-center justify-center text-[#AAAAC1] hover:text-[#F5F5FA] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-[#303057] shadow-raised flex items-center justify-center text-[#716DFF]">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F5F5FA] text-base font-heading uppercase">Your cart is empty</h4>
                    <p className="text-xs text-[#AAAAC1] mt-1 max-w-xs">
                      Discover our verified AI subscriptions, creative suites, and software licenses.
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
                    className="flex gap-3.5 p-4 rounded-2xl bg-[#303057] shadow-raised border border-[#383866]/30"
                  >
                    <div className="h-16 w-16 rounded-xl bg-[#26264A] shadow-pressed overflow-hidden relative shrink-0 border border-[#383866]/40 p-1">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-[#F5F5FA] truncate font-heading uppercase">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#777790] hover:text-[#EF7B98] p-0.5 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-[#716DFF] mt-0.5">
                        {item.selectedPlan.name}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5 bg-[#26264A] shadow-pressed-sm border border-[#383866]/40 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-[#AAAAC1] hover:text-[#F5F5FA] rounded"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-mono font-bold px-1.5 text-[#F5F5FA]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-[#AAAAC1] hover:text-[#F5F5FA] rounded"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-black font-mono text-[#F5F5FA]">
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
              <div className="p-5 border-t border-[#383866]/40 bg-[#303057] space-y-4 shadow-floating">
                {/* Coupon input */}
                {!couponCode ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. WELCOME10)"
                      className="flex-1 rounded-full border border-[#383866]/50 bg-[#26264A] px-3.5 py-2 text-xs font-mono text-[#F5F5FA] uppercase placeholder:normal-case placeholder:text-[#777790] shadow-pressed focus:border-[#716DFF] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-full bg-[#353560] shadow-raised-sm hover:shadow-floating active:shadow-pressed text-xs font-bold text-[#F5F5FA] border border-[#383866]/40 transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#26264A] shadow-pressed-sm border border-[#6CD6B3]/30 text-xs">
                    <div className="flex items-center gap-1.5 text-[#6CD6B3] font-semibold font-mono">
                      <Tag className="h-3.5 w-3.5" />
                      <span>{couponCode}</span>
                      <span className="font-normal text-[#AAAAC1]">(-{formatPrice(discountAmount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#EF7B98] hover:underline font-bold text-[11px] font-mono cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-[#AAAAC1] font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#F5F5FA]">{formatPrice(getSubtotal())}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#6CD6B3] font-medium">
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#F5F5FA] pt-2 border-t border-[#383866]/30">
                    <span className="font-heading uppercase">Total Amount</span>
                    <span className="text-[#716DFF] text-base font-black font-mono">{formatPrice(getTotal())}</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={() => setOpen(false)} className="block w-full">
                  <button
                    type="button"
                    className="w-full h-12 rounded-full font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-[#5754D8] to-[#716DFF] hover:brightness-110 text-white shadow-raised hover:shadow-floating active:shadow-pressed flex items-center justify-center gap-2 transition-all cursor-pointer uppercase font-heading"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#777790]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#6CD6B3]" />
                  <span>100% Genuine Licenses &amp; Instant Verification</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
