"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils/cn";

export const FaqCta: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does digital subscription access and activation work?",
      a: "Choose your desired subscription (ChatGPT Plus, Gemini Advanced, Canva Pro, JetBrains, Windows keys, etc.), complete checkout via bKash or Nagad, and receive your credentials and setup guides directly in your order vault (/account) within 5-15 minutes.",
    },
    {
      q: "Are all subscriptions and licenses genuine with a full duration warranty?",
      a: "Yes, 100%. Every subscription, license key, and software pass is 100% genuine with an active replacement warranty covering the entire duration of your plan.",
    },
    {
      q: "What payment methods are supported in Bangladesh?",
      a: "We accept bKash, Nagad, and Rocket with seamless checkout and zero extra transaction fees. Fast order verification ensures prompt dispatch directly to your dashboard.",
    },
    {
      q: "What should I do if an account or key has an issue?",
      a: "Our support team is active 24/7. Simply submit a ticket from your account dashboard or contact us directly on WhatsApp, and our team will resolve the issue or issue a fresh replacement immediately.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 space-y-12">
      <Container className="space-y-12 max-w-4xl">
        {/* Soft Neumorphic FAQ Accordion */}
        <div className="space-y-4">
          <div className="text-center space-y-2.5 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F1424] shadow-pressed-sm border border-[#1E2642] text-[11px] font-mono font-bold text-[#818CF8] uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" />
              STORE FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F8FAFC] tracking-tight uppercase font-heading">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-sm sm:text-base text-[#CBD5E1]">
              Everything you need to know about digital subscriptions, orders, and delivery.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={cn(
                    "rounded-2xl transition-all duration-200 border border-[#1E2642] overflow-hidden",
                    isOpen ? "bg-[#1C233D] shadow-raised" : "bg-[#141A2E] shadow-raised-sm"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#F8FAFC] cursor-pointer"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <div
                      className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center transition-all shrink-0 ml-3",
                        isOpen
                          ? "bg-[#0F1424] shadow-pressed-sm text-[#818CF8]"
                          : "bg-[#0F1424] shadow-raised-sm text-[#CBD5E1]"
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#CBD5E1] leading-relaxed border-t border-[#1E2642] pt-4 font-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Callout Slab directly matching reference image: "Built for Creators & Professionals." */}
        <div className="rounded-3xl bg-[#141A2E] shadow-raised-lg p-8 sm:p-12 text-center border border-[#1E2642] space-y-4 max-w-2xl mx-auto">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F1424] shadow-pressed-sm border border-[#1E2642] text-[11px] font-mono font-bold text-[#CBD5E1] uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#818CF8]" />
            ABOUT NAFIJ DIGITAL STORE
          </div>

          {/* Heading */}
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F8FAFC] tracking-tight uppercase font-heading">
            Built for creators &amp; pros.
          </h3>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed max-w-lg mx-auto font-body">
            Nafij Digital Store is the trusted marketplace for verified AI subscriptions (ChatGPT Plus, Gemini Advanced, Canva Pro), developer tools, and genuine software licenses with instant delivery and full warranty.
          </p>

          {/* Credits */}
          <div className="pt-4 text-xs font-mono text-[#94A3B8] border-t border-[#1E2642] flex flex-wrap items-center justify-center gap-2.5">
            <span>Designed &amp; developed by</span>
            <span className="font-bold text-[#F8FAFC]">Nafij Islam</span>
            <span>•</span>
            <Link href="/products" className="text-[#818CF8] hover:underline font-bold">
              Catalog
            </Link>
            <span>•</span>
            <Link href="/categories" className="text-[#818CF8] hover:underline font-bold">
              Categories
            </Link>
            <span>•</span>
            <Link href="/account/support" className="text-[#818CF8] hover:underline font-bold">
              Support
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
