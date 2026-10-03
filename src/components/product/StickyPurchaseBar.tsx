"use client";

import React, { useState } from "react";
import { Product, ProductPlan } from "@/types/product";
import { formatPrice } from "@/lib/utils/formatters";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Clock,
  CheckCircle,
  Plus,
  Minus,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StickyPurchaseBarProps {
  product: Product;
  selectedPlan: ProductPlan | null;
}

export const StickyPurchaseBar: React.FC<StickyPurchaseBarProps> = ({
  product,
  selectedPlan,
}) => {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = selectedPlan ? selectedPlan.stock === 0 : false;
  const currentPrice = selectedPlan ? selectedPlan.salePrice : product.startingPrice;
  const originalPrice = selectedPlan ? selectedPlan.regularPrice : product.originalPrice;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    if (!selectedPlan) return;
    addItem(product, selectedPlan, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedPlan) return;
    addItem(product, selectedPlan, quantity);
    router.push("/checkout");
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+8801700000000";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hello, I want to purchase ${product.name} (${selectedPlan?.name || "Standard"}).`
  )}`;

  return (
    <div className="rounded-3xl bg-[#303057] shadow-raised-lg p-6 sm:p-7 border border-[#383866]/40 space-y-6 static lg:sticky lg:top-24 select-none animate-fade-in">
      {/* Hardware Screw Fixtures in Corners */}
      <div className="flex items-center justify-between pb-3 border-b border-[#383866]/30 text-[10px] font-mono text-[#777790] uppercase tracking-wider">
        <span>{"// CONTROL DECK"}</span>
        <span className="flex items-center gap-1 text-[#6CD6B3]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6CD6B3] animate-pulse" />
          ACTIVE READY
        </span>
      </div>

      {/* Recessed Total Price Display Bay */}
      <div className="p-4 rounded-2xl bg-[#26264A] shadow-pressed border border-[#383866]/40 space-y-1.5">
        <div className="text-[10px] font-mono font-bold text-[#AAAAC1] uppercase tracking-wider">
          TOTAL PAYABLE (BDT)
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl sm:text-4xl font-black font-mono text-[#F5F5FA] tracking-tight">
            {formatPrice(totalPrice)}
          </span>
          {originalPrice && originalPrice > currentPrice && (
            <span className="text-sm text-[#777790] line-through font-mono">
              {formatPrice(originalPrice * quantity)}
            </span>
          )}
        </div>
        {selectedPlan && (
          <p className="text-[11px] font-mono text-[#716DFF] font-bold">
            Selected: {selectedPlan.name}
          </p>
        )}
      </div>

      {/* Quantity Stepper: Tactile Physical Buttons */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#26264A] shadow-pressed-sm border border-[#383866]/30">
        <span className="text-xs font-mono font-bold text-[#AAAAC1] pl-2 uppercase">
          QUANTITY
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={quantity <= 1}
            className="h-8 w-8 rounded-xl bg-[#303057] shadow-raised-sm hover:shadow-floating active:shadow-pressed disabled:opacity-40 flex items-center justify-center text-[#F5F5FA] transition-all cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center font-mono font-black text-sm text-[#F5F5FA]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
            disabled={quantity >= 10}
            className="h-8 w-8 rounded-xl bg-[#303057] shadow-raised-sm hover:shadow-floating active:shadow-pressed disabled:opacity-40 flex items-center justify-center text-[#F5F5FA] transition-all cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tactile Action Buttons */}
      <div className="space-y-3">
        {/* Primary Buy Now Button */}
        <button
          type="button"
          disabled={!selectedPlan || isOutOfStock}
          onClick={handleBuyNow}
          className={cn(
            "w-full h-13 rounded-full font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px] transition-all cursor-pointer uppercase",
            isOutOfStock
              ? "bg-[#26264A] text-[#777790] cursor-not-allowed pointer-events-none"
              : "bg-gradient-to-r from-[#5754D8] to-[#716DFF] text-white hover:brightness-110"
          )}
        >
          <Zap className="h-4 w-4 fill-white" />
          <span>{isOutOfStock ? "Out of Stock" : "Buy Now (Instant Checkout)"}</span>
        </button>

        {/* Secondary Add to Cart Button */}
        <button
          type="button"
          disabled={!selectedPlan || isOutOfStock}
          onClick={handleAddToCart}
          className="w-full h-12 rounded-full font-bold text-xs sm:text-sm tracking-wide bg-[#303057] hover:bg-[#353560] shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px] text-[#F5F5FA] flex items-center justify-center gap-2 transition-all border border-[#383866]/40 cursor-pointer uppercase"
        >
          <ShoppingBag className="h-4 w-4 text-[#716DFF]" />
          <span>Add to Cart</span>
        </button>

        {/* WhatsApp Assistance Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-11 rounded-full text-xs font-bold font-mono tracking-wide bg-[#26264A] hover:bg-[#2C2C52] text-[#6CD6B3] border border-[#6CD6B3]/30 shadow-pressed-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <MessageCircle className="h-4 w-4 text-[#6CD6B3]" />
          <span>WhatsApp Quick Help</span>
        </a>
      </div>

      {/* Hardware Guarantee Spec Strip */}
      <div className="space-y-2.5 pt-4 border-t border-[#383866]/30 text-xs text-[#AAAAC1]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#6CD6B3] shrink-0" />
          <span>100% Genuine Software License</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#716DFF] shrink-0" />
          <span>Delivery within 5 to 15 minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-[#6CD6B3] shrink-0" />
          <span>bKash &amp; Nagad Manual Verification</span>
        </div>
      </div>
    </div>
  );
};
