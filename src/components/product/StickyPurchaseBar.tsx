"use client";

import React from "react";
import { Product, ProductPlan } from "@/types/product";
import { formatPrice } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, ShieldCheck, Clock, CheckCircle } from "lucide-react";

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

  const isOutOfStock = selectedPlan ? selectedPlan.stock === 0 : false;
  const currentPrice = selectedPlan ? selectedPlan.salePrice : product.startingPrice;
  const originalPrice = selectedPlan ? selectedPlan.regularPrice : product.originalPrice;

  const handleAddToCart = () => {
    if (!selectedPlan) return;
    addItem(product, selectedPlan, 1);
  };

  const handleBuyNow = () => {
    if (!selectedPlan) return;
    addItem(product, selectedPlan, 1);
    router.push("/checkout");
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl space-y-6 sticky top-24">
      {/* Price section */}
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Total Payable
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            {formatPrice(currentPrice)}
          </span>
          {originalPrice && originalPrice > currentPrice && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        {selectedPlan && (
          <p className="text-xs text-primary-600 font-semibold mt-1">
            Selected: {selectedPlan.name}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-2.5">
        <Button
          variant="gradient"
          size="lg"
          className="w-full font-bold shadow-md shadow-primary-500/20"
          disabled={!selectedPlan || isOutOfStock}
          onClick={handleBuyNow}
        >
          <Zap className="h-4 w-4 mr-1.5 fill-white" />
          {isOutOfStock ? "Out of Stock" : "Buy Now (Instant Checkout)"}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full font-semibold"
          disabled={!selectedPlan || isOutOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4 mr-1.5" />
          Add to Cart
        </Button>
      </div>

      {/* Guarantee & Highlights */}
      <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>100% Genuine &amp; Verified Product</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500 shrink-0" />
          <span>Delivery within 5 to 15 minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-purple-500 shrink-0" />
          <span>bKash &amp; Nagad Manual Verification</span>
        </div>
      </div>
    </div>
  );
};
