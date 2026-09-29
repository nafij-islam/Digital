"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { formatPrice } from "@/lib/utils/formatters";
import { Product } from "@/types/product";

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
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [selectedCategory, filteredProducts.length] }
  );

  // Category specific accent background for product media
  const getCategoryBg = (catSlug?: string) => {
    switch (catSlug?.toLowerCase()) {
      case "ai-tools":
        return "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600";
      case "design-tools":
        return "bg-gradient-to-br from-pink-500/10 to-purple-500/10 text-pink-600";
      case "developer-tools":
        return "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-600";
      case "productivity":
        return "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600";
      default:
        return "bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-indigo-600";
    }
  };

  return (
    <section ref={sectionRef} id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Curated Catalog
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Explore Digital Products
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Genuine software subscriptions, licensed passes, and developer tools.
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group shrink-0"
        >
          View all products
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Streamlined Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
          }`}
        >
          All Tools
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat.slug
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Breathable Product Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {filteredProducts.slice(0, 8).map((product) => {
          const categorySlug =
            typeof product.category === "string" ? product.category : product.category?.slug;
          const categoryName =
            typeof product.category === "string" ? product.category : product.category?.name;

          const startingPrice = product.startingPrice || 0;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group rounded-2xl border border-slate-200/90 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-card-hover flex flex-col justify-between"
            >
              <div>
                {/* Product Media Area with Category Tint */}
                <div
                  className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3.5 flex items-center justify-center ${getCategoryBg(
                    categorySlug
                  )}`}
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-xl font-black">{product.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                {/* Category & Title */}
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {categoryName || "Digital Tool"}
                </span>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
                  {product.name}
                </h3>

                {/* Short Useful Description */}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {product.shortDescription || product.description}
                </p>
              </div>

              {/* Price & Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
                  <span className="text-sm font-black text-slate-900">
                    {formatPrice(startingPrice)}
                  </span>
                </div>

                <span className="inline-flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  View Plans <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
