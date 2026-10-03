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
      <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-6 sm:p-10 shadow-neu-raised space-y-3 animate-neu-fade">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#29294D] border border-[#353560]/40 px-3 py-1 text-xs font-mono font-bold text-[#EF7B98] shadow-neu-pressed">
          <Flame className="h-4 w-4 fill-[#EF7B98] text-[#EF7B98]" /> SPECIAL FLASH OFFERS
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5F5FA] tracking-tight">
          EXCLUSIVE DIGITAL DEALS
        </h1>
        <p className="text-xs sm:text-sm text-[#AAAAC1] max-w-xl leading-relaxed">
          Unlock high-tier AI subscriptions, developer bundles, and lifetime keys with exclusive discount rates.
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
