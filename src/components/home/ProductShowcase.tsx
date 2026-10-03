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
        {/* Section Header matching reference image: CONSOLE LIBRARY // SELECT CARTRIDGE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-[#716DFF] uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#716DFF]" />
              CONSOLE LIBRARY
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5F5FA] tracking-tight uppercase font-heading">
              SELECT CARTRIDGE
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#AAAAC1] max-w-md leading-relaxed font-body">
            Tactile client-side mini games and verified software passes. All state, animations, and delivery keys execute client-side with instant response.
          </p>
        </div>

        {/* Soft Neumorphic Category Tabs Dock */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap",
              selectedCategory === "all"
                ? "bg-[#303057] text-[#F5F5FA] shadow-raised-sm border border-[#716DFF]/40"
                : "bg-[#26264A] text-[#AAAAC1] hover:text-[#F5F5FA] hover:bg-[#303057]/50 shadow-pressed-sm border border-[#383866]/30"
            )}
          >
            All Cartridges
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap",
                  isSelected
                    ? "bg-[#303057] text-[#F5F5FA] shadow-raised-sm border border-[#716DFF]/40"
                    : "bg-[#26264A] text-[#AAAAC1] hover:text-[#F5F5FA] hover:bg-[#303057]/50 shadow-pressed-sm border border-[#383866]/30"
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* 3x2 Cartridge Grid directly matching reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-3xl bg-[#303057] shadow-raised p-12 text-center border border-[#383866]/30">
            <Layers className="h-10 w-10 text-[#716DFF] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#F5F5FA]">No Cartridges Found</h3>
            <p className="text-xs text-[#AAAAC1] mt-1">Try selecting another category or view all products.</p>
          </div>
        )}
      </Container>
    </section>
  );
};
