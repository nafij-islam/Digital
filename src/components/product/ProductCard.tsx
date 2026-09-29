"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

interface ProductCardProps {
  product: Product;
  className?: string;
}

// Category gradient accent mapping for top card stripe
function getCategoryGradient(categoryName: string): string {
  const lower = categoryName.toLowerCase();
  if (lower.includes("design") || lower.includes("creative")) {
    return "from-[#7548F5] to-[#EC4899]"; // Purple → Pink
  }
  if (lower.includes("dev") || lower.includes("code") || lower.includes("tech")) {
    return "from-[#06B6D4] to-[#356DF3]"; // Cyan → Blue
  }
  if (lower.includes("productivity") || lower.includes("office") || lower.includes("utility")) {
    return "from-[#356DF3] to-[#06B6D4]"; // Blue → Cyan
  }
  // Default (AI, Streaming, General Tools)
  return "from-[#356DF3] to-[#7548F5]"; // Primary Blue → Purple
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const plans = product.plans || [];
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.length > 0 ? plans[0].id : ""
  );

  const selectedPlan =
    plans.find((p) => p.id === selectedPlanId) ||
    (plans.length > 0 ? plans[0] : null);

  const isOutOfStock =
    plans.length > 0 && plans.every((p) => p.stock === 0);

  const isLimitedStock =
    !isOutOfStock &&
    selectedPlan &&
    selectedPlan.stock > 0 &&
    selectedPlan.stock <= 5;

  // Active price & original price calculation
  const displayPrice = selectedPlan ? selectedPlan.salePrice : product.startingPrice;
  const displayRegularPrice = selectedPlan
    ? selectedPlan.regularPrice > selectedPlan.salePrice
      ? selectedPlan.regularPrice
      : undefined
    : product.originalPrice && product.originalPrice > product.startingPrice
    ? product.originalPrice
    : undefined;

  const discountPercent =
    displayRegularPrice && displayRegularPrice > displayPrice
      ? Math.round(((displayRegularPrice - displayPrice) / displayRegularPrice) * 100)
      : undefined;

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "Digital Tool";

  const deliveryText = (() => {
    if (product.deliveryInfo) return product.deliveryInfo;
    switch (product.deliveryType) {
      case "LICENSE_KEY":
      case "ACTIVATION_LINK":
      case "DOWNLOAD_LINK":
        return "Instant Delivery";
      case "ACCOUNT_CREDENTIAL":
        return "Manual Verification";
      default:
        return "Digital Delivery";
    }
  })();

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between h-full rounded-[18px] bg-white border border-slate-900/[0.08] shadow-soft hover:shadow-raised transition-all duration-200 hover:-translate-y-1 overflow-hidden select-none",
        className
      )}
    >
      {/* 1. Top Branded Category Accent (6px) */}
      <div
        className={cn(
          "h-1.5 w-full bg-gradient-to-r shrink-0 transition-opacity",
          getCategoryGradient(categoryName)
        )}
      />

      {/* Card Content Wrapper */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        {/* Upper Information Section */}
        <div>
          {/* 1. Product Image Area (aspect 16/10, rounded 13px) */}
          <Link
            href={`/products/${product.slug}`}
            className="block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-[13px]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[13px] bg-[#F7F8FB] border border-slate-200/60">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 text-lg bg-slate-100/70">
                  {product.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              {/* Out of Stock Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center">
                  <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Optional Subtle Badge */}
              {product.badge && !isOutOfStock && (
                <div className="absolute top-2.5 left-2.5 pointer-events-none">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-white/95 text-slate-800 shadow-sm border border-slate-200/60 backdrop-blur-xs">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* 2. Category */}
          <span className="text-[11.5px] font-bold tracking-[0.04em] uppercase text-primary-600 block mt-3.5 leading-none">
            {categoryName}
          </span>

          {/* 3. Product Title */}
          <Link
            href={`/products/${product.slug}`}
            className="block text-[16px] sm:text-[17px] font-bold text-[#101828] leading-[1.35] line-clamp-2 min-h-[2.7rem] group-hover:text-primary-600 transition-colors mt-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded"
          >
            {product.name}
          </Link>

          {/* 4. Short Description */}
          <p className="text-[13px] sm:text-[13.5px] text-[#667085] line-clamp-2 leading-[1.5] min-h-[2.5rem] mt-1.5">
            {product.shortDescription || product.description}
          </p>

          {/* 5. Plan / Duration Options */}
          {plans.length > 0 && (
            <div className="mt-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  Plan
                </span>
                {plans.length > 3 && (
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-[10.5px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    +{plans.length - 3} More
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {plans.slice(0, 3).map((plan) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  const isPlanOut = plan.stock === 0;

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isPlanOut) setSelectedPlanId(plan.id);
                      }}
                      disabled={isPlanOut}
                      aria-pressed={isSelected}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all duration-150 border select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50",
                        isSelected
                          ? "bg-primary-50 text-primary-700 border-primary-500/80 shadow-inset font-bold"
                          : "bg-[#F7F8FB] text-slate-700 border-slate-200/80 hover:bg-white hover:text-slate-900 hover:shadow-soft active:shadow-inset",
                        isPlanOut && "opacity-40 line-through cursor-not-allowed pointer-events-none"
                      )}
                    >
                      {plan.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Lower Price, Availability & CTA Section */}
        <div className="mt-auto pt-3">
          {/* 6. Price Area */}
          <div className="mt-1">
            <span className="text-[11px] font-medium text-slate-400 block leading-tight mb-1">
              {selectedPlan ? "Price" : "Starting from"}
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[22px] sm:text-[24px] font-extrabold text-[#101828] tracking-tight leading-none">
                {formatPrice(displayPrice)}
              </span>
              {displayRegularPrice && (
                <span className="text-xs text-slate-400 line-through font-normal">
                  {formatPrice(displayRegularPrice)}
                </span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="text-[10.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 leading-none">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* 7. Availability / Delivery Info */}
          <div className="mt-2.5 flex items-center justify-between text-[11.5px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              {isOutOfStock ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  <span className="text-slate-500 font-semibold text-[11.5px]">Out of Stock</span>
                </>
              ) : isLimitedStock ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-700 font-semibold text-[11.5px]">Limited Stock</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-700 font-semibold text-[11.5px]">Available</span>
                </>
              )}
            </div>

            <span className="text-slate-500 text-[11px] truncate max-w-[140px]">
              {deliveryText}
            </span>
          </div>

          {/* 8. Full-Width Primary CTA */}
          <div className="mt-3.5">
            <Link
              href={`/products/${product.slug}${selectedPlan ? `?plan=${selectedPlan.id}` : ""}`}
              className={cn(
                "group/cta relative flex w-full items-center justify-center gap-2 h-12 rounded-[11px] text-white text-sm font-bold shadow-soft transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 active:scale-[0.99] border border-white/15",
                isOutOfStock
                  ? "bg-slate-300 text-slate-500 pointer-events-none shadow-none border-transparent"
                  : "hover:shadow-raised hover:brightness-105 active:shadow-pressed"
              )}
              style={
                !isOutOfStock
                  ? {
                      background: "linear-gradient(135deg, #356DF3, #7548F5)",
                    }
                  : undefined
              }
            >
              <span>{isOutOfStock ? "Out of Stock" : "View Plans & Buy"}</span>
              {!isOutOfStock && (
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1 shrink-0" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
