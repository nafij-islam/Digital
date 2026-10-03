"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { ProductFilterParams } from "@/types/product";

import { Container } from "@/components/common/Container";

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
    <Container className="py-8 sm:py-10 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-6 sm:p-8 shadow-neu-raised flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden animate-neu-fade">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#29294D] border border-[#353560]/40 px-3 py-1 text-xs font-mono font-bold text-[#716DFF] shadow-neu-pressed">
            <Sparkles className="h-3.5 w-3.5 text-[#716DFF]" /> PROTOCOL {"//"} ALL CARTRIDGES
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5F5FA] tracking-tight">
            CONSOLE LIBRARY CATALOG
          </h1>
          <p className="text-xs sm:text-sm text-[#AAAAC1] max-w-xl">
            Browse verified digital cartridges, cloud services, and tools with instant physical activation.
          </p>
        </div>

        <div className="text-left md:text-right shrink-0 relative z-10">
          <div className="inline-block p-4 rounded-2xl bg-[#29294D] shadow-neu-pressed border border-[#353560]/40">
            <span className="text-2xl sm:text-3xl font-black text-[#6CD6B3]">{products.length}</span>
            <div className="text-[10px] text-[#777790] uppercase tracking-wider font-mono">Available Titles</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-4 shadow-neu-raised flex flex-col md:flex-row items-center justify-between gap-4 animate-neu-fade">
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
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
