import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "./Container";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#101828] text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <Container className="py-12 lg:py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand Info (2 cols on md) */}
          <div className="col-span-2 space-y-4">
            <Logo variant="footer" size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Bangladesh&apos;s premier digital product and software subscription marketplace. Genuine access, manual bKash/Nagad verification, and private delivery vault.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" /> 100% Genuine Subscriptions
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary-400 shrink-0" /> support@digivault.shop
              </span>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Browse Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/account/support" className="hover:text-white transition-colors">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} DigiVault Inc. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <span>Official Bangladesh Partner</span>
            <span>•</span>
            <span>bKash &amp; Nagad Verified</span>
          </p>
        </div>
      </Container>
    </footer>
  );
};
