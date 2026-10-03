"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils/cn";
import { settingsService } from "@/services/settingsService";
import { HomepageSetting } from "@/types/settings";

interface BannerSlide {
  id: string;
  tag: string;
  lines: [string, string, string];
  highlightIdx: number;
  description: string;
  primaryBtn: { text: string; href: string };
  secondaryBtn: { text: string; href: string };
  trustBadge: string;
  imageUrl: string;
  imageAlt: string;
  cardBadge: string;
  cardSubBadge: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: "chatgpt",
    tag: "OPENAI ACCESS // GPT-4o & o1",
    lines: ["CHATGPT.", "PLUS.", "GPT-4O."],
    highlightIdx: 1,
    description:
      "Official OpenAI ChatGPT Plus access with GPT-4o, DALL·E 3, Canvas, Advanced Voice, and custom GPTs. Automated private vault delivery with replacement warranty.",
    primaryBtn: { text: "EXPLORE PRODUCTS", href: "#products" },
    secondaryBtn: { text: "GET CHATGPT NOW", href: "/products/chatgpt-plus" },
    trustBadge: "INSTANT VAULT DISPATCH",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=85",
    imageAlt: "ChatGPT Plus & GPT-4o Subscription",
    cardBadge: "⚡ Verified OpenAI Account",
    cardSubBadge: "bKash & Nagad Ready",
  },
  {
    id: "gemini",
    tag: "GOOGLE AI // 2M TOKEN CONTEXT",
    lines: ["GOOGLE.", "GEMINI.", "ADVANCED."],
    highlightIdx: 1,
    description:
      "Experience Google's most capable AI with 2 Million token context, deep reasoning, Imagen 3 generation, and 2TB Google One cloud storage included.",
    primaryBtn: { text: "EXPLORE PRODUCTS", href: "#products" },
    secondaryBtn: { text: "GET GEMINI ACCESS", href: "/products/gemini-advanced" },
    trustBadge: "2TB CLOUD STORAGE INCLUDED",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85",
    imageAlt: "Google Gemini Advanced AI Model",
    cardBadge: "⭐ Official Google AI Pro",
    cardSubBadge: "Instant Vault Access",
  },
  {
    id: "canva",
    tag: "CREATIVE SUITE // BEST SELLER",
    lines: ["CANVA.", "PRO.", "SUITE."],
    highlightIdx: 1,
    description:
      "100M+ premium stock assets, Magic AI studio, 1-click background remover, brand kits, and 1TB cloud storage on your own personal email with zero sharing issues.",
    primaryBtn: { text: "EXPLORE PRODUCTS", href: "#products" },
    secondaryBtn: { text: "GET CANVA PRO", href: "/products/canva-pro" },
    trustBadge: "365 DAYS FULL WARRANTY",
    imageUrl:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=85",
    imageAlt: "Canva Pro Subscription Workspace",
    cardBadge: "✨ Private Workspace Upgrade",
    cardSubBadge: "Full 1-Year Guarantee",
  },
  {
    id: "windows-jetbrains",
    tag: "GENUINE SOFTWARE // ZERO EXPIRY",
    lines: ["WINDOWS 11.", "& JETBRAINS.", "PRO SUITE."],
    highlightIdx: 1,
    description:
      "100% Genuine lifetime retail keys for Windows 11 Pro and complete JetBrains 16-IDE pack. Official online activation directly through Microsoft & JetBrains.",
    primaryBtn: { text: "EXPLORE PRODUCTS", href: "#products" },
    secondaryBtn: { text: "VIEW SOFTWARE KEYS", href: "/products/windows-11-pro-retail-key" },
    trustBadge: "LIFETIME ONLINE ACTIVATION",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=85",
    imageAlt: "Windows 11 Pro & JetBrains All Products",
    cardBadge: "🛡️ 100% Genuine Retail Key",
    cardSubBadge: "BitLocker & Sandbox",
  },
];

