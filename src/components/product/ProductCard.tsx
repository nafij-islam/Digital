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
        "group relative flex flex-col justify-between rounded-3xl bg-[#303057] border border-[#383866]/40 p-3.5 sm:p-4 shadow-raised hover:shadow-floating transition-all duration-300 hover:-translate-y-1 overflow-hidden select-none animate-fade-in",
        className
      )}
    >
      {/* 1. Framed Media Area (Aspect 4/3, rounded-2xl, clean breathing space) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#26264A] shadow-pressed border border-[#383866]/40">
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
            <div className="h-full w-full flex items-center justify-center font-bold text-[#716DFF] text-2xl font-mono">
              {product.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </Link>

        {/* Optional Featured / Badge (Top Left) */}
        {(product.badge || product.isFeatured) && !isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#26264A]/90 text-[#716DFF] shadow-pressed-sm border border-[#716DFF]/40 backdrop-blur-xs">
              {product.badge || "Featured"}
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#1E1E38]/85 backdrop-blur-2xs flex items-center justify-center">
            <span className="rounded-full bg-[#EF7B98] text-white px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. Content Area (Product Name & Short Description) */}
      <div className="flex-1 flex flex-col justify-between pt-3 sm:pt-3.5 pb-2">
        <div>
          {/* Product Name (17px-19px, font-bold, max 2 lines) */}
          <Link
            href={`/products/${product.slug}`}
            className="block text-[17px] sm:text-[18px] font-bold text-[#F5F5FA] leading-[1.3] line-clamp-2 group-hover:text-[#716DFF] transition-colors font-heading"
          >
            {product.name}
          </Link>

          {/* Short Description (max 2 lines, 13px, muted) */}
          {shortDesc && (
            <p className="text-[13px] text-[#AAAAC1] line-clamp-2 leading-[1.45] mt-1.5 font-body">
              {shortDesc}
            </p>
          )}
        </div>

        {/* 3. Main Price & Full-Width CTA */}
        <div className="pt-3.5 mt-auto space-y-2.5">
          {/* Main Price & Strikethrough Discount */}
          <div className="flex items-baseline justify-between">
            <span className="text-[21px] sm:text-[23px] font-black text-[#F5F5FA] font-mono tracking-tight leading-none">
              {formatPrice(displayPrice)}
            </span>
            {product.originalPrice && product.originalPrice > displayPrice && (
              <span className="text-xs text-[#777790] line-through font-mono">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Single Full-Width Action Button (Height: 44px, Rounded Full) */}
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              "w-full h-11 rounded-full flex items-center justify-center text-sm font-bold tracking-wide transition-all shadow-raised active:shadow-pressed active:translate-y-[1px] select-none uppercase",
              isOutOfStock
                ? "bg-[#26264A] text-[#777790] cursor-not-allowed pointer-events-none"
                : "bg-gradient-to-r from-[#5754D8] to-[#716DFF] text-white hover:brightness-110 hover:shadow-floating"
            )}
          >
            {isOutOfStock ? "Out of Stock" : "Buy Now"}
          </Link>
        </div>
      </div>
    </article>
  );
};
