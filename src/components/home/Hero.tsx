"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  Sparkles,
  Play,
  Pause,
  Square,
  FastForward,
  Heart,
  X,
  Check,
  Package,
  Activity,
  Sliders,
  Volume2,
  Dice5,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils/cn";

export const Hero: React.FC = () => {
  // Interactive Physical Console State
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeChannel, setActiveChannel] = useState<1 | 2>(1);
  const [toggleActive, setToggleActive] = useState(true);
  const [sliderVal, setSliderVal] = useState(70);
  const [meterVal, setMeterVal] = useState(85.5);
  const [knobRotation, setKnobRotation] = useState(45);

  const handleKnobClick = () => {
    setKnobRotation((prev) => (prev + 45) % 360);
    setMeterVal((prev) => (prev >= 98 ? 72.4 : Number((prev + 3.8).toFixed(1))));
  };

  return (
    <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ================= LEFT COLUMN: TYPOGRAPHY & CTAs ================= */}
          <div className="lg:col-span-6 space-y-6 animate-fade-in">
            {/* Top Monospace Tag Badge matching reference image */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#26264A] shadow-pressed-sm border border-[#383866]/40">
              <span className="h-1.5 w-1.5 rounded-full bg-[#716DFF] animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#AAAAC1] uppercase">
                GAME.NAFIJ.COM
              </span>
            </div>

            {/* Mega Bold Minimal Title: PLAY. FOCUS. COMPETE. */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F5F5FA] leading-[1.05] uppercase font-heading">
                PLAY.
                <br />
                <span className="text-[#716DFF]">FOCUS.</span>
                <br />
                COMPETE.
              </h1>
            </div>

            {/* Descriptive Subtitle */}
            <p className="text-sm sm:text-base text-[#AAAAC1] leading-relaxed max-w-lg font-body">
              A collection of interactive mini games and verified digital licenses built for speed, memory, focus and fun. Crafted with soft dark surfaces, tactile physical feedback, and zero latency.
            </p>

            {/* Tactile Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary Solid Purple Pill Button */}
              <Link
                href="#products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#5754D8] to-[#716DFF] text-white font-bold text-xs sm:text-sm tracking-wide shadow-raised hover:shadow-floating active:shadow-pressed active:translate-y-[1px] transition-all group"
              >
                <span>EXPLORE GAMES</span>
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </Link>

              {/* Secondary Raised Neumorphic Button */}
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#303057] text-[#F5F5FA] font-bold text-xs sm:text-sm tracking-wide shadow-raised hover:shadow-floating hover:bg-[#353560] active:shadow-pressed active:translate-y-[1px] transition-all border border-[#383866]/30"
              >
                <Dice5 className="h-4 w-4 text-[#716DFF]" />
                <span>RANDOM GAME</span>
              </Link>
            </div>

            {/* Console Specs Row */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#777790] pt-3 border-t border-[#383866]/25">
              <span className="flex items-center gap-1.5 text-[#6CD6B3]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6CD6B3] animate-pulse" />
                ZERO LATENCY MINI GAMES
              </span>
              <span>•</span>
              <span>KEYBOARD + TOUCH READY</span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE HARDWARE CONSOLE DECK ================= */}
          <div className="lg:col-span-6 flex justify-center animate-fade-in">
            {/* The Main Tactile Console Chassis directly matching reference image */}
            <div className="relative w-full max-w-[500px] rounded-3xl bg-[#303057] shadow-raised-lg p-6 sm:p-7 border border-[#383866]/40 select-none">
              {/* Subtle screw fixtures in the 4 corners of the hardware chassis */}
              <div className="absolute top-3 left-3 h-2 w-2 rounded-full bg-[#26264A] shadow-pressed-sm border border-[#383866]/40" />
              <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#26264A] shadow-pressed-sm border border-[#383866]/40" />
              <div className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-[#26264A] shadow-pressed-sm border border-[#383866]/40" />
              <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-[#26264A] shadow-pressed-sm border border-[#383866]/40" />

              <div className="grid grid-cols-[1fr_auto] gap-5">
                {/* Console Main Working Surface */}
                <div className="space-y-5">
                  {/* Top Row: Dual Recessed Meters & Rotary Frequency Knob */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    {/* Left: Recessed Meters */}
                    <div className="space-y-3">
                      {/* Meter 1: 70% */}
                      <div className="p-3 rounded-2xl bg-[#26264A] shadow-pressed-sm border border-[#383866]/30 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#AAAAC1]">
                          <span>CPU LOAD</span>
                          <span className="text-[#716DFF]">{sliderVal}%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-[#1E1E38] shadow-pressed-sm overflow-hidden p-0.5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#5754D8] to-[#716DFF] transition-all duration-300"
                            style={{ width: `${sliderVal}%` }}
                          />
                        </div>
                      </div>

                      {/* Meter 2: 40% */}
                      <div className="p-3 rounded-2xl bg-[#26264A] shadow-pressed-sm border border-[#383866]/30 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#AAAAC1]">
                          <span>MEMORY BUFFER</span>
                          <span className="text-[#6CD6B3]">60%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-[#1E1E38] shadow-pressed-sm overflow-hidden p-0.5">
                          <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-[#5754D8] via-[#716DFF] to-[#6CD6B3]" />
                        </div>
                      </div>
                    </div>

                    {/* Right: Tactile Rotary Knob / Frequency Controller */}
                    <div className="p-3.5 rounded-2xl bg-[#2C2C52] shadow-raised-sm border border-[#383866]/40 flex flex-col items-center justify-center text-center">
                      <div className="text-[10px] font-mono font-bold text-[#AAAAC1] mb-2 uppercase tracking-wider">
                        NAFIJ CORE
                      </div>

                      {/* Concentric Tactile Dial */}
                      <button
                        type="button"
                        onClick={handleKnobClick}
                        className="relative h-14 w-14 rounded-full bg-[#303057] shadow-raised hover:shadow-floating active:shadow-pressed cursor-pointer transition-all flex items-center justify-center border border-[#383866]/50"
                        title="Click to tune frequency"
                      >
                        {/* Outer ribbed ring */}
                        <div className="absolute inset-1 rounded-full border border-dashed border-[#716DFF]/30" />
                        {/* Inner rotating dial */}
                        <div
                          className="h-10 w-10 rounded-full bg-[#26264A] shadow-pressed-sm flex items-center justify-center transition-transform duration-300 relative"
                          style={{ transform: `rotate(${knobRotation}deg)` }}
                        >
                          <div className="absolute top-1 h-2 w-1 rounded-full bg-[#716DFF] shadow-xs" />
                          <div className="h-4 w-4 rounded-full bg-[#303057] shadow-raised-sm" />
                        </div>
                      </button>

                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#777790] mt-2">
                        <span>|&lt;</span>
                        <span className="text-[#F5F5FA] font-bold">60Hz</span>
                        <span>&gt;|</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Row: Tactile Physical Buttons (Play, Pause, Stop, Forward) */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#26264A] shadow-pressed-sm border border-[#383866]/30">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(false)}
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                        !isPlaying
                          ? "bg-[#26264A] shadow-pressed text-[#AAAAC1]"
                          : "bg-[#303057] shadow-raised text-[#AAAAC1] hover:text-[#F5F5FA] active:shadow-pressed"
                      )}
                      aria-label="Stop"
                    >
                      <Square className="h-3.5 w-3.5 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center transition-all cursor-pointer",
                        isPlaying
                          ? "bg-gradient-to-tr from-[#5754D8] to-[#716DFF] text-white shadow-raised shadow-[#716DFF]/30 active:shadow-pressed"
                          : "bg-[#303057] shadow-raised text-[#AAAAC1] hover:text-white"
                      )}
                      aria-label="Play / Pause"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 fill-current" />
                      ) : (
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSliderVal((prev) => (prev >= 90 ? 40 : prev + 15))}
                      className="h-10 w-10 rounded-xl bg-[#303057] shadow-raised text-[#AAAAC1] hover:text-[#F5F5FA] active:shadow-pressed flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Step"
                    >
                      <FastForward className="h-3.5 w-3.5 fill-current" />
                    </button>

                    <div className="h-6 w-px bg-[#383866]/40" />

                    <div className="flex items-center gap-1.5">
                      <Volume2 className="h-3.5 w-3.5 text-[#716DFF]" />
                      <span className="text-[10px] font-mono text-[#AAAAC1]">AUDIO FX</span>
                    </div>
                  </div>

                  {/* Bottom Row: Precision Digital Readout & Sliding Tactile Switches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                    {/* Digital Precision Display */}
                    <div className="p-3.5 rounded-2xl bg-[#26264A] shadow-pressed border border-[#383866]/40 space-y-1">
                      <div className="text-[9px] font-mono font-bold tracking-wider text-[#777790] uppercase">
                        PRECISION ACCURACY
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-black font-mono text-[#F5F5FA]">
                          {meterVal}%
                        </span>
                        <Activity className="h-4 w-4 text-[#6CD6B3] animate-pulse" />
                      </div>
                    </div>

                    {/* Tactile Sliding Toggle Switch */}
                    <div className="p-3 rounded-2xl bg-[#2C2C52] shadow-raised-sm border border-[#383866]/30 flex items-center justify-between">
                      {/* Physical Pill Sliding Switch */}
                      <button
                        type="button"
                        onClick={() => setToggleActive(!toggleActive)}
                        className={cn(
                          "relative h-6 w-12 rounded-full p-0.5 transition-colors cursor-pointer shadow-pressed-sm",
                          toggleActive ? "bg-[#5754D8]" : "bg-[#1E1E38]"
                        )}
                        aria-label="Toggle system switch"
                      >
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full bg-[#F5F5FA] shadow-raised-sm transition-transform duration-200",
                            toggleActive ? "translate-x-6" : "translate-x-0"
                          )}
                        />
                      </button>

                      {/* Tactile Channel Buttons: [1] and [2] */}
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#26264A] shadow-pressed-sm">
                        <button
                          type="button"
                          onClick={() => setActiveChannel(1)}
                          className={cn(
                            "h-6 w-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer",
                            activeChannel === 1
                              ? "bg-[#303057] text-[#716DFF] shadow-raised-sm"
                              : "text-[#777790] hover:text-[#AAAAC1]"
                          )}
                        >
                          1
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveChannel(2)}
                          className={cn(
                            "h-6 w-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer",
                            activeChannel === 2
                              ? "bg-[#303057] text-[#716DFF] shadow-raised-sm"
                              : "text-[#777790] hover:text-[#AAAAC1]"
                          )}
                        >
                          2
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Vertical Physical Hardware Keypad */}
                <div className="flex flex-col justify-between py-1 px-1.5 rounded-2xl bg-[#26264A] shadow-pressed-sm border border-[#383866]/30">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-xl bg-[#303057] shadow-raised-sm hover:shadow-floating active:shadow-pressed text-[#EF7B98] flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Like"
                  >
                    <Heart className="h-3.5 w-3.5 fill-current" />
                  </button>

                  <button
                    type="button"
                    className="h-8 w-8 rounded-xl bg-[#303057] shadow-raised-sm hover:shadow-floating active:shadow-pressed text-[#AAAAC1] hover:text-[#F5F5FA] flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Cancel"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    className="h-8 w-8 rounded-xl bg-[#303057] shadow-raised-sm hover:shadow-floating active:shadow-pressed text-[#6CD6B3] flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Confirm"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    className="h-8 w-8 rounded-xl bg-[#303057] shadow-raised-sm hover:shadow-floating active:shadow-pressed text-[#716DFF] flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Cartridges"
                  >
                    <Package className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
