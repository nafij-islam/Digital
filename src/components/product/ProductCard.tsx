"use client";

import React from "react";
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

// Media region subtle category tint
function getCategoryMediaBg(categoryName: string): string {
  const lower = categoryName.toLowerCase();
  if (lower.includes("design") || lower.includes("creative")) {
    return "bg-purple-50/70 border-purple-100/60";
  }
  if (lower.includes("dev") || lower.includes("code") || lower.includes("tech")) {
    return "bg-cyan-50/70 border-cyan-100/60";
  }
  if (lower.includes("productivity") || lower.includes("office") || lower.includes("utility")) {
    return "bg-blue-50/70 border-blue-100/60";
  }
  return "bg-slate-50 border-slate-200/50";
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const plans = product.plans || [];
  const lowestPlan = plans.length > 0 ? plans[0] : null;

  const isOutOfStock =
    plans.length > 0 && plans.every((p) => p.stock === 0);

  const isLimitedStock =
    !isOutOfStock &&
    plans.some((p) => p.stock > 0 && p.stock <= 5);

  const regularPrice =
    product.originalPrice && product.originalPrice > product.startingPrice
      ? product.originalPrice
      : lowestPlan && lowestPlan.regularPrice > product.startingPrice
      ? lowestPlan.regularPrice
      : undefined;

  const discountPercent =
    regularPrice && regularPrice > product.startingPrice
      ? Math.round(((regularPrice - product.startingPrice) / regularPrice) * 100)
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
        return "Instant digital delivery";
      case "ACCOUNT_CREDENTIAL":
        return "Manual verification";
      default:
        return "Digital delivery";
    }
  })();

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between h-full rounded-[18px] sm:rounded-[20px] bg-[var(--site-surface,#FFFFFF)] border border-[var(--site-border,rgba(15,23,42,0.08))] shadow-soft hover:shadow-raised hover:border-primary-500/35 transition-all duration-200 hover:-translate-y-1.25 overflow-hidden",
        className
      )}
    >
      {/* 1. Large Product Media Frame (occupies ~42%-46% height, aspect 16/9, subtle category tint) */}
      <div className={cn("p-3 sm:p-3.5 border-b", getCategoryMediaBg(categoryName))}>
        <Link
          href={`/products/${product.slug}`}
          className="block relative aspect-[16/9] w-full overflow-hidden rounded-[13px] bg-white border border-slate-200/60 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
              className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.025]"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 text-lg bg-slate-100/70">
              {product.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          {/* Genuine Backend Badges Only (no fake ratings/badges) */}
          {product.isFeatured && !isOutOfStock && (
            <div className="absolute top-2.5 left-2.5 pointer-events-none">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-white/95 text-slate-800 shadow-xs border border-slate-200/80 backdrop-blur-xs">
                Featured
              </span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center">
              <span className="rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                Out of Stock
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Card Content Area (20px-22px internal padding) */}
      <div className="p-5 sm:p-5.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className="text-[11.5px] font-bold tracking-[0.04em] uppercase text-primary-600 block leading-none">
            {categoryName}
          </span>

          {/* Product Name (20px–22px desktop, 18px–20px mobile, font-weight 700) */}
          <Link
            href={`/products/${product.slug}`}
            className="block text-[18px] sm:text-[21px] font-bold text-slate-900 leading-[1.3] line-clamp-2 mt-2 group-hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded"
          >
            {product.name}
          </Link>

          {/* Short Description (14px–15px, color #667085, max 2 lines) */}
          <p className="text-[13.5px] sm:text-[14px] text-[#667085] line-clamp-2 leading-[1.5] mt-1.5 min-h-[2.6rem]">
            {product.shortDescription || product.description}
          </p>

          {/* Plans Display (Concise text representation, no noisy pill clusters) */}
          {plans.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100/90">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                Available Plans
              </div>
              <div className="text-xs sm:text-[13px] font-medium text-slate-700 truncate">
                {plans.length <= 3
                  ? plans.map((p) => p.name).join(" · ")
                  : `${plans.slice(0, 3).map((p) => p.name).join(" · ")} · +${plans.length - 3} more`}
              </div>
            </div>
          )}
        </div>

        {/* 3. Card Footer (Price, Availability & Refined Action CTA) */}
        <div className="mt-auto pt-4 border-t border-slate-100/90 space-y-3">
          {/* Price Hierarchy */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-none mb-1">
              From
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[22px] sm:text-[24px] font-extrabold text-slate-900 tracking-tight leading-none">
                {formatPrice(product.startingPrice)}
              </span>
              {regularPrice && regularPrice > product.startingPrice && (
                <span className="text-xs text-slate-400 line-through font-normal">
                  {formatPrice(regularPrice)}
                </span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="text-[11px] font-bold text-emerald-600">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Minimal Availability & Delivery info */}
          <div className="flex items-center justify-between text-[11.5px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              {isOutOfStock ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  <span className="text-slate-500 font-semibold">Out of Stock</span>
                </>
              ) : isLimitedStock ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-700 font-semibold">Limited</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-700 font-semibold">Available</span>
                </>
              )}
            </div>

            <span className="text-slate-400 text-[11px] truncate max-w-[150px]">
              {deliveryText}
            </span>
          </div>

          {/* Refined Action CTA: Explore Product → */}
          <Link
            href={`/products/${product.slug}`}
            className="group/cta pt-2 flex items-center justify-between text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded"
          >
            <span>Explore Product</span>
            <div className="h-8 w-8 rounded-full bg-primary-50 group-hover/cta:bg-primary-500 group-hover/cta:text-white text-primary-600 flex items-center justify-center transition-all duration-200 shadow-xs">
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.75" />
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
};
