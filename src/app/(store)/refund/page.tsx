import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { Container } from "@/components/common/Container";

export const metadata = {
  title: "Refund & Warranty Policy — DigiVault",
  description: "Learn about our replacement warranty and refund terms for digital licenses and subscriptions.",
};

export default function RefundPage() {
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
          <div className="inline-flex items-center gap-2 rounded-full bg-[#29294D] text-[#6CD6B3] px-3 py-1 text-xs font-mono font-bold mb-3 border border-[#353560]/40 shadow-neu-pressed">
            <ShieldCheck className="h-4 w-4" /> OPERATOR WARRANTY PROTOCOL
          </div>
          <h1 className="text-3xl font-black text-[#F5F5FA] tracking-tight">Refund &amp; Warranty Policy</h1>
          <p className="text-xs text-[#777790] font-mono mt-2">Active Protocol: October 2026</p>
        </div>

        <div className="space-y-6 text-sm text-[#AAAAC1] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#F5F5FA]">1. Full Duration Replacement Guarantee</h2>
            <p>
              Every digital cartridge subscription and license purchased on NAFIJ GAME LAB comes with an active replacement warranty for the entire validity period of your selected plan. If an activation key or workspace invite encounters any downtime or disruption, our support team will issue an immediate replacement key or restore your access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#F5F5FA]">2. Refund Eligibility</h2>
            <p>
              Due to the immediate digital nature of software licenses and credential access, orders that have been successfully fulfilled and activated are not eligible for cash refunds. However, full refunds are issued under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#AAAAC1] text-xs sm:text-sm">
              <li>Our team is unable to fulfill or activate your digital product within 24 hours of payment verification.</li>
              <li>A technical incompatibility prevents the software from working and our support engineers are unable to resolve it or provide an alternate key.</li>
              <li>Duplicate or accidental overpayments made during manual bKash or Nagad transfer.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#F5F5FA]">3. How to Request Support or a Replacement</h2>
            <p>
              To request a replacement or report an issue with your credentials, simply open a support ticket or contact our WhatsApp support channel with your <strong>Order ID</strong> and <strong>Transaction ID</strong>. We aim to respond and resolve all queries within 1 to 2 hours during active business hours.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
