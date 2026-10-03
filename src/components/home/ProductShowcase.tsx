"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils/cn";

interface ProductShowcaseProps {
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => {
          const cat = typeof p.category === "string" ? p.category : p.category?.slug;
          return cat?.toLowerCase() === selectedCategory.toLowerCase() || p.categoryId === selectedCategory;
        });

  return (
    <section id="products" className="py-12 sm:py-16 lg:py-20">
      <Container>
        {/* Section Header matching reference image: DIGITAL PRODUCTS // SELECT SUBSCRIPTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[12px] font-mono font-bold tracking-widest text-[#818CF8] uppercase">
              <span className="h-2 w-2 rounded-full bg-[#6366F1] animate-pulse" />
              DIGITAL PRODUCTS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F8FAFC] tracking-tight uppercase font-heading">
              SELECT SUBSCRIPTION
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#CBD5E1] max-w-md leading-relaxed font-body">
            Genuine accounts, AI subscriptions, and software license keys. All credentials dispatched instantly to your private order vault with full warranty.
          </p>
        </div>

        {/* Soft Neumorphic Category Tabs Dock */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none whitespace-nowrap",
              selectedCategory === "all"
                ? "bg-[#141A2E] text-[#F8FAFC] shadow-raised-sm border border-[#6366F1]/50"
                : "bg-[#0F1424] text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#141A2E] shadow-pressed-sm border border-[#1E2642]"
            )}
          >
            All Products
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none whitespace-nowrap",
                  isSelected
                    ? "bg-[#141A2E] text-[#F8FAFC] shadow-raised-sm border border-[#6366F1]/50"
                    : "bg-[#0F1424] text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#141A2E] shadow-pressed-sm border border-[#1E2642]"
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* 3x2 Product Grid directly matching reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-3xl bg-[#141A2E] shadow-raised p-12 text-center border border-[#1E2642]">
            <Layers className="h-10 w-10 text-[#818CF8] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#F8FAFC]">No Products Found</h3>
            <p className="text-sm text-[#CBD5E1] mt-1.5">Try selecting another category or view all products.</p>
          </div>
        )}
      </Container>
    </section>
  );
};
