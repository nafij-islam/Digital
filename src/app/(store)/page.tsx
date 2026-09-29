"use client";

import React from "react";
import { Hero } from "@/components/home/Hero";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { TrustProcess } from "@/components/home/TrustProcess";
import { FaqCta } from "@/components/home/FaqCta";
import { useProducts, useCategories } from "@/hooks/useProducts";

export default function HomePage() {
  const { data: allProductsData } = useProducts();
  const { data: categories = [] } = useCategories();

  const products = allProductsData?.products || [];

  return (
    <main className="space-y-4 pb-12">
      {/* 1. HERO SECTION WITH DYNAMIC CONFIGURABLE HERO IMAGE */}
      <Hero />

      {/* 2. COMBINED PRODUCTS + CATEGORIES */}
      <ProductShowcase products={products} categories={categories} />

      {/* 3. WHY CHOOSE US / TRUST CONTENT */}
      <TrustProcess />

      {/* 4. FAQ + SUPPORT CTA */}
      <FaqCta />
    </main>
  );
}
