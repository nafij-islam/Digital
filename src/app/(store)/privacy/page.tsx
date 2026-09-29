import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — DigiVault",
  description: "Privacy and data protection commitment for DigiVault customers.",
};

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 text-purple-700 px-3 py-1 text-xs font-bold mb-3">
            <Lock className="h-4 w-4" /> Privacy &amp; Data Security
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-2">Last updated: September 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              We collect minimal information required to fulfill your orders: your verified email address, name, contact phone number, and manual payment transaction references.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Encryption &amp; Security</h2>
            <p>
              All delivery secrets, license keys, and account invitations are encrypted at rest using industry-standard AES-256-GCM authenticated encryption. Sensitive data is viewable only within your authenticated session.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Third-Party Sharing</h2>
            <p>
              We never sell or disclose your personal contact information to third-party advertisers. Data is used solely for order processing, support resolution, and account notifications.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
