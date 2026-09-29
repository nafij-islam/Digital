"use client";

import React from "react";
import { useDeals } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Flame, Sparkles, Clock, Zap } from "lucide-react";

import { Container } from "@/components/common/Container";

export default function DealsPage() {
  const { data: deals = [], isLoading } = useDeals();

  return (
    <Container className="py-8 sm:py-10 space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-6 sm:p-10 shadow-soft space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-bold text-rose-700">
          <Flame className="h-4 w-4 fill-rose-500 text-rose-500" /> Special Flash Deals
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Exclusive Discounts &amp; Limited Offers
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
          Save up to 75% on genuine software licenses, lifetime retail keys, and extended subscription bundles.
        </p>
      </div>

      {/* Deals Grid */}
      <ProductGrid
        products={deals}
        isLoading={isLoading}
        emptyTitle="No active deals at this moment"
        emptyDescription="Please check back regularly as we update flash deals daily."
      />
    </Container>
  );
}
