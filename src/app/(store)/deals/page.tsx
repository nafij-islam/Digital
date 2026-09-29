"use client";

import React from "react";
import { useDeals } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Flame, Sparkles, Clock, Zap } from "lucide-react";

export default function DealsPage() {
  const { data: deals = [], isLoading } = useDeals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 p-8 sm:p-12 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
          <Flame className="h-4 w-4 fill-white text-white" /> Special Flash Deals
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Exclusive Discounts &amp; Limited Offers
        </h1>
        <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
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
    </div>
  );
}
