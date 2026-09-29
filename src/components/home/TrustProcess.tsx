import React from "react";
import { Zap, ShieldCheck, Lock, Headphones, RefreshCw, KeyRound } from "lucide-react";
import { Container } from "@/components/common/Container";

export const TrustProcess: React.FC = () => {
  const trustFeatures = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary-600" />,
      bg: "bg-blue-50/80 border-blue-200/70",
      title: "100% Genuine Software & Passes",
      description:
        "Every digital tool, workspace invitation, and license key is legitimate and authorized. No malware, no cracked binaries, and no shared credential risks.",
    },
    {
      icon: <Lock className="h-5 w-5 text-purple-600" />,
      bg: "bg-purple-50/80 border-purple-200/70",
      title: "Encrypted Digital Delivery",
      description:
        "Sensitive login details and activation keys are encrypted at rest on the backend and only decrypted when revealed by the authenticated order owner.",
    },
    {
      icon: <Zap className="h-5 w-5 text-emerald-600" />,
      bg: "bg-emerald-50/80 border-emerald-200/70",
      title: "Local Manual Verification",
      description:
        "Pay seamlessly via bKash or Nagad. Our dedicated verification managers match transaction IDs quickly to approve and dispatch your order.",
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-amber-600" />,
      bg: "bg-amber-50/80 border-amber-200/70",
      title: "Duration Replacement Guarantee",
      description:
        "Every purchased plan duration includes active warranty coverage. If you ever experience access disruption, our team restores or replaces it.",
    },
    {
      icon: <KeyRound className="h-5 w-5 text-indigo-600" />,
      bg: "bg-indigo-50/80 border-indigo-200/70",
      title: "Dedicated Activation Guides",
      description:
        "Each fulfilled order comes with clear, step-by-step activation processes customized specifically for the software product you purchased.",
    },
    {
      icon: <Headphones className="h-5 w-5 text-rose-600" />,
      bg: "bg-rose-50/80 border-rose-200/70",
      title: "Responsive Local Support",
      description:
        "Friendly support through dashboard tickets and dedicated WhatsApp assistance for quick troubleshooting whenever you need guidance.",
    },
  ];

  return (
    <section className="py-10 lg:py-16">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-xl shadow-soft">
            Why Choose Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Built for Safe, Effortless Digital Tool Ownership
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Skip international card barriers. Get verified access to world-class software with honest pricing, manual payment verification, and guaranteed delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {trustFeatures.map((feat) => (
            <div
              key={feat.title}
              className="rounded-2xl border border-slate-200/80 bg-[var(--site-surface,#FFFFFF)] p-6 shadow-soft hover:shadow-raised transition-all duration-200"
            >
              <div
                className={`h-11 w-11 rounded-xl ${feat.bg} flex items-center justify-center border mb-4 shadow-2xs`}
              >
                {feat.icon}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
