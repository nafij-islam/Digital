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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemSpecs.map((item) => (
            <div
              key={item.num}
              className="rounded-3xl bg-[#141A2E] shadow-raised p-6 sm:p-7 border border-[#1E2642] flex flex-col justify-between space-y-5 hover:shadow-floating transition-all select-none"
            >
              {/* Top row: Icon + System ID */}
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-[#0F1424] shadow-pressed flex items-center justify-center border border-[#1E2642] text-[#818CF8]">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
                  SYSTEM {"//"} {item.num}
                </span>
              </div>

              {/* Stat & Title */}
              <div className="space-y-1.5">
                <div className={`text-3xl sm:text-4xl font-black font-heading ${item.statColor === "text-[#716DFF]" ? "text-[#818CF8]" : item.statColor === "text-[#6CD6B3]" ? "text-[#10B981]" : item.statColor === "text-[#F5F5FA]" ? "text-[#F8FAFC]" : item.statColor}`}>
                  {item.stat}
                </div>
                <h3 className="text-sm font-bold text-[#F8FAFC] tracking-wider uppercase font-mono">
                  {item.title}
                </h3>
                <p className="text-[13px] text-[#CBD5E1] leading-relaxed pt-1 font-body">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= 2. RECESSED TELEMETRY / ACCESS VAULT PLATE ================= */}
        <div className="rounded-3xl bg-[#141A2E] shadow-raised p-6 sm:p-8 border border-[#1E2642] space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2642]">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-[#0F1424] shadow-pressed flex items-center justify-center text-[#10B981] border border-[#1E2642]">
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#F8FAFC] uppercase tracking-wider font-heading">
                  STORE TELEMETRY &amp; LIVE DISPATCH
                </h3>
                <p className="text-[12px] font-mono text-[#94A3B8] uppercase tracking-wider">
                  REAL-TIME ORDER FULFILLMENT // BANGLADESH VAULT
                </p>
              </div>
            </div>

            {/* Refresh / Status Pill */}
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1424] shadow-pressed-sm border border-[#1E2642] text-[11px] font-mono font-bold text-[#10B981] hover:text-[#F8FAFC] active:shadow-pressed transition-all cursor-pointer self-start sm:self-auto"
            >
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>LIVE: {telemetryTimestamp}</span>
              <RotateCcw className="h-3.5 w-3.5 text-[#CBD5E1]" />
            </button>
          </div>

          {/* 5 Inset Compartment Bays */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {telemetryBays.map((bay) => (
              <div
                key={bay.name}
                className="rounded-2xl bg-[#0F1424] shadow-pressed p-4 border border-[#1E2642] flex flex-col justify-between space-y-3.5"
              >
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider truncate">
                    {bay.name}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-[#F8FAFC] mt-1">
                    {bay.val}
                  </div>
                  <div className="text-[11px] font-mono text-[#CBD5E1] uppercase">
                    {bay.label}
                  </div>
                </div>

                <Link
                  href={bay.href}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#141A2E] shadow-raised-sm hover:shadow-floating active:shadow-pressed text-[11px] font-bold font-mono text-[#CBD5E1] hover:text-[#818CF8] transition-all border border-[#1E2642]"
                >
                  <span>{bay.cta}</span>
                  <ArrowRight className="h-3 w-3 ml-0.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
