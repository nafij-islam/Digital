"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";

const TOOL_WORDS = ["AI Tools", "Design Tools", "Developer Tools", "Productivity Tools"];

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textWordRef = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  // Fetch dynamic homepage settings from Backend API
  const { data: homepageSettings } = useQuery({
    queryKey: ["homepageSettings"],
    queryFn: settingsService.getHomepageSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // GSAP Initial Load Reveal Animation
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current.children,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 }
        );
      }

      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4"
        );
      }

      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        );
      }

      if (trustRef.current) {
        tl.fromTo(
          trustRef.current.children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.2"
        );
      }

      if (visualRef.current) {
        tl.fromTo(
          visualRef.current,
          { scale: 0.96, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8 },
          "-=0.6"
        );
      }
    },
    { scope: containerRef }
  );

  // Subtle GSAP animated changing words
  useEffect(() => {
    const interval = setInterval(() => {
      if (!textWordRef.current) return;

      gsap.to(textWordRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        onComplete: () => {
          setCurrentWordIdx((prev) => (prev + 1) % TOOL_WORDS.length);
          gsap.fromTo(
            textWordRef.current,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
          );
        },
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const heroImageSrc =
    homepageSettings?.heroImageEnabled !== false && homepageSettings?.heroImage?.secureUrl
      ? homepageSettings.heroImage.secureUrl
      : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85";

  const heroImageFit = homepageSettings?.heroImageFit === "contain" ? "object-contain" : "object-cover";
  const heroImageAlt = homepageSettings?.heroImageAlt || "DigiVault Digital Products & Subscriptions";

  return (
    <section ref={containerRef} className="relative overflow-hidden pt-6 pb-14 lg:pt-14 lg:pb-20">
      {/* Ambient gradient aura */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[380px] bg-gradient-to-tr from-blue-400/15 via-violet-400/15 to-cyan-400/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (55% on lg) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Subtle editorial tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Genuine Software &amp; Verified Subscriptions</span>
            </div>

            {/* Powerful Editorial Headline */}
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
            >
              <span className="block">Premium Digital Tools.</span>
              <span className="block">
                Simple Access for{" "}
                <span
                  ref={textWordRef}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block"
                >
                  {TOOL_WORDS[currentWordIdx]}
                </span>
              </span>
              <span className="block text-slate-700 text-3xl sm:text-4xl lg:text-5xl font-bold mt-1">
                One Trusted Store.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              ref={subtextRef}
              className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mx-auto lg:mx-0"
            >
              Discover trusted digital subscriptions, software licenses, and productivity tools with simple checkout, bKash &amp; Nagad payments, and secure digital delivery.
            </p>

            {/* Primary Action Buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Explore Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-semibold text-sm transition-colors shadow-2xs"
              >
                Browse Categories
              </Link>
            </div>

            {/* Honest Micro-Trust Items (NO fake stats) */}
            <div
              ref={trustRef}
              className="pt-6 border-t border-slate-200/70 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Manual Payment Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Private Digital Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Configurable Hero Image Area */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div
              ref={visualRef}
              className="relative w-full max-w-[560px] h-[340px] sm:h-[420px] lg:h-[460px] rounded-3xl border border-slate-200/80 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 shadow-xl overflow-hidden group"
            >
              {/* Optional Subtle decorative ambient gradient behind image */}
              <div
                className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-transparent pointer-events-none z-10"
                aria-hidden="true"
              />

              <Image
                src={heroImageSrc}
                alt={heroImageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px)"
                className={`${heroImageFit} transition-transform duration-500 group-hover:scale-105`}
              />

              {/* Bottom Subtle Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-[11px] sm:text-xs text-slate-100">
                    Verified Digital Deliveries
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-blue-400">
                  bKash &amp; Nagad Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
