"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils/cn";

export const FaqCta: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the manual bKash & Nagad payment verification work?",
      a: "Select your desired tool and duration, choose bKash or Nagad at checkout, send money to our active number, and submit your Transaction ID (TrxID) and sender number. Our team validates the transaction and delivers your credentials to your dashboard within minutes.",
    },
    {
      q: "Are all licenses and account invitations official?",
      a: "Yes. 100% of our subscriptions, license keys, and workspace invitations are genuine official products with replacement warranties throughout your entire active plan period.",
    },
    {
      q: "Where will I find my digital product after it is approved?",
      a: "Once approved, your credentials, license keys, or invitation links appear in your secure Customer Order Dashboard under the 'Access' tab. Sensitive passwords and keys remain masked until you choose to reveal or copy them.",
    },
    {
      q: "What if I experience an issue with my tool subscription?",
      a: "You can submit a support ticket directly from your account or reach out via WhatsApp. Our local team resolves queries and provides replacements promptly.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-10 lg:py-16 space-y-12">
      <Container size="narrow" className="space-y-12">
        {/* FAQ Header & Accordion */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-xl shadow-soft">
              Answers &amp; Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Everything you need to know about our ordering and digital delivery process.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-[var(--site-surface,#FFFFFF)] p-4 sm:p-5 shadow-soft transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-900 gap-4"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200",
                      openIdx === idx && "rotate-90 text-primary-600"
                    )}
                  />
                </button>
                {openIdx === idx && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tactile Gradient CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-white text-center shadow-raised relative overflow-hidden">
          <div
            className="absolute -top-12 -right-12 w-64 h-64 bg-pink-500/15 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Find the tools you need.
            </h3>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed max-w-md mx-auto">
              Upgrade your personal or team workflow with genuine digital software passes and instant dashboard access.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-white hover:bg-[#F7F8FB] text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-soft hover:shadow-raised"
              >
                <span>Browse Products</span>
                <ArrowRight className="h-4 w-4 ml-2 text-primary-600" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
