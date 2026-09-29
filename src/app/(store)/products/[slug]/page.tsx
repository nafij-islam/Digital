"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Truck,
  FileText,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { PlanSelector } from "@/components/product/PlanSelector";
import { StickyPurchaseBar } from "@/components/product/StickyPurchaseBar";
import { ProductBadge } from "@/components/product/ProductBadge";
import { ProductPlan } from "@/types/product";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { formatPrice } from "@/lib/utils/formatters";

import { Container } from "@/components/common/Container";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data: product, isLoading, error } = useProduct(slug);
  const [selectedPlan, setSelectedPlan] = useState<ProductPlan | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Default to first active plan
  useEffect(() => {
    if (product && product.plans && product.plans.length > 0) {
      const defaultPlan = product.plans.find((p) => p.isPopular) || product.plans[0];
      setSelectedPlan(defaultPlan);
    }
  }, [product]);

  if (isLoading) {
    return <LoadingSpinner text="Loading product details..." size="lg" className="py-32" />;
  }

  if (error || !product) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Product Not Found"
          message="We couldn't find the requested digital product or subscription plan."
          onRetry={() => router.push("/products")}
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar py-1">
        <Link href="/" className="hover:text-slate-900 transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
        <Link href="/products" className="hover:text-slate-900 transition-colors shrink-0">
          Products
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
        {product.category && (
          <>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-slate-900 transition-colors shrink-0"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
          </>
        )}
        <span className="text-slate-900 font-semibold truncate shrink-0">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area (Left 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-7 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Product Visual */}
              <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 shadow-soft">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Title & Info */}
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
                    {product.category?.name || "Digital Suite"}
                  </span>
                  <ProductBadge
                    badge={product.badge}
                    isFeatured={product.isFeatured}
                    isPopular={product.isPopular}
                    discountPercentage={product.discountPercentage}
                  />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* Rating & Stats */}
                <div className="flex items-center gap-4 pt-2 text-xs font-semibold text-slate-700">
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{product.rating.toFixed(2)}</span>
                      <span className="text-slate-400 font-normal">
                        ({product.ratingCount} reviews)
                      </span>
                    </div>
                  )}
                  <div className="h-3 w-px bg-slate-200" />
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck className="h-4 w-4" /> 100% Genuine
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Selector */}
            <div className="pt-6 border-t border-slate-100">
              <PlanSelector
                plans={product.plans}
                selectedPlan={selectedPlan}
                onSelectPlan={(plan) => setSelectedPlan(plan)}
              />
            </div>
          </div>

          {/* Features List */}
          {product.features && product.features.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-7 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" /> Key Features &amp; Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs text-xs text-slate-700 font-medium leading-relaxed"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Description */}
          <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-7 shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" /> Product Overview &amp; Specifications
            </h3>
            <div className="prose prose-sm text-slate-600 text-xs sm:text-sm leading-relaxed max-w-none">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          </div>

          {/* Delivery Information & Important Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 shadow-soft space-y-3">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                <Truck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Delivery Information</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.deliveryInfo}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 shadow-soft space-y-3">
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Important Notes</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.importantNotes ||
                  "Ensure you provide a valid email and phone number at checkout for prompt account provisioning and support."}
              </p>
            </div>
          </div>

          {/* FAQ */}
          {product.faqs && product.faqs.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-7 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-slate-500" /> Product FAQs
              </h3>
              <div className="space-y-3 pt-2">
                {product.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs text-xs text-slate-700 space-y-1.5"
                  >
                    <h5 className="font-bold text-slate-900 text-sm">
                      {faq.question}
                    </h5>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar (Desktop 4 cols) */}
        <div className="lg:col-span-4">
          <StickyPurchaseBar product={product} selectedPlan={selectedPlan} />
        </div>
      </div>
    </Container>
  );
}
