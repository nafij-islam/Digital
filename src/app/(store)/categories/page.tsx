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
      <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-6 sm:p-10 shadow-soft space-y-2.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200/60 px-3 py-1 text-xs font-bold text-primary-700">
          <Sparkles className="h-3.5 w-3.5 text-primary-600" /> Organized Digital Categories
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Explore by Category
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
          Find exactly what you need — from generative AI assistants to lifetime operating system licenses.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading categories..." size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-6 shadow-soft hover:shadow-raised hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${
                    category.color || "from-blue-600 to-purple-600"
                  } text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform`}
                >
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {category.description || "Discover verified digital products and subscriptions in this category."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-primary-600">
                <span>{category.productCount ?? 0} Products available</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Products <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
