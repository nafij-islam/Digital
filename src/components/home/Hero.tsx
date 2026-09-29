"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, CheckCircle2, Lock, BadgeCheck } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import { Container } from "@/components/common/Container";

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
    staleTime: 1000 * 60 * 5,
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
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }
        );
      }

      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        );
      }

      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 },
          "-=0.25"
        );
      }

      if (trustRef.current) {
        tl.fromTo(
          trustRef.current.children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
          "-=0.2"
        );
      }

      if (visualRef.current) {
        tl.fromTo(
          visualRef.current,
          { scale: 0.97, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7 },
          "-=0.5"
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
        y: -8,
        duration: 0.22,
        onComplete: () => {
          setCurrentWordIdx((prev) => (prev + 1) % TOOL_WORDS.length);
          gsap.fromTo(
            textWordRef.current,
            { y: 8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
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
    <section ref={containerRef} className="relative overflow-hidden pt-6 pb-12 lg:pt-12 lg:pb-18">
      {/* Subtle tactile ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[340px] bg-gradient-to-tr from-blue-400/10 via-purple-400/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tactile Editorial Tag */}
            <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200/80 px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-soft">
              <BadgeCheck className="h-4 w-4 text-primary-600" />
              <span>Genuine Software &amp; Verified Passes</span>
            </div>

            {/* Responsive Editorial Headline with clamp() */}
            <h1
              ref={headlineRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] font-black tracking-tight text-slate-900 leading-[1.14]"
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
              <span className="block text-slate-700 text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold mt-1">
                One Trusted Store.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              ref={subtextRef}
              className="text-xs sm:text-sm md:text-base text-slate-600 max-w-xl leading-relaxed mx-auto lg:mx-0"
            >
              Discover trusted digital subscriptions, software licenses, and productivity tools with simple checkout, bKash &amp; Nagad manual payment, and private delivery vault.
            </p>

            {/* Primary Action Buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1"
            >
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-105 text-white font-bold text-xs sm:text-sm transition-all shadow-soft hover:shadow-raised"
              >
                <span>Explore Products</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>

              <Link
                href="/categories"
                className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-xl bg-white hover:bg-[#F7F8FB] text-slate-800 border border-slate-200/80 font-bold text-xs sm:text-sm transition-all shadow-soft hover:shadow-raised"
              >
                <span>Browse Categories</span>
              </Link>
            </div>

            {/* Honest Micro-Trust Indicators (No fake stats) */}
            <div
              ref={trustRef}
              className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-6 text-xs text-slate-600 font-semibold"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary-500 shrink-0" />
                <span>Manual Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Private Delivery Vault</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tactile Visual Panel */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div
              ref={visualRef}
              className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[16/11] lg:h-[450px] p-2.5 sm:p-3 rounded-3xl bg-white border border-slate-200/80 shadow-raised"
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/50 group">
                <Image
                  src={heroImageSrc}
                  alt={heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px)"
                  className={`${heroImageFit} transition-transform duration-500 group-hover:scale-[1.02]`}
                />

                {/* Subtle tactile bottom badge */}
                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between p-3 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-white text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="font-bold text-[11px] sm:text-xs text-slate-100 truncate">
                      Verified Digital Delivery
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-primary-400 shrink-0 ml-2">
                    bKash &amp; Nagad Ready
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
