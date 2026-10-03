"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Database,
  Smartphone,
  ShieldCheck,
  Trophy,
  RotateCcw,
  Play,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/common/Container";

export const TrustProcess: React.FC = () => {
  const [scores, setScores] = useState({
    snake: "--",
    game2048: "1520",
    memory: "--",
    pulse: "--",
    reaction: "--",
  });

  const handleReset = () => {
    setScores({
      snake: "--",
      game2048: "0",
      memory: "--",
      pulse: "--",
      reaction: "--",
    });
  };

  const systemSpecs = [
    {
      num: "01",
      icon: Gamepad2,
      stat: "05",
      statColor: "text-[#716DFF]",
      title: "PLAYABLE GAMES",
      desc: "Snake, 2048, Memory, Pulse, Reaction.",
    },
    {
      num: "02",
      icon: Database,
      stat: "LOCAL",
      statColor: "text-[#6CD6B3]",
      title: "HIGH SCORES",
      desc: "Preserved in browser storage without cookies.",
    },
    {
      num: "03",
      icon: Smartphone,
      stat: "100%",
      statColor: "text-[#F5F5FA]",
      title: "KEYBOARD + TOUCH",
      desc: "Tailored to responsive tactile display layout.",
    },
    {
      num: "04",
      icon: ShieldCheck,
      stat: "NO",
      statColor: "text-[#F59E0B]",
      title: "ACCOUNT REQUIRED",
      desc: "Instant access without logins or tracking.",
    },
  ];

  const scoreBays = [
    { name: "SNAKE", val: scores.snake, label: "NO RECORD", href: "/products" },
    { name: "2048", val: scores.game2048, label: "POINTS", href: "/products" },
    { name: "MEMORY MATCH", val: scores.memory, label: "NO RECORD", href: "/products" },
    { name: "PULSE", val: scores.pulse, label: "NO RECORD", href: "/products" },
    { name: "REACTION", val: scores.reaction, label: "NO RECORD", href: "/products" },
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

        {/* ================= 2. RECESSED BEST SCORES / ACCESS VAULT PLATE ================= */}
        <div className="rounded-3xl bg-[#303057] shadow-raised p-6 sm:p-8 border border-[#383866]/30 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#383866]/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#26264A] shadow-pressed flex items-center justify-center text-[#F59E0B] border border-[#383866]/30">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#F5F5FA] uppercase tracking-wider font-heading">
                  YOUR BEST SCORES
                </h3>
                <p className="text-[11px] font-mono text-[#777790] uppercase tracking-wider">
                  PERSISTED LOCALLY IN CLIENT STORAGE
                </p>
              </div>
            </div>

            {/* Reset Scores Button */}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#26264A] shadow-pressed-sm border border-[#383866]/40 text-[10px] font-mono font-bold text-[#AAAAC1] hover:text-[#F5F5FA] active:shadow-pressed transition-all cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="h-3 w-3" />
              <span>RESET SCORES</span>
            </button>
          </div>

          {/* 5 Inset Compartment Bays */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {scoreBays.map((bay) => (
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
                  <Play className="h-2.5 w-2.5 fill-current" />
                  <span>PLAY</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
