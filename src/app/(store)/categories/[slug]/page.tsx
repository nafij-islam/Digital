"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

import { Container } from "@/components/common/Container";

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data: categories = [] } = useCategories();
  const currentCategory = categories.find((c) => c.slug === slug || c.id === slug);

  const { data, isLoading } = useProducts({ category: slug });
  const products = data?.products || [];

  return (
    <Container className="py-8 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#AAAAC1] font-mono overflow-x-auto no-scrollbar py-1">
        <Link href="/" className="hover:text-[#F5F5FA] transition-colors shrink-0">
          CONSOLE
        </Link>
        <ChevronRight className="h-3 w-3 text-[#777790] shrink-0" />
        <Link href="/categories" className="hover:text-[#F5F5FA] transition-colors shrink-0">
          SECTORS
        </Link>
        <ChevronRight className="h-3 w-3 text-[#777790] shrink-0" />
        <span className="text-[#716DFF] font-bold truncate shrink-0">
          {currentCategory?.name || slug}
        </span>
      </nav>

      {/* Header */}
      <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-6 sm:p-8 shadow-neu-raised flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-neu-fade">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#716DFF]">
            CATEGORY ARCHIVE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F5FA] tracking-tight mt-1">
            {currentCategory?.name || "Category Products"}
          </h1>
          <p className="text-xs sm:text-sm text-[#AAAAC1] mt-1 max-w-xl">
            {currentCategory?.description ||
              "Explore all verified digital tools and subscriptions in this category."}
          </p>
        </div>

        <Link href="/categories">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
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
    </Container>
  );
}
