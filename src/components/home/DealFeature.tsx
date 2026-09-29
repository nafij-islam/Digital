import React from "react";
import Link from "next/link";
import { ArrowRight, Flame, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatters";
import { Product } from "@/types/product";

interface DealFeatureProps {
  dealProduct?: Product;
}

export const DealFeature: React.FC<DealFeatureProps> = ({ dealProduct }) => {
  const product = dealProduct || {
    id: "deal-chatgpt",
    name: "ChatGPT Plus & Team Shared Workspace",
    slug: "chatgpt-plus-subscription",
    shortDescription: "Get official access to OpenAI GPT-4o, Advanced Voice, and Custom GPTs with full replacement guarantee.",
    startingPrice: 550,
    originalPrice: 750,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
    features: [
      "Access to GPT-4o & o1 Reasoning Models",
      "Advanced Voice Mode Enabled",
      "Guaranteed uptime during peak hours",
      "Manual bKash/Nagad verification in minutes",
    ],
  };

  const currentPrice = product.startingPrice || 550;
  const originalPrice = product.originalPrice || currentPrice * 1.35;
  const discountPercent = Math.max(10, Math.round(((originalPrice - currentPrice) / originalPrice) * 100));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#4C1D95] to-[#701A75] text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl">
        {/* Subtle Ambient Radial Lighting */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Editorial Promo Area (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-bold text-pink-200 backdrop-blur-xs">
              <Flame className="h-3.5 w-3.5 fill-pink-400 text-pink-400" />
              <span>Special Promotional Offer • Save Up to {discountPercent}%</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Save More on Popular Tools &amp; Software Passes
            </h2>

            <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed">
              Activate premium developer IDEs, AI engines, and design suites at discounted rates with zero international card charges.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm transition-all shadow-md hover:shadow-lg"
              >
                Claim Deal Now <ArrowRight className="h-4 w-4 ml-2 text-pink-600" />
              </Link>

              <Link
                href="/deals"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/30 hover:bg-white/10 text-white font-semibold text-sm transition-colors"
              >
                Browse All Deals
              </Link>
            </div>
          </div>

          {/* Right Featured Deal Card (5 cols on lg) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white/10 border border-white/20 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-200 uppercase tracking-wider">
                  Featured Promotion
                </span>
                <span className="rounded-full bg-pink-500 text-white px-2.5 py-0.5 text-xs font-black shadow-xs">
                  {discountPercent}% OFF
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {product.shortDescription}
                </p>

                {/* Key Benefits */}
                <ul className="space-y-2 text-xs text-slate-200">
                  {product.features?.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="text-2xl font-black text-white">
                    {formatPrice(currentPrice)}
                  </span>
                </div>

                <Link
                  href={`/products/${product.slug}`}
                  className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
