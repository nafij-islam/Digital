"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

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

  const categoryName = product.category?.name || "Digital Tool";

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl bg-white p-4 shadow-soft hover:shadow-raised border border-slate-200/70 transition-all duration-200 hover:-translate-y-0.5",
        className
      )}
    >
      <div>
        {/* Product Image Area */}
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#F7F8FB] border border-slate-200/60 mb-3.5">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 text-lg">
                {product.name.slice(0, 2).toUpperCase()}
              </div>
            )}

            {/* Out of Stock notice if applicable */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
                <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="space-y-1.5 px-0.5">
          {/* Small Category */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 block">
            {categoryName}
          </span>

          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="block font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-primary-600 transition-colors"
          >
            {product.name}
          </Link>

          {/* Short Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>
      </div>

      {/* Pricing & Actions Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 px-0.5">
        <div>
          <span className="text-[10px] font-medium text-slate-400 block leading-tight">
            Starting from
          </span>
          <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            {formatPrice(product.startingPrice)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Link href={`/products/${product.slug}`}>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-8 px-2.5 rounded-lg font-bold"
            >
              <span>Plans</span>
              <ArrowRight className="h-3 w-3 ml-1 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={handleQuickBuy}
            disabled={isOutOfStock}
            className="text-xs h-8 px-2.5 rounded-lg font-bold"
          >
            <Zap className="h-3 w-3 mr-1 fill-white" />
            <span>Buy</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
