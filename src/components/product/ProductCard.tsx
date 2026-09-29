"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const plans = product.plans || [];
  const isOutOfStock = plans.length > 0 && plans.every((p) => p.stock === 0);

  // Authoritative display price from startingPrice or lowest plan
  const lowestPlanPrice =
    plans.length > 0 ? plans[0].salePrice || plans[0].regularPrice : 0;
  const displayPrice = product.startingPrice || lowestPlanPrice;

  const shortDesc = product.shortDescription || product.description;

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-[20px] bg-[var(--site-surface,#FFFFFF)] border border-[rgba(15,23,42,0.07)] p-3.5 sm:p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_36px_rgba(15,23,42,0.1)] transition-all duration-200 hover:-translate-y-1 overflow-hidden",
        "min-h-0 md:min-h-[var(--product-card-height,390px)]",
        className
      )}
    >
      {/* 1. Framed Media Area (Aspect 4/3, rounded 16px, clean breathing space) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-slate-100 border border-slate-200/50">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
              className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 text-xl bg-slate-100">
              {product.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </Link>

        {/* Optional Featured Badge (Only if backend isFeatured is true) */}
        {product.isFeatured && !isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-white/95 text-slate-800 shadow-xs border border-slate-200/80 backdrop-blur-xs">
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
      </div>

      {/* 2. Content Area (Product Name & Optional Short Description) */}
      <div className="flex-1 flex flex-col justify-between pt-3 sm:pt-3.5 pb-2">
        <div>
          {/* Product Name (17px-20px, font-weight 700, max 2 lines) */}
          <Link
            href={`/products/${product.slug}`}
            className="block text-[17px] sm:text-[18px] md:text-[19px] font-bold text-slate-900 leading-[1.25] line-clamp-2 group-hover:text-[var(--site-primary,#356DF3)] transition-colors focus-visible:outline-none"
          >
            {product.name}
          </Link>

          {/* Optional Short Description (max 1-2 lines, 13px-14px, muted) */}
          {shortDesc && (
            <p className="text-[13px] sm:text-[13.5px] text-[#667085] line-clamp-2 leading-[1.4] mt-1.5 font-body">
              {shortDesc}
            </p>
          )}
        </div>

        {/* 3. Main Price & Full-Width CTA */}
        <div className="pt-3 mt-auto space-y-2.5">
          {/* Main Price (৳350 / 21px-25px / font-weight 800) */}
          <div className="flex items-baseline">
            <span className="text-[21px] sm:text-[23px] md:text-[24px] font-extrabold text-slate-900 tracking-tight leading-none">
              {formatPrice(displayPrice)}
            </span>
          </div>

          {/* Single Full-Width Action Button (Height: 44px, Rounded: 11px) */}
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              "w-full h-[44px] rounded-[11px] flex items-center justify-center text-sm font-bold text-white shadow-xs transition-all duration-200 active:scale-[0.99] select-none",
              isOutOfStock
                ? "bg-slate-400 cursor-not-allowed pointer-events-none"
                : "bg-gradient-to-r from-[var(--site-primary,#356DF3)] to-[var(--site-secondary,#7548F5)] hover:opacity-95 hover:shadow-md"
            )}
          >
            {isOutOfStock ? "Out of Stock" : "Buy Now"}
          </Link>
        </div>
      </div>
    </article>
  );
};
