"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Zap, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { ProductBadge } from "./ProductBadge";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addItem } = useCart();
  const router = useRouter();

  const lowestPlan = product.plans && product.plans.length > 0 ? product.plans[0] : null;
  const isOutOfStock = product.plans && product.plans.every((p) => p.stock === 0);

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (lowestPlan && !isOutOfStock) {
      addItem(product, lowestPlan, 1);
      router.push("/checkout");
    } else {
      router.push(`/products/${product.slug}`);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-4 shadow-card hover:shadow-card-hover hover:border-primary-300 transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Image Container with Badges */}
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              <ProductBadge
                badge={product.badge}
                isFeatured={product.isFeatured}
                isPopular={product.isPopular}
                discountPercentage={product.discountPercentage}
              />
            </div>

            {/* In stock badge */}
            <div className="absolute bottom-3 right-3 z-10">
              {isOutOfStock ? (
                <span className="rounded-full bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white">
                  Out of stock
                </span>
              ) : (
                <span className="rounded-full bg-emerald-950/80 backdrop-blur-xs border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Instant Delivery
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="space-y-2 px-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
              {product.category?.name || "Digital Suite"}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 text-slate-700 font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({product.ratingCount})
                </span>
              </div>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-primary-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Quick Feature Pills */}
          {product.features && product.features.length > 0 && (
            <div className="pt-1.5 space-y-1">
              {product.features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                  <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 px-1">
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Starting from
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900 tracking-tight">
              {formatPrice(product.startingPrice)}
            </span>
            {product.originalPrice && product.originalPrice > product.startingPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link href={`/products/${product.slug}`}>
            <Button variant="outline" size="sm" className="font-semibold text-xs rounded-xl">
              Plans
            </Button>
          </Link>
          <Button
            variant="gradient"
            size="sm"
            onClick={handleQuickBuy}
            className="font-bold text-xs rounded-xl shadow-xs"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};
