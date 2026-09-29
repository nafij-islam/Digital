"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductShowcaseProps {
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => {
          const cat = typeof p.category === "string" ? p.category : p.category?.slug;
          return cat?.toLowerCase() === selectedCategory.toLowerCase();
        });

  // Staggered reveal using GSAP ScrollTrigger
  useGSAP(
    () => {
      if (!gridRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = gridRef.current.children;
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [selectedCategory, filteredProducts.length] }
  );

  return (
    <section ref={sectionRef} id="products" className="py-10 lg:py-16">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 block">
              Curated Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Explore Digital Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
              Genuine software subscriptions, licensed passes, and developer tools with manual payment verification.
            </p>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 group shrink-0"
          >
            <span>View all products</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Tactile Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-soft"
                : "bg-white text-slate-600 border border-slate-200/80 shadow-soft hover:bg-[#F7F8FB] hover:text-slate-900"
            )}
          >
            All Products
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                  isSelected
                    ? "bg-primary-500 text-white shadow-soft"
                    : "bg-white text-slate-600 border border-slate-200/80 shadow-soft hover:bg-[#F7F8FB] hover:text-slate-900"
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Responsive Product Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
};
