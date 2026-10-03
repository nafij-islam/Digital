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
          {"// LOADING PRODUCT SPECS..."}
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
            Product Not Found
          </h2>
          <p className="text-xs text-[#AAAAC1]">
            We couldn&apos;t locate the requested digital software subscription or plan.
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
      {/* 1. Pill Breadcrumb Navigation */}
      <nav
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-pressed-sm border text-xs font-mono overflow-x-auto no-scrollbar"
        style={{
          backgroundColor: "var(--site-details-bay-bg, #0F1424)",
          borderColor: "var(--site-details-border, #1E2642)",
          color: "var(--site-text-muted, #94A3B8)",
        }}
      >
        <Link href="/" className="hover:text-white transition-colors shrink-0">
          STORE
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" style={{ color: "var(--site-text-muted, #94A3B8)" }} />
        <Link href="/products" className="hover:text-white transition-colors shrink-0">
          PRODUCTS
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" style={{ color: "var(--site-text-muted, #94A3B8)" }} />
        {product.category && (
          <>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-white transition-colors shrink-0"
            >
              {product.category.name.toUpperCase()}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" style={{ color: "var(--site-text-muted, #94A3B8)" }} />
          </>
        )}
        <span className="font-bold truncate shrink-0" style={{ color: "var(--site-details-accent, #6366F1)" }}>
          {product.name.toUpperCase()}
        </span>
      </nav>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT 8 COLS: CARTRIDGE SPECS & DOCK ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Cartridge Chassis Card */}
          <div
            className="rounded-3xl shadow-raised-lg p-6 sm:p-8 border space-y-6"
            style={{
              backgroundColor: "var(--site-details-bg, #141A2E)",
              borderColor: "var(--site-details-border, #1E2642)",
            }}
          >
            {/* Top Hardware Meta Bar */}
            <div
              className="flex items-center justify-between pb-4 border-b text-[11px] font-mono"
              style={{ borderColor: "var(--site-details-border, #1E2642)" }}
            >
              <span className="font-bold tracking-wider" style={{ color: "var(--site-text-muted, #94A3B8)" }}>
                PROTOCOL {"//"} 01
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold shadow-pressed-sm border"
                style={{
                  backgroundColor: "var(--site-details-bay-bg, #0F1424)",
                  borderColor: "rgba(16, 185, 129, 0.3)",
                  color: "#10B981",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                INSTANT VAULT DELIVERY
              </span>
            </div>

            {/* Media Bay & Info */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Recessed Screen Bay for Cartridge Visual */}
              <div
                className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl shadow-pressed p-2 shrink-0 border overflow-hidden flex items-center justify-center"
                style={{
                  backgroundColor: "var(--site-details-bay-bg, #0F1424)",
                  borderColor: "var(--site-details-border, #1E2642)",
                }}
              >
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover p-2 rounded-xl"
                  />
                ) : (
                  <Sparkles className="h-12 w-12" style={{ color: "var(--site-details-accent, #6366F1)" }} />
                )}
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-pressed-sm uppercase"
                    style={{
                      backgroundColor: "var(--site-details-bay-bg, #0F1424)",
                      borderColor: "var(--site-details-border, #1E2642)",
                      color: "var(--site-details-accent, #6366F1)",
                    }}
                  >
                    {product.category?.name || "Digital Suite"}
                  </span>
                  <ProductBadge
                    badge={product.badge}
                    isFeatured={product.isFeatured}
                    isPopular={product.isPopular}
                    discountPercentage={product.discountPercentage}
                  />
                </div>

                <h1
                  className="text-2xl sm:text-3xl font-black tracking-tight uppercase font-heading"
                  style={{ color: "var(--site-text-main, #F8FAFC)" }}
                >
                  {product.name}
                </h1>

                <p
                  className="text-xs sm:text-sm leading-relaxed font-body"
                  style={{ color: "var(--site-text-secondary, #CBD5E1)" }}
                >
                  {product.shortDescription}
                </p>

                {/* Rating & Trust Strip */}
                <div
                  className="flex items-center gap-4 pt-2 text-xs font-mono"
                  style={{ color: "var(--site-text-muted, #94A3B8)" }}
                >
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                      <span className="font-bold" style={{ color: "var(--site-text-main, #F8FAFC)" }}>
                        {product.rating.toFixed(1)}
                      </span>
                      <span>({product.ratingCount} reviews)</span>
                    </div>
                  )}
                  <div className="h-3 w-px" style={{ backgroundColor: "var(--site-details-border, #1E2642)" }} />
                  <div className="flex items-center gap-1 font-semibold text-[#10B981]">
                    <ShieldCheck className="h-4 w-4" /> 100% Genuine
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Selector */}
            <div
              className="pt-6 border-t"
              style={{ borderColor: "var(--site-details-border, #1E2642)" }}
            >
              <PlanSelector
                plans={product.plans}
                selectedPlan={selectedPlan}
                onSelectPlan={(plan) => setSelectedPlan(plan)}
              />
            </div>
          </div>

          {/* Features Matrix Card */}
          {product.features && product.features.length > 0 && (
            <div
              className="rounded-3xl shadow-raised p-6 sm:p-7 border space-y-4"
              style={{
                backgroundColor: "var(--site-details-bg, #141A2E)",
                borderColor: "var(--site-details-border, #1E2642)",
              }}
            >
              <div
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider font-heading"
                style={{ color: "var(--site-text-main, #F8FAFC)" }}
              >
                <Sparkles className="h-4 w-4" style={{ color: "var(--site-details-accent, #6366F1)" }} />
                KEY FEATURES &amp; SPECIFICATIONS
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl shadow-pressed-sm border text-xs font-medium leading-relaxed"
                    style={{
                      backgroundColor: "var(--site-details-bay-bg, #0F1424)",
                      borderColor: "var(--site-details-border, #1E2642)",
                      color: "var(--site-text-secondary, #CBD5E1)",
                    }}
                  >
                    <div
                      className="h-5 w-5 rounded-full shadow-raised-sm flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: "var(--site-details-bg, #141A2E)" }}
                    >
                      <Check className="h-3 w-3 text-[#10B981]" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Overview & Narrative */}
          <div
            className="rounded-3xl shadow-raised p-6 sm:p-7 border space-y-4"
            style={{
              backgroundColor: "var(--site-details-bg, #141A2E)",
              borderColor: "var(--site-details-border, #1E2642)",
            }}
          >
            <div
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider font-heading"
              style={{ color: "var(--site-text-main, #F8FAFC)" }}
            >
              <FileText className="h-4 w-4" style={{ color: "var(--site-details-accent, #6366F1)" }} />
              OVERVIEW &amp; ACCESS DETAILS
            </div>
            <div
              className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-body"
              style={{ color: "var(--site-text-secondary, #CBD5E1)" }}
            >
              {product.description}
            </div>
          </div>

          {/* Delivery Info & Important Notices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="rounded-3xl shadow-raised p-6 border space-y-2.5"
              style={{
                backgroundColor: "var(--site-details-bg, #141A2E)",
                borderColor: "var(--site-details-border, #1E2642)",
              }}
            >
              <div
                className="h-10 w-10 rounded-2xl shadow-pressed flex items-center justify-center border"
                style={{
                  backgroundColor: "var(--site-details-bay-bg, #0F1424)",
                  borderColor: "var(--site-details-border, #1E2642)",
                  color: "var(--site-details-accent, #6366F1)",
                }}
              >
                <Truck className="h-5 w-5" />
              </div>
              <h4
                className="text-sm font-bold font-heading uppercase"
                style={{ color: "var(--site-text-main, #F8FAFC)" }}
              >
                Instant Delivery Protocol
              </h4>
              <p
                className="text-xs leading-relaxed font-body"
                style={{ color: "var(--site-text-secondary, #CBD5E1)" }}
              >
                {product.deliveryInfo}
              </p>
            </div>

            <div
              className="rounded-3xl shadow-raised p-6 border space-y-2.5"
              style={{
                backgroundColor: "var(--site-details-bg, #141A2E)",
                borderColor: "var(--site-details-border, #1E2642)",
              }}
            >
              <div
                className="h-10 w-10 rounded-2xl shadow-pressed flex items-center justify-center border"
                style={{
                  backgroundColor: "var(--site-details-bay-bg, #0F1424)",
                  borderColor: "var(--site-details-border, #1E2642)",
                  color: "#F59E0B",
                }}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h4
                className="text-sm font-bold font-heading uppercase"
                style={{ color: "var(--site-text-main, #F8FAFC)" }}
              >
                Important Notes
              </h4>
              <p
                className="text-xs leading-relaxed font-body"
                style={{ color: "var(--site-text-secondary, #CBD5E1)" }}
              >
                {product.importantNotes ||
                  "Ensure you provide a valid email and phone number at checkout for prompt account provisioning and support."}
              </p>
            </div>
          </div>

          {/* FAQ Accordion if present */}
          {product.faqs && product.faqs.length > 0 && (
            <div
              className="rounded-3xl shadow-raised p-6 sm:p-7 border space-y-4"
              style={{
                backgroundColor: "var(--site-details-bg, #141A2E)",
                borderColor: "var(--site-details-border, #1E2642)",
              }}
            >
              <div
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider font-heading"
                style={{ color: "var(--site-text-main, #F8FAFC)" }}
              >
                <HelpCircle className="h-4 w-4" style={{ color: "var(--site-details-accent, #6366F1)" }} />
                PRODUCT FAQ
              </div>

              <div className="space-y-3 pt-2">
                {product.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl shadow-pressed border space-y-1.5 text-xs"
                    style={{
                      backgroundColor: "var(--site-details-bay-bg, #0F1424)",
                      borderColor: "var(--site-details-border, #1E2642)",
                    }}
                  >
                    <h5 className="font-bold text-sm" style={{ color: "var(--site-text-main, #F8FAFC)" }}>
                      {faq.question}
                    </h5>
                    <p style={{ color: "var(--site-text-secondary, #CBD5E1)" }} className="leading-relaxed">
                      {faq.answer}
                    </p>
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
