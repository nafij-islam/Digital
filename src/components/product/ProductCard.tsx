"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";
import { getOptimizedImageUrl } from "@/lib/image/cloudinary";

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  className,
}) => {
  const plans = product.plans || [];
  const isOutOfStock = plans.length > 0 && plans.every((p) => p.stock === 0);

  // Authoritative display price from startingPrice or lowest plan
  const lowestPlanPrice =
    plans.length > 0 ? plans[0].salePrice || plans[0].regularPrice : 0;
  const displayPrice = product.startingPrice || lowestPlanPrice;

  const shortDesc = product.shortDescription || product.description;

  const optimizedImgUrl = getOptimizedImageUrl(product.imageUrl, {
    width: 600,
    quality: "auto:good",
  });

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl p-3.5 sm:p-4 shadow-raised hover:shadow-floating transition-all duration-200 hover:-translate-y-1 overflow-hidden select-none animate-fade-in will-change-transform transform-gpu border",
        className
      )}
      style={{
        backgroundColor: "var(--site-card-bg, #141A2E)",
        borderColor: "var(--site-card-border, #1E2642)",
      }}
    >
      {/* 1. Framed Media Area (Aspect 4/3, rounded-2xl, clean breathing space) */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-pressed border"
        style={{
          backgroundColor: "var(--site-secondary, #0F1424)",
          borderColor: "var(--site-card-border, #1E2642)",
        }}
      >
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {product.imageUrl ? (
            <Image
              src={optimizedImgUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="h-full w-full flex items-center justify-center font-black text-3xl font-mono"
              style={{ color: "var(--site-bright, #818CF8)" }}
            >
              {product.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </Link>

        {/* Optional Featured / Badge (Top Left) */}
        {(product.badge || product.isFeatured) && !isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase shadow-pressed-sm backdrop-blur-xs border"
              style={{
                backgroundColor: "var(--site-secondary, #0F1424)",
                color: "var(--site-bright, #818CF8)",
                borderColor: "var(--site-primary, #6366F1)",
              }}
            >
              {product.badge || "Featured"}
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div
            className="absolute inset-0 backdrop-blur-2xs flex items-center justify-center"
            style={{ backgroundColor: "rgba(11, 15, 25, 0.85)" }}
          >
            <span className="rounded-full bg-[#F43F5E] text-white px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. Content Area (Product Name & Short Description) */}
      <div className="flex-1 flex flex-col justify-between pt-3.5 sm:pt-4 pb-2">
        <div>
          {/* Product Name (18px-20px, font-extrabold, max 2 lines) */}
          <Link
            href={`/products/${product.slug}`}
            className="block text-[18px] sm:text-[20px] font-extrabold leading-[1.3] line-clamp-2 transition-colors font-heading"
            style={{ color: "var(--site-text-main, #F8FAFC)" }}
          >
            {product.name}
          </Link>

          {/* Short Description (max 2 lines, readable) */}
          {shortDesc && (
            <p
              className="text-[14px] line-clamp-2 leading-[1.5] mt-1.5 font-body"
              style={{ color: "var(--site-text-secondary, #CBD5E1)" }}
            >
              {shortDesc}
            </p>
          )}
        </div>

        {/* 3. Main Price & Full-Width CTA */}
        <div className="pt-4 mt-auto space-y-3">
          {/* Main Price & Strikethrough Discount */}
          <div className="flex items-baseline justify-between">
            <span
              className="text-[23px] sm:text-[26px] font-black font-mono tracking-tight leading-none"
              style={{ color: "var(--site-text-main, #F8FAFC)" }}
            >
              {formatPrice(displayPrice)}
            </span>
            {product.originalPrice && product.originalPrice > displayPrice && (
              <span
                className="text-[13px] line-through font-mono"
                style={{ color: "var(--site-text-muted, #94A3B8)" }}
              >
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Single Full-Width Action Button (Height: 46px, Rounded Full) */}
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              "w-full h-11 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-extrabold tracking-wide transition-all shadow-raised active:shadow-pressed active:translate-y-[1px] select-none uppercase",
              isOutOfStock
                ? "cursor-not-allowed pointer-events-none border"
                : "text-white hover:brightness-110 hover:shadow-floating"
            )}
            style={
              isOutOfStock
                ? {
                    backgroundColor: "var(--site-secondary, #0F1424)",
                    color: "var(--site-text-muted, #94A3B8)",
                    borderColor: "var(--site-card-border, #1E2642)",
                  }
                : {
                    background: "linear-gradient(135deg, var(--site-primary, #4F46E5), var(--site-bright, #6366F1))",
                  }
            }
          >
            {isOutOfStock ? "Out of Stock" : "Buy Now"}
          </Link>
        </div>
      </div>
    </article>
  );
};
