import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Refund & Warranty Policy — DigiVault",
  description: "Learn about our replacement warranty and refund terms for digital licenses and subscriptions.",
};

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <Link
        href="/"
        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Store
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs space-y-8">
        <div className="border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold mb-3">
            <ShieldCheck className="h-4 w-4" /> Buyer Protection
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Refund &amp; Warranty Policy</h1>
          <p className="text-xs text-slate-500 mt-2">Last updated: September 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Full Duration Replacement Guarantee</h2>
            <p>
              Every digital tool subscription and license purchased on DigiVault comes with an active replacement warranty for the entire validity period of your selected plan. If an activation key or workspace invite encounters any downtime or disruption, our support team will issue an immediate replacement key or restore your access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Refund Eligibility</h2>
            <p>
              Due to the immediate digital nature of software licenses and credential access, orders that have been successfully fulfilled and activated are not eligible for cash refunds. However, full refunds are issued under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
              <li>Our team is unable to fulfill or activate your digital product within 24 hours of payment verification.</li>
              <li>A technical incompatibility prevents the software from working and our support engineers are unable to resolve it or provide an alternate key.</li>
              <li>Duplicate or accidental overpayments made during manual bKash or Nagad transfer.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. How to Request Support or a Replacement</h2>
            <p>
              To request a replacement or report an issue with your credentials, simply open a support ticket or contact our WhatsApp support channel with your <strong>Order ID</strong> and <strong>Transaction ID</strong>. We aim to respond and resolve all queries within 1 to 2 hours during active business hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
