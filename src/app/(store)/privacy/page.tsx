import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Container } from "@/components/common/Container";

export const metadata = {
  title: "Privacy Policy — DigiVault",
  description: "Privacy and data protection commitment for DigiVault customers.",
};

export default function PrivacyPage() {
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
            <Lock className="h-4 w-4" /> ENCRYPTED TELEMETRY PROTOCOL
          </div>
          <h1 className="text-3xl font-black text-[#F5F5FA] tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-[#777790] font-mono mt-2">Active Protocol: October 2026</p>
        </div>

        <div className="space-y-6 text-sm text-[#AAAAC1] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#F5F5FA]">1. Information We Collect</h2>
            <p>
              We collect minimal information required to fulfill your orders: your verified email address, name, contact phone number, and manual payment transaction references.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#F5F5FA]">2. Encryption &amp; Security</h2>
            <p>
              All delivery secrets, license keys, and account invitations are encrypted at rest using industry-standard AES-256-GCM authenticated encryption. Sensitive data is viewable only within your authenticated session.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#F5F5FA]">3. Third-Party Sharing</h2>
            <p>
              We never sell or disclose your personal contact information to third-party advertisers. Data is used solely for order processing, support resolution, and account notifications.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
