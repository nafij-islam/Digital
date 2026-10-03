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
    <div
      className="rounded-3xl shadow-raised-lg p-6 sm:p-7 border space-y-6 static lg:sticky lg:top-24 select-none animate-fade-in"
      style={{
        backgroundColor: "var(--site-details-bg, #141A2E)",
        borderColor: "var(--site-details-border, #1E2642)",
      }}
    >
      {/* Hardware Screw Fixtures in Corners */}
      <div
        className="flex items-center justify-between pb-3 border-b text-[10px] font-mono uppercase tracking-wider"
        style={{
          borderColor: "var(--site-details-border, #1E2642)",
          color: "var(--site-text-muted, #94A3B8)",
        }}
      >
        <span>{"// CONTROL DECK"}</span>
        <span className="flex items-center gap-1 text-[#10B981]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
          ACTIVE READY
        </span>
      </div>

      {/* Recessed Total Price Display Bay */}
      <div
        className="p-4 rounded-2xl shadow-pressed border space-y-1.5"
        style={{
          backgroundColor: "var(--site-details-bay-bg, #0F1424)",
          borderColor: "var(--site-details-border, #1E2642)",
        }}
      >
        <div
          className="text-[10px] font-mono font-bold uppercase tracking-wider"
          style={{ color: "var(--site-text-muted, #94A3B8)" }}
        >
          TOTAL PAYABLE (BDT)
        </div>
        <div className="flex items-baseline gap-2.5">
          <span
            className="text-3xl sm:text-4xl font-black font-mono tracking-tight"
            style={{ color: "var(--site-details-price, #F8FAFC)" }}
          >
            {formatPrice(totalPrice)}
          </span>
          {originalPrice && originalPrice > currentPrice && (
            <span
              className="text-sm line-through font-mono"
              style={{ color: "var(--site-text-muted, #94A3B8)" }}
            >
              {formatPrice(originalPrice * quantity)}
            </span>
          )}
        </div>
        {selectedPlan && (
          <p
            className="text-[11px] font-mono font-bold"
            style={{ color: "var(--site-details-accent, #6366F1)" }}
          >
            Selected: {selectedPlan.name}
          </p>
        )}
      </div>

      {/* Quantity Stepper: Tactile Physical Buttons */}
      <div
        className="flex items-center justify-between p-2.5 rounded-2xl shadow-pressed-sm border"
        style={{
          backgroundColor: "var(--site-details-bay-bg, #0F1424)",
          borderColor: "var(--site-details-border, #1E2642)",
        }}
      >
        <span
          className="text-xs font-mono font-bold pl-2 uppercase"
          style={{ color: "var(--site-text-muted, #94A3B8)" }}
        >
          QUANTITY
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={quantity <= 1}
            className="h-8 w-8 rounded-xl shadow-raised-sm hover:shadow-floating active:shadow-pressed disabled:opacity-40 flex items-center justify-center transition-all cursor-pointer border"
            style={{
              backgroundColor: "var(--site-details-bg, #141A2E)",
              borderColor: "var(--site-details-border, #1E2642)",
              color: "var(--site-text-main, #F8FAFC)",
            }}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span
            className="w-8 text-center font-mono font-black text-sm"
            style={{ color: "var(--site-text-main, #F8FAFC)" }}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
            disabled={quantity >= 10}
            className="h-8 w-8 rounded-xl shadow-raised-sm hover:shadow-floating active:shadow-pressed disabled:opacity-40 flex items-center justify-center transition-all cursor-pointer border"
            style={{
              backgroundColor: "var(--site-details-bg, #141A2E)",
              borderColor: "var(--site-details-border, #1E2642)",
              color: "var(--site-text-main, #F8FAFC)",
            }}
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
              ? "cursor-not-allowed pointer-events-none opacity-60 border"
              : "hover:brightness-110"
          )}
          style={
            isOutOfStock
              ? {
                  backgroundColor: "var(--site-details-bay-bg, #0F1424)",
                  borderColor: "var(--site-details-border, #1E2642)",
                  color: "var(--site-text-muted, #94A3B8)",
                }
              : {
                  background: "linear-gradient(135deg, var(--site-primary, #4F46E5), var(--site-details-accent, #6366F1))",
                  color: "var(--site-details-btn-text, #FFFFFF)",
                }
          }
        >
          <Zap className="h-4 w-4 fill-white" />
          <span>{isOutOfStock ? "Out of Stock" : "Buy Now (Instant Checkout)"}</span>
        </button>

        {/* Secondary Add to Cart Button */}
        <button
          type="button"
          disabled={!selectedPlan || isOutOfStock}
          onClick={handleAddToCart}
          className="w-full h-12 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px] flex items-center justify-center gap-2 transition-all border cursor-pointer uppercase"
          style={{
            backgroundColor: "var(--site-details-bay-bg, #0F1424)",
            borderColor: "var(--site-details-border, #1E2642)",
            color: "var(--site-text-main, #F8FAFC)",
          }}
        >
          <ShoppingBag className="h-4 w-4" style={{ color: "var(--site-details-accent, #6366F1)" }} />
          <span>Add to Cart</span>
        </button>

        {/* WhatsApp Assistance Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-11 rounded-full text-xs font-bold font-mono tracking-wide shadow-pressed-sm flex items-center justify-center gap-2 transition-all cursor-pointer border"
          style={{
            backgroundColor: "var(--site-details-bay-bg, #0F1424)",
            borderColor: "rgba(16, 185, 129, 0.3)",
            color: "#10B981",
          }}
        >
          <MessageCircle className="h-4 w-4 text-[#10B981]" />
          <span>WhatsApp Quick Help</span>
        </a>
      </div>

      {/* Hardware Guarantee Spec Strip */}
      <div
        className="space-y-2.5 pt-4 border-t text-xs"
        style={{
          borderColor: "var(--site-details-border, #1E2642)",
          color: "var(--site-text-muted, #94A3B8)",
        }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#10B981] shrink-0" />
          <span>100% Genuine Software License</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0" style={{ color: "var(--site-details-accent, #6366F1)" }} />
          <span>Delivery within 5 to 15 minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-[#10B981] shrink-0" />
          <span>bKash &amp; Nagad Manual Verification</span>
        </div>
      </div>
    </div>
  );
};
