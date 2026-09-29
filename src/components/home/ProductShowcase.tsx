"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

  // Staggered reveal animation
  useGSAP(
    () => {
      if (!gridRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = gridRef.current.children;
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [selectedCategory, filteredProducts.length] }
  );

  return (
    <section ref={sectionRef} id="products" className="py-12 sm:py-16 lg:py-20">
      <Container>
        {/* Intentional Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore Digital Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Browse software access, digital tools and licensed products.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Clean Editorial Horizontal Category Navigation */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-1.5 border-b border-slate-200/80 mb-8 sm:mb-10 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "relative pb-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors select-none cursor-pointer",
              selectedCategory === "all"
                ? "text-primary-600 font-bold"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <span>All</span>
            {selectedCategory === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
            )}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "relative pb-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors select-none cursor-pointer",
                  isSelected
                    ? "text-primary-600 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                <span>{cat.name}</span>
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Exactly 3 Product Cards Per Row On Desktop (>= 1100px) */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 min-[1100px]:grid-cols-3 gap-4 md:gap-5 min-[1100px]:gap-7"
        >
          {filteredProducts.slice(0, 9).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
};
