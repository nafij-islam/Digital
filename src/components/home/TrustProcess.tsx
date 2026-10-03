"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Smartphone,
  ShieldCheck,
  Activity,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/common/Container";

export const TrustProcess: React.FC = () => {
  const [telemetryTimestamp, setTelemetryTimestamp] = useState("JUST NOW");

  const handleRefresh = () => {
    setTelemetryTimestamp("SYNCED");
    setTimeout(() => setTelemetryTimestamp("JUST NOW"), 2000);
  };

  const systemSpecs = [
    {
      num: "01",
      icon: Sparkles,
      stat: "500+",
      statColor: "text-[#716DFF]",
      title: "VERIFIED PRODUCTS",
      desc: "ChatGPT Plus, Gemini Advanced, Canva Pro, JetBrains, Windows & more.",
    },
    {
      num: "02",
      icon: Zap,
      stat: "INSTANT",
      statColor: "text-[#6CD6B3]",
      title: "VAULT DELIVERY",
      desc: "Credentials & activation links dispatched immediately to order dashboard.",
    },
    {
      num: "03",
      icon: ShieldCheck,
      stat: "100%",
      statColor: "text-[#F5F5FA]",
      title: "REPLACEMENT WARRANTY",
      desc: "Complete warranty coverage for the full duration of your active subscription.",
    },
    {
      num: "04",
      icon: Smartphone,
      stat: "LOCAL",
      statColor: "text-[#F59E0B]",
      title: "BKASH & NAGAD",
      desc: "Direct mobile wallet checkout in BDT with zero hidden conversion fees.",
    },
  ];

  const telemetryBays = [
    { name: "DISPATCH SPEED", val: "< 60s", label: "AUTOMATED", href: "#products", cta: "GET ACCESS" },
    { name: "ORDERS COMPLETED", val: "1,520+", label: "ACTIVE BUYERS", href: "#products", cta: "GET ACCESS" },
    { name: "SUCCESS RATE", val: "99.8%", label: "VERIFIED KEYS", href: "#products", cta: "GET ACCESS" },
    { name: "WARRANTY COVERAGE", val: "100%", label: "GUARANTEED", href: "/refund", cta: "WARRANTY" },
    { name: "LIVE ASSISTANCE", val: "24/7", label: "WHATSAPP & TICKET", href: "/account/support", cta: "SUPPORT" },
  ];

  return (
    <section className="py-12 sm:py-16 space-y-12">
      <Container className="space-y-12">
        {/* ================= 1. FOUR CONSOLE SYSTEM CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {systemSpecs.map((item) => (
            <div
              key={item.num}
              className="rounded-3xl bg-[#303057] shadow-raised p-6 border border-[#383866]/30 flex flex-col justify-between space-y-4 hover:shadow-floating transition-all select-none"
            >
              {/* Top row: Icon + System ID */}
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-[#26264A] shadow-pressed flex items-center justify-center border border-[#383866]/30 text-[#716DFF]">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#777790] uppercase tracking-wider">
                  SYSTEM {"//"} {item.num}
                </span>
              </div>

              {/* Stat & Title */}
              <div className="space-y-1">
                <div className={`text-2xl sm:text-3xl font-black font-heading ${item.statColor}`}>
                  {item.stat}
                </div>
                <h3 className="text-xs font-bold text-[#F5F5FA] tracking-wider uppercase font-mono">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#AAAAC1] leading-relaxed pt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= 2. RECESSED TELEMETRY / ACCESS VAULT PLATE ================= */}
        <div className="rounded-3xl bg-[#303057] shadow-raised p-6 sm:p-8 border border-[#383866]/30 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#383866]/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#26264A] shadow-pressed flex items-center justify-center text-[#6CD6B3] border border-[#383866]/30">
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#F5F5FA] uppercase tracking-wider font-heading">
                  STORE TELEMETRY &amp; LIVE DISPATCH
                </h3>
                <p className="text-[11px] font-mono text-[#777790] uppercase tracking-wider">
                  REAL-TIME ORDER FULFILLMENT // BANGLADESH VAULT
                </p>
              </div>
            </div>

            {/* Refresh / Status Pill */}
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#26264A] shadow-pressed-sm border border-[#383866]/40 text-[10px] font-mono font-bold text-[#6CD6B3] hover:text-[#F5F5FA] active:shadow-pressed transition-all cursor-pointer self-start sm:self-auto"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#6CD6B3] animate-pulse" />
              <span>LIVE: {telemetryTimestamp}</span>
              <RotateCcw className="h-3 w-3 text-[#AAAAC1]" />
            </button>
          </div>

          {/* 5 Inset Compartment Bays */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {telemetryBays.map((bay) => (
              <div
                key={bay.name}
                className="rounded-2xl bg-[#26264A] shadow-pressed p-4 border border-[#383866]/30 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="text-[9px] font-mono font-bold text-[#777790] uppercase tracking-wider truncate">
                    {bay.name}
                  </div>
                  <div className="text-2xl font-black font-mono text-[#F5F5FA] mt-1">
                    {bay.val}
                  </div>
                  <div className="text-[10px] font-mono text-[#AAAAC1] uppercase">
                    {bay.label}
                  </div>
                </div>

                <Link
                  href={bay.href}
                  className="w-full inline-flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#303057] shadow-raised-sm hover:shadow-floating active:shadow-pressed text-[10px] font-bold font-mono text-[#AAAAC1] hover:text-[#716DFF] transition-all border border-[#383866]/40"
                >
                  <span>{bay.cta}</span>
                  <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
