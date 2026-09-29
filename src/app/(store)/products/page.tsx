"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { ProductFilterParams } from "@/types/product";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<ProductFilterParams["sortBy"]>("featured");

  const filterParams: ProductFilterParams = useMemo(
    () => ({
      search: search || undefined,
      category: selectedCategory || undefined,
      sortBy,
    }),
    [search, selectedCategory, sortBy]
  );

  const { data, isLoading } = useProducts(filterParams);
  const { data: categories = [] } = useCategories();
  const products = data?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
            <Sparkles className="h-3.5 w-3.5" /> Official Marketplace Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            All Digital Products &amp; Tools
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl">
            Browse verified digital subscriptions, developer tools, and license keys with instant bKash/Nagad checkout.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-black">{products.length}</span>
          <div className="text-xs text-white/80">Available Products</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name or keyword..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Category Pills & Sorting */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="w-full sm:w-48">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full sm:w-44">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Added</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
