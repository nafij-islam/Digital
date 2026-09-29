"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useProducts";
import { Layers, ArrowRight, Sparkles } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 sm:p-12 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" /> Organized Digital Categories
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Explore by Category
        </h1>
        <p className="text-xs sm:text-sm text-white/80 max-w-xl">
          Find exactly what you need — from generative AI assistants to lifetime operating system licenses.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading categories..." size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group rounded-3xl border border-slate-200/90 bg-white p-7 shadow-card hover:shadow-card-hover hover:border-primary-300 transition-all duration-200 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div
                  className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${
                    category.color || "from-blue-600 to-purple-600"
                  } text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Layers className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {category.description || "Discover verified digital products and subscriptions in this category."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-primary-600">
                <span>{category.productCount ?? 0} Products available</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Products <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
