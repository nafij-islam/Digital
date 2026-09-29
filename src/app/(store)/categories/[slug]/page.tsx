"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data: categories = [] } = useCategories();
  const currentCategory = categories.find((c) => c.slug === slug || c.id === slug);

  const { data, isLoading } = useProducts({ category: slug });
  const products = data?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/categories" className="hover:text-slate-900 transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-900 font-semibold">
          {currentCategory?.name || slug}
        </span>
      </nav>

      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Category Showcase
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {currentCategory?.name || "Category Products"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            {currentCategory?.description ||
              "Explore all verified digital tools and subscription plans in this category."}
          </p>
        </div>

        <Link href="/categories">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
            All Categories
          </Button>
        </Link>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        emptyTitle={`No products found in ${currentCategory?.name || "this category"}`}
        emptyDescription="We are constantly adding new digital tools. Check back shortly!"
      />
    </div>
  );
}
