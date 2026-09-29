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
      <div className="max-w-3xl mx-auto py-20 px-4">
        <ErrorState
          title="Product Not Found"
          message="We couldn't find the requested digital product or subscription plan."
          onRetry={() => router.push("/products")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/products" className="hover:text-slate-900 transition-colors">
          Products
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        {product.category && (
          <>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-slate-900 transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </>
        )}
        <span className="text-slate-900 font-semibold truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Content Area (Left 8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Product Visual */}
              <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-xs">
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
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" /> Key Features &amp; Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 font-medium leading-relaxed"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Description */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" /> Product Overview &amp; Specifications
            </h3>
            <div className="prose prose-sm text-slate-600 text-xs sm:text-sm leading-relaxed max-w-none">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          </div>

          {/* Delivery Information & Important Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card space-y-3">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Delivery Information</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.deliveryInfo}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card space-y-3">
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
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
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-slate-500" /> Product FAQs
              </h3>
              <div className="space-y-3 pt-2">
                {product.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 space-y-1.5"
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
    </div>
  );
}
