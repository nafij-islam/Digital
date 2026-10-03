import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowUpRight, ShieldCheck, Mail } from "lucide-react";
import { Container } from "./Container";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#242444] text-[#AAAAC1] text-xs border-t border-[#383866]/40 mt-auto pt-12 pb-8">
      <Container className="space-y-10">
        {/* Soft Raised Directory Grid */}
        <div className="rounded-3xl bg-[#303057] shadow-raised p-6 sm:p-8 grid grid-cols-2 md:grid-cols-5 gap-8 border border-[#383866]/30">
          {/* Column 1: Brand Info (2 cols on md) */}
          <div className="col-span-2 space-y-3.5">
            <Link href="/" className="inline-block group focus-visible:outline-none">
              <Image
                src="/logo-footer.png"
                alt="shop.nafij"
                width={150}
                height={44}
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
            <p className="text-[#AAAAC1] text-xs leading-relaxed max-w-sm">
              Enterprise digital tools and genuine subscription marketplace. Verified AI models, creative suites, and software licenses with instant automated delivery.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#777790] pt-1">
              <span className="flex items-center gap-1.5 text-[#6CD6B3]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> 100% Genuine Subscriptions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#AAAAC1]">
                <Mail className="h-3 w-3 text-[#716DFF] shrink-0" /> support@nafij.com
              </span>
            </div>
          </div>

          {/* Column 2: Products / Shop */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-[#F5F5FA] uppercase tracking-wider font-mono">
              {"// CATALOG"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products" className="hover:text-[#716DFF] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-[#716DFF] transition-colors">
                  Active Deals
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[#716DFF] transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help / Support */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-[#F5F5FA] uppercase tracking-wider font-mono">
              {"// SUPPORT"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/account/support" className="hover:text-[#716DFF] transition-colors">
                  Support Tickets
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#716DFF] transition-colors">
                  FAQ &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#716DFF] transition-colors">
                  Order Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-[#F5F5FA] uppercase tracking-wider font-mono">
              {"// PROTOCOL"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-[#716DFF] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#716DFF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#716DFF] transition-colors">
                  Warranty &amp; Refund
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Console Status Bar directly matching reference image */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-[11px] text-[#777790] border-t border-[#383866]/30">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-footer.png"
              alt="shop.nafij"
              width={80}
              height={24}
              className="h-5 w-auto object-contain opacity-95"
            />
            <span className="text-[#383866]">•</span>
            <span>Verified Digital Products &amp; Subscriptions</span>
          </div>

          <div className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-wider text-[#716DFF]">
            <span>shop.nafij</span>
            <span className="text-[#383866]">•</span>
            <span className="text-[#AAAAC1]">PREMIUM. DIGITAL. ACCOUNTS.</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <span>Built by</span>
            <span className="font-bold text-[#F5F5FA]">Nafij Islam</span>
            <ArrowUpRight className="h-3 w-3 text-[#716DFF]" />
          </div>
        </div>
      </Container>
    </footer>
  );
};
