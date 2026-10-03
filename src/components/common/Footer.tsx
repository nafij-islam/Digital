import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowUpRight, ShieldCheck, Mail } from "lucide-react";
import { Container } from "./Container";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070A12] text-[#CBD5E1] text-sm border-t border-[#1E2642] mt-auto pt-14 pb-10">
      <Container className="space-y-12">
        {/* Soft Raised Directory Grid */}
        <div className="rounded-3xl bg-[#141A2E] shadow-raised p-6 sm:p-8 grid grid-cols-2 md:grid-cols-5 gap-8 border border-[#1E2642]">
          {/* Column 1: Brand Info (2 cols on md) */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block group focus-visible:outline-none">
              <Image
                src="/logo-footer.png"
                alt="shop.nafij"
                width={160}
                height={46}
                className="h-[42px] sm:h-[46px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
            <p className="text-[#CBD5E1] text-sm leading-relaxed max-w-sm font-body">
              Enterprise digital tools and genuine subscription marketplace. Verified AI models, creative suites, and software licenses with instant automated delivery.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8] pt-1">
              <span className="flex items-center gap-1.5 text-[#10B981] font-semibold">
                <ShieldCheck className="h-4 w-4 shrink-0" /> 100% Genuine Subscriptions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#CBD5E1]">
                <Mail className="h-3.5 w-3.5 text-[#818CF8] shrink-0" /> support@nafij.com
              </span>
            </div>
          </div>

          {/* Column 2: Products / Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono">
              {"// CATALOG"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="hover:text-[#818CF8] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-[#818CF8] transition-colors">
                  Active Deals
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[#818CF8] transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help / Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono">
              {"// SUPPORT"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/account/support" className="hover:text-[#818CF8] transition-colors">
                  Support Tickets
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#818CF8] transition-colors">
                  FAQ &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#818CF8] transition-colors">
                  Order Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono">
              {"// PROTOCOL"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="hover:text-[#818CF8] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#818CF8] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#818CF8] transition-colors">
                  Warranty &amp; Refund
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Console Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-[#94A3B8] border-t border-[#1E2642]">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-footer.png"
              alt="shop.nafij"
              width={90}
              height={26}
              className="h-[26px] w-auto object-contain opacity-95"
            />
            <span className="text-[#1E2642]">•</span>
            <span>Verified Digital Products &amp; Subscriptions</span>
          </div>

          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] tracking-wider text-[#818CF8]">
            <span>shop.nafij</span>
            <span className="text-[#1E2642]">•</span>
            <span className="text-[#CBD5E1]">PREMIUM. DIGITAL. ACCOUNTS.</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <span>Built by</span>
            <span className="font-bold text-[#F8FAFC]">Nafij Islam</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#818CF8]" />
          </div>
        </div>
      </Container>
    </footer>
  );
};
