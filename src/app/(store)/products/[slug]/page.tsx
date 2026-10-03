"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Truck,
  FileText,
  AlertTriangle,
  ArrowLeft,
  Gamepad2,
  Check,
} from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { PlanSelector } from "@/components/product/PlanSelector";
import { StickyPurchaseBar } from "@/components/product/StickyPurchaseBar";
import { ProductBadge } from "@/components/product/ProductBadge";
import { ProductPlan } from "@/types/product";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { Container } from "@/components/common/Container";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data: product, isLoading, error } = useProduct(slug);
  const [selectedPlan, setSelectedPlan] = useState<ProductPlan | null>(null);

  // Default to popular or first active plan
  useEffect(() => {
    if (product && product.plans && product.plans.length > 0) {
      const defaultPlan = product.plans.find((p) => p.isPopular) || product.plans[0];
      setSelectedPlan(defaultPlan);
    }
  }, [product]);

  if (isLoading) {
    return (
      <Container className="py-32 flex flex-col items-center justify-center">
        <div className="h-14 w-14 rounded-full bg-[#303057] shadow-raised flex items-center justify-center">
          <LoadingSpinner text="" size="md" />
        </div>
        <p className="mt-4 text-xs font-mono text-[#AAAAC1] uppercase tracking-wider">
          {"// LOADING CARTRIDGE SPECS..."}
        </p>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-20">
        <div className="rounded-3xl bg-[#303057] shadow-raised p-8 text-center max-w-md mx-auto border border-[#383866]/40 space-y-4">
          <AlertTriangle className="h-10 w-10 text-[#EF7B98] mx-auto" />
          <h2 className="text-xl font-black text-[#F5F5FA] font-heading uppercase">
            Cartridge Not Found
          </h2>
          <p className="text-xs text-[#AAAAC1]">
            We couldn&apos;t locate the requested digital software cartridge or plan.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5754D8] to-[#716DFF] text-white font-bold text-xs shadow-raised"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-10 space-y-8 animate-fade-in">
      {/* 1. Pill Breadcrumb Navigation directly matching console style */}
      <nav className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#26264A] shadow-pressed-sm border border-[#383866]/30 text-xs font-mono text-[#AAAAC1] overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-[#F5F5FA] transition-colors shrink-0">
          CONSOLE
        </Link>
        <ChevronRight className="h-3 w-3 text-[#777790] shrink-0" />
        <Link href="/products" className="hover:text-[#F5F5FA] transition-colors shrink-0">
          CARTRIDGES
        </Link>
        <ChevronRight className="h-3 w-3 text-[#777790] shrink-0" />
        {product.category && (
          <>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-[#F5F5FA] transition-colors shrink-0"
            >
              {product.category.name.toUpperCase()}
            </Link>
            <ChevronRight className="h-3 w-3 text-[#777790] shrink-0" />
          </>
        )}
        <span className="text-[#716DFF] font-bold truncate shrink-0">
          {product.name.toUpperCase()}
        </span>
      </nav>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT 8 COLS: CARTRIDGE SPECS & DOCK ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Cartridge Chassis Card */}
          <div className="rounded-3xl bg-[#303057] shadow-raised-lg p-6 sm:p-8 border border-[#383866]/40 space-y-6">
            {/* Top Hardware Meta Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#383866]/30 text-[11px] font-mono">
              <span className="text-[#AAAAC1] font-bold tracking-wider">
                PROTOCOL {"//"} 01
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#26264A] text-[#6CD6B3] shadow-pressed-sm border border-[#6CD6B3]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6CD6B3] animate-pulse" />
                INSTANT VAULT DELIVERY
              </span>
            </div>

            {/* Media Bay & Info */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Recessed Screen Bay for Cartridge Visual */}
              <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl bg-[#26264A] shadow-pressed p-2 shrink-0 border border-[#383866]/50 overflow-hidden flex items-center justify-center">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover p-2 rounded-xl"
                  />
                ) : (
                  <Gamepad2 className="h-12 w-12 text-[#716DFF]" />
                )}
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#716DFF] bg-[#26264A] px-2.5 py-0.5 rounded-full border border-[#716DFF]/30 shadow-pressed-sm uppercase">
                    {product.category?.name || "Digital Suite"}
                  </span>
                  <ProductBadge
                    badge={product.badge}
                    isFeatured={product.isFeatured}
                    isPopular={product.isPopular}
                    discountPercentage={product.discountPercentage}
                  />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#F5F5FA] tracking-tight uppercase font-heading">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-[#AAAAC1] leading-relaxed font-body">
                  {product.shortDescription}
                </p>

                {/* Rating & Trust Strip */}
                <div className="flex items-center gap-4 pt-2 text-xs font-mono text-[#AAAAC1]">
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                      <span className="font-bold text-[#F5F5FA]">{product.rating.toFixed(1)}</span>
                      <span className="text-[#777790]">({product.ratingCount} reviews)</span>
                    </div>
                  )}
                  <div className="h-3 w-px bg-[#383866]" />
                  <div className="flex items-center gap-1 text-[#6CD6B3] font-semibold">
                    <ShieldCheck className="h-4 w-4" /> 100% Genuine
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Selector (Tactile Neumorphic Buttons) */}
            <div className="pt-6 border-t border-[#383866]/30">
              <PlanSelector
                plans={product.plans}
                selectedPlan={selectedPlan}
                onSelectPlan={(plan) => setSelectedPlan(plan)}
              />
            </div>
          </div>

          {/* Features Matrix Card */}
          {product.features && product.features.length > 0 && (
            <div className="rounded-3xl bg-[#303057] shadow-raised p-6 sm:p-7 border border-[#383866]/30 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F5F5FA] uppercase tracking-wider font-heading">
                <Sparkles className="h-4 w-4 text-[#716DFF]" />
                KEY FEATURES &amp; SPECIFICATIONS
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#26264A] shadow-pressed-sm border border-[#383866]/30 text-xs text-[#AAAAC1] font-medium leading-relaxed"
                  >
                    <div className="h-5 w-5 rounded-full bg-[#303057] shadow-raised-sm flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-[#6CD6B3]" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Overview & Narrative */}
          <div className="rounded-3xl bg-[#303057] shadow-raised p-6 sm:p-7 border border-[#383866]/30 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F5F5FA] uppercase tracking-wider font-heading">
              <FileText className="h-4 w-4 text-[#716DFF]" />
              OVERVIEW &amp; ACCESS DETAILS
            </div>
            <div className="text-xs sm:text-sm text-[#AAAAC1] leading-relaxed whitespace-pre-line font-body">
              {product.description}
            </div>
          </div>

          {/* Delivery Info & Important Notices (Dual Neumorphic Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-3xl bg-[#303057] shadow-raised p-6 border border-[#383866]/30 space-y-2.5">
              <div className="h-10 w-10 rounded-2xl bg-[#26264A] shadow-pressed flex items-center justify-center text-[#716DFF] border border-[#383866]/30">
                <Truck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-[#F5F5FA] font-heading uppercase">
                Instant Delivery Protocol
              </h4>
              <p className="text-xs text-[#AAAAC1] leading-relaxed font-body">
                {product.deliveryInfo}
              </p>
            </div>

            <div className="rounded-3xl bg-[#303057] shadow-raised p-6 border border-[#383866]/30 space-y-2.5">
              <div className="h-10 w-10 rounded-2xl bg-[#26264A] shadow-pressed flex items-center justify-center text-[#F59E0B] border border-[#383866]/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-[#F5F5FA] font-heading uppercase">
                Important Notes
              </h4>
              <p className="text-xs text-[#AAAAC1] leading-relaxed font-body">
                {product.importantNotes ||
                  "Ensure you provide a valid email and phone number at checkout for prompt account provisioning and support."}
              </p>
            </div>
          </div>

          {/* FAQ Accordion if present */}
          {product.faqs && product.faqs.length > 0 && (
            <div className="rounded-3xl bg-[#303057] shadow-raised p-6 sm:p-7 border border-[#383866]/30 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F5F5FA] uppercase tracking-wider font-heading">
                <HelpCircle className="h-4 w-4 text-[#716DFF]" />
                CARTRIDGE FAQ
              </div>

              <div className="space-y-3 pt-2">
                {product.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#26264A] shadow-pressed border border-[#383866]/30 space-y-1.5 text-xs"
                  >
                    <h5 className="font-bold text-[#F5F5FA] text-sm">
                      {faq.question}
                    </h5>
                    <p className="text-[#AAAAC1] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT 4 COLS: TACTILE STICKY PURCHASE DECK ================= */}
        <div className="lg:col-span-4">
          <StickyPurchaseBar product={product} selectedPlan={selectedPlan} />
        </div>
      </div>
    </Container>
  );
}