export const Hero: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);

  // Load custom admin hero image if set
  useEffect(() => {
    let mounted = true;
    settingsService
      .getHomepageSettings()
      .then((settings: HomepageSetting) => {
        if (!mounted) return;
        if (settings?.heroImageEnabled !== false && settings?.heroImage?.secureUrl) {
          setSlides((prev) => {
            const copy = [...prev];
            copy[0] = {
              ...copy[0],
              imageUrl: settings.heroImage?.secureUrl || copy[0].imageUrl,
              imageAlt: settings.heroImageAlt || copy[0].imageAlt,
            };
            return copy;
          });
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Smooth Auto-advance every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentIdx];

  return (
    <section
      className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ================= LEFT COLUMN: DYNAMIC SLIDE CONTENT ================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Monospace Tag Badge */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-pressed-sm border transition-all duration-200"
              style={{
                backgroundColor: "var(--site-secondary, #0F1424)",
                borderColor: "var(--site-card-border, #1E2642)",
              }}
            >
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--site-primary, #6366F1)" }} />
              <span
                className="text-[12px] font-mono font-bold tracking-wider uppercase"
                style={{ color: "var(--site-text-secondary, #CBD5E1)" }}
              >
                {activeSlide.tag}
              </span>
            </div>

            {/* Mega Bold Minimal Title with animated transition */}
            <div className="space-y-1.5 min-h-[140px] sm:min-h-[180px] lg:min-h-[210px] flex flex-col justify-center">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] uppercase font-heading transition-all duration-300"
                style={{ color: "var(--site-text-main, #F8FAFC)" }}
              >
                {activeSlide.lines.map((line, idx) => (
                  <span key={idx} className="block">
                    {idx === activeSlide.highlightIdx ? (
                      <span style={{ color: "var(--site-bright, #818CF8)" }} className="drop-shadow-sm">
                        {line}
                      </span>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </h1>
            </div>

            {/* Descriptive Subtitle (Larger & clearer) */}
            <p
              className="text-base sm:text-lg leading-relaxed max-w-lg font-body min-h-[60px] transition-opacity duration-200"
              style={{ color: "var(--site-text-secondary, #CBD5E1)" }}
            >
              {activeSlide.description}
            </p>

            {/* Tactile Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary Solid Indigo Pill Button */}
              <Link
                href={activeSlide.primaryBtn.href}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-extrabold text-sm sm:text-base tracking-wide shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px] transition-all group"
                style={{
                  background: "linear-gradient(135deg, var(--site-primary, #4F46E5), var(--site-bright, #6366F1))",
                }}
              >
                <span>{activeSlide.primaryBtn.text}</span>
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </Link>

              {/* Secondary Raised Neumorphic Button */}
              <Link
                href={activeSlide.secondaryBtn.href}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-extrabold text-sm sm:text-base tracking-wide shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px] transition-all border"
                style={{
                  backgroundColor: "var(--site-card-bg, #141A2E)",
                  borderColor: "var(--site-card-border, #1E2642)",
                  color: "var(--site-text-main, #F8FAFC)",
                }}
              >
                <Sparkles className="h-4 w-4" style={{ color: "var(--site-bright, #818CF8)" }} />
                <span>{activeSlide.secondaryBtn.text}</span>
              </Link>
            </div>

            {/* Console Specs & Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3.5 border-t border-[#1E2642] text-[12px] font-mono text-[#94A3B8]">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1.5 text-[#10B981] font-bold">
                  <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                  {activeSlide.trustBadge}
                </span>
                <span>•</span>
                <span className="font-semibold">BKASH &amp; NAGAD</span>
              </div>

              {/* Slider Controls: Arrows & Indicator Pills */}
              <div className="flex items-center gap-3">
                {/* Indicator Dots */}
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-200 cursor-pointer",
                        currentIdx === idx
                          ? "w-7 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] shadow-xs"
                          : "w-2.5 bg-[#0F1424] hover:bg-[#1C233D] shadow-pressed-sm border border-[#1E2642]"
                      )}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="h-9 w-9 rounded-full bg-[#141A2E] shadow-raised hover:shadow-floating active:shadow-pressed border border-[#1E2642] flex items-center justify-center text-[#CBD5E1] hover:text-[#F8FAFC] transition-all cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-9 w-9 rounded-full bg-[#141A2E] shadow-raised hover:shadow-floating active:shadow-pressed border border-[#1E2642] flex items-center justify-center text-[#CBD5E1] hover:text-[#F8FAFC] transition-all cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SMOOTH BANNER IMAGE DISPLAY ================= */}
          <div className="lg:col-span-6 flex justify-center">
            {/* The Main Tactile Visual Panel Chassis with custom image support */}
            <div className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[16/11] lg:h-[430px] p-3 rounded-3xl bg-[#141A2E] shadow-raised-lg border border-[#1E2642] overflow-hidden group">
              {/* Corner Screw Fixtures */}
              <div className="absolute top-2.5 left-2.5 h-2 w-2 rounded-full bg-[#0F1424] shadow-pressed-sm border border-[#1E2642] z-30 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#0F1424] shadow-pressed-sm border border-[#1E2642] z-30 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 h-2 w-2 rounded-full bg-[#0F1424] shadow-pressed-sm border border-[#1E2642] z-30 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 h-2 w-2 rounded-full bg-[#0F1424] shadow-pressed-sm border border-[#1E2642] z-30 pointer-events-none" />

              {/* Recessed Screen Bay for Slide Image */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0F1424] shadow-pressed border border-[#1E2642]">
                {/* Images Stacked for Smooth Cross-fade Transition */}
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500 ease-in-out",
                      currentIdx === idx
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0 pointer-events-none"
                    )}
                  >
                    <Image
                      src={slide.imageUrl}
                      alt={slide.imageAlt}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />

                    {/* Soft Vignette Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/25 to-transparent" />
                  </div>
                ))}

                {/* Tactile Bottom Floating Badge inside image frame */}
                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between p-3.5 rounded-xl bg-[#0F1424]/90 backdrop-blur-md border border-[#1E2642] text-xs shadow-pressed-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                    <span className="font-extrabold text-[12px] sm:text-[13px] text-[#F8FAFC] truncate">
                      {activeSlide.cardBadge}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[#818CF8] shrink-0 ml-2">
                    {activeSlide.cardSubBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
