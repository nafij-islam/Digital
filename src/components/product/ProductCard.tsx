"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";
import { Play, Sparkles } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/image/cloudinary";

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  className,
}) => {
  const plans = product.plans || [];
  const isOutOfStock = plans.length > 0 && plans.every((p) => p.stock === 0);

  const lowestPlanPrice =
    plans.length > 0 ? plans[0].salePrice || plans[0].regularPrice : 0;
  const displayPrice = product.startingPrice || lowestPlanPrice;
  const shortDesc = product.shortDescription || product.description;

  const optimizedImgUrl = getOptimizedImageUrl(product.imageUrl, {
    width: 600,
    quality: "auto:good",
  });

  // Zero-padded index for console cartridge styling (01 // PROTOCOL)
  const paddedIndex = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl bg-[#303057] p-5 sm:p-6 shadow-raised hover:shadow-floating transition-all duration-300 hover:-translate-y-1 border border-[#383866]/30 select-none animate-fade-in",
        className
      )}
    >
      {/* 1. TOP META ROW: e.g. 01 // PROTOCOL + Tag */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#383866]/30 text-[11px] font-mono">
        <span className="text-[#AAAAC1] font-bold tracking-wider">
          {paddedIndex} {"// PROTOCOL"}
        </span>

        {product.badge ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#26264A] text-[#716DFF] border border-[#716DFF]/30 shadow-pressed-sm">
            {product.badge}
          </span>
        ) : product.isFeatured ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#26264A] text-[#6CD6B3] border border-[#6CD6B3]/30 shadow-pressed-sm">
            FEATURED
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#26264A] text-[#AAAAC1] border border-[#383866]/40 shadow-pressed-sm">
            GENUINE
          </span>
        )}
      </div>

      {/* 2. MIDDLE CONTENT ROW: Cartridge Emblem + Title & Description */}
      <div className="py-4 space-y-3">
        <div className="flex items-start gap-3.5">
          {/* Square Tactile Icon Bay */}
          <Link
            href={`/products/${product.slug}`}
            className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-[#26264A] shadow-pressed flex items-center justify-center overflow-hidden shrink-0 border border-[#383866]/40 group-hover:scale-105 transition-transform"
          >
            {product.imageUrl ? (
              <Image
                src={optimizedImgUrl}
                alt={product.name}
                fill
                sizes="64px"
                className="object-cover p-1 rounded-xl"
              />
            ) : (
              <div className="font-extrabold text-[#716DFF] text-lg font-mono">
                {product.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </Link>

          {/* Title and Short Description */}
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.slug}`}
              className="block font-black text-base sm:text-lg text-[#F5F5FA] group-hover:text-[#716DFF] transition-colors truncate font-heading uppercase"
            >
              {product.name}
            </Link>
            {shortDesc && (
              <p className="text-xs text-[#AAAAC1] line-clamp-2 leading-relaxed mt-1 font-body">
                {shortDesc}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: Recessed Price Tag + Tactile "Play Game ▶" Pill Button */}
      <div className="pt-3.5 border-t border-[#383866]/30 flex items-center justify-between gap-3 mt-auto">
        {/* Recessed Price Module */}
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold tracking-wider text-[#777790] uppercase">
            BEST PRICE
          </span>
          <span className="text-base sm:text-lg font-black font-mono text-[#F5F5FA]">
            {formatPrice(displayPrice)}
          </span>
        </div>

        {/* Tactile Pill Action Button directly matching reference image */}
        <Link
          href={`/products/${product.slug}`}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all shadow-raised active:shadow-pressed active:translate-y-[1px]",
            isOutOfStock
              ? "bg-[#26264A] text-[#777790] cursor-not-allowed pointer-events-none"
              : "bg-gradient-to-r from-[#5754D8] to-[#716DFF] text-white hover:brightness-110 shadow-raised hover:shadow-floating"
          )}
        >
          <span>{isOutOfStock ? "Sold Out" : "Play Game"}</span>
          {!isOutOfStock && <Play className="h-3 w-3 fill-current ml-0.5" />}
        </Link>
      </div>
    </article>
  );
};
