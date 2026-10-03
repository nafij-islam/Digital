"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useProducts";
import { Layers, ArrowRight, Sparkles } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

import { Container } from "@/components/common/Container";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <Container className="py-8 sm:py-10 space-y-8">
      <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-6 sm:p-10 shadow-neu-raised space-y-2.5 animate-neu-fade">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#29294D] border border-[#353560]/40 px-3 py-1 text-xs font-mono font-bold text-[#716DFF] shadow-neu-pressed">
          <Sparkles className="h-3.5 w-3.5 text-[#716DFF]" /> PRODUCT DIRECTORY
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5F5FA] tracking-tight">
          PRODUCT CATEGORIES
        </h1>
        <p className="text-xs sm:text-sm text-[#AAAAC1] max-w-xl">
          Browse verified AI tools, creative suites, developer licenses, and cloud subscriptions.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading product categories..." size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group rounded-3xl border border-[#353560]/40 bg-[#303057] p-6 shadow-neu-raised hover:shadow-neu-floating transition-all duration-300 flex flex-col justify-between space-y-5 animate-neu-fade"
            >
              <div className="space-y-4">
                <div
                  className="h-12 w-12 rounded-2xl bg-[#29294D] text-[#716DFF] flex items-center justify-center shadow-neu-pressed border border-[#353560]/40 group-hover:scale-105 transition-transform"
                >
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F5F5FA] group-hover:text-[#716DFF] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#AAAAC1] mt-1 leading-relaxed">
                    {category.description || "Discover verified digital subscriptions and access keys in this category."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#353560]/40 text-xs font-mono font-bold text-[#716DFF]">
                <span className="text-[#AAAAC1]">{category.productCount ?? 0} Products</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Category <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
