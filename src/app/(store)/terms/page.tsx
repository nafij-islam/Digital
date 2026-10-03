import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Container } from "@/components/common/Container";

export const metadata = {
  title: "Terms of Service — DigiVault",
  description: "Terms and conditions for using DigiVault digital products and subscription services.",
};

export default function TermsPage() {
  return (
    <Container className="py-8 sm:py-12 max-w-4xl space-y-4">
      <Link
        href="/"
        className="inline-flex items-center text-xs font-mono font-bold text-[#716DFF] hover:text-[#F5F5FA] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Console Library
      </Link>

      <div className="bg-[#303057] rounded-3xl border border-[#353560]/40 p-6 sm:p-10 shadow-neu-raised space-y-6 animate-neu-fade">
        <div className="border-b border-[#353560]/40 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#29294D] text-[#716DFF] px-3 py-1 text-xs font-mono font-bold mb-3 border border-[#353560]/40 shadow-neu-pressed">
            <ShieldCheck className="h-4 w-4" /> CONSOLE LEGAL PROTOCOLS
          </div>
          <h1 className="text-3xl font-black text-[#F5F5FA] tracking-tight">Terms of Service</h1>
          <p className="text-xs text-[#777790] font-mono mt-2">Active Protocol: October 2026</p>
        </div>

        <div className="space-y-6 text-sm text-[#AAAAC1] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#F5F5FA]">1. Acceptance of Terms</h2>
            <p>
              By accessing and purchasing from NAFIJ GAME LAB, you agree to comply with and be bound by these Console Terms of Service. If you do not agree, please do not use our platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#F5F5FA]">2. Digital Products &amp; Delivery</h2>
            <p>
              All products listed are digital software passes, official license keys, or authorized workspace invitations. Digital delivery is performed through your private Customer Order Dashboard after manual payment verification by our team.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#F5F5FA]">3. Payment &amp; Manual Verification</h2>
            <p>
              We accept manual payments through verified local payment channels (bKash and Nagad). You agree to provide accurate Sender Phone Numbers and valid Transaction IDs (TrxID).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#F5F5FA]">4. Replacement Warranty</h2>
            <p>
              All subscription passes include active replacement guarantees for the full duration of your purchased plan. If an account or key encounters an issue, our support team will replace or resolve it promptly.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
