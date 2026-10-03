"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
  Flame,
  HelpCircle,
} from "lucide-react";
import { SearchModal } from "./SearchModal";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const { getTotalItems, setOpen: setCartOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout, initializeAuth } = useAuth();
  const totalCartItems = getTotalItems();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "User";
  const displayInitial = (displayName[0] || "U").toUpperCase();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileDrawerOpen(false);
  }, [pathname]);

  // Click outside user menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  // Mobile body scroll lock & Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
      }
    };

    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileDrawerOpen]);

  const navLinks = [
    { name: "Products", href: "/products", icon: Package },
    { name: "Deals", href: "/deals", icon: Flame },
    { name: "Categories", href: "/categories", icon: Layers },
    { name: "Support", href: "/account/support", icon: HelpCircle },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 py-3 sm:py-4",
          isScrolled
            ? "bg-[#29294D]/95 backdrop-blur-md shadow-floating border-b border-[#383866]/30"
            : "bg-[#29294D]/80 backdrop-blur-xs"
        )}
      >
        <Container className="flex items-center justify-between gap-4">
          {/* 1. LEFT REGION: Tactile Pill Brand Badge matching reference image */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#303057] shadow-raised hover:shadow-floating transition-all border border-[#716DFF]/20 select-none active:shadow-pressed active:translate-y-[1px]"
          >
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#5754D8] to-[#716DFF] flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-[#F5F5FA] uppercase font-heading">
                NAFIJ DIGITAL
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#26264A] text-[#6CD6B3] shadow-pressed-sm border border-[#6CD6B3]/20">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6CD6B3] animate-pulse" />
                VERIFIED STORE
              </span>
            </div>
          </Link>

          {/* 2. CENTER REGION: Recessed Tactile Pill Navigation (Desktop Only) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#26264A] border border-[#383866]/30 rounded-full shadow-pressed-sm">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all relative select-none flex items-center gap-1.5",
                    isActive
                      ? "bg-[#303057] text-[#F5F5FA] shadow-raised-sm border border-[#716DFF]/30"
                      : "text-[#AAAAC1] hover:text-[#F5F5FA] hover:bg-[#303057]/40"
                  )}
                >
                  <link.icon className={cn("h-3.5 w-3.5", isActive ? "text-[#716DFF]" : "text-[#777790]")} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* 3. RIGHT REGION: Search / Cart / Account Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2.5 h-10 px-3.5 rounded-full bg-[#303057] border border-[#383866]/30 text-xs font-semibold text-[#AAAAC1] hover:text-[#F5F5FA] hover:bg-[#353560] shadow-raised-sm hover:shadow-floating active:shadow-pressed transition-all"
              aria-label="Search digital products"
            >
              <Search className="h-3.5 w-3.5 text-[#716DFF]" />
              <span className="text-[#AAAAC1] text-xs">Search...</span>
              <kbd className="hidden xl:inline-block rounded-full bg-[#26264A] px-1.5 py-0.5 text-[9px] font-mono text-[#777790] border border-[#383866]/40 shadow-pressed-sm">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden h-10 w-10 rounded-full bg-[#303057] border border-[#383866]/30 shadow-raised-sm text-[#AAAAC1] flex items-center justify-center hover:bg-[#353560] active:shadow-pressed transition-all"
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-[#716DFF]" />
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative h-10 px-3.5 rounded-full bg-[#303057] border border-[#383866]/30 shadow-raised-sm text-[#F5F5FA] flex items-center justify-center gap-2 hover:bg-[#353560] hover:text-[#716DFF] active:shadow-pressed transition-all"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-bold font-mono">CART</span>
              {totalCartItems > 0 && (
                <span className="h-4 min-w-[16px] px-1 rounded-full bg-[#716DFF] text-[10px] font-extrabold text-white flex items-center justify-center shadow-xs">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Auth States */}
            <div className="hidden sm:flex items-center">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 h-10 px-3 rounded-full bg-[#303057] border border-[#383866]/30 shadow-raised-sm hover:shadow-floating active:shadow-pressed transition-all"
                  >
                    <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#5754D8] to-[#716DFF] text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                      {displayInitial}
                    </div>
                    <span className="text-xs font-bold text-[#F5F5FA] max-w-[100px] truncate">
                      {displayName.split(" ")[0]}
                    </span>
                    <ChevronDown className="h-3 w-3 text-[#AAAAC1] ml-0.5" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[#383866]/50 bg-[#303057] p-2 shadow-floating z-50 animate-fade-in">
                      <div className="px-3 py-2 border-b border-[#383866]/40 mb-1">
                        <p className="text-xs font-bold text-[#F5F5FA] truncate">{displayName}</p>
                        <p className="text-[11px] text-[#AAAAC1] font-mono truncate">{user?.email || "Signed In"}</p>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#AAAAC1] hover:text-[#F5F5FA] hover:bg-[#353560] rounded-xl transition-colors"
                        >
                          <Package className="h-3.5 w-3.5 text-[#716DFF]" />
                          <span>My Orders &amp; Access</span>
                        </Link>

                        <Link
                          href="/account/profile"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#AAAAC1] hover:text-[#F5F5FA] hover:bg-[#353560] rounded-xl transition-colors"
                        >
                          <UserIcon className="h-3.5 w-3.5 text-[#AAAAC1]" />
                          <span>Profile Settings</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#716DFF] hover:bg-[#353560] rounded-xl transition-colors"
                          >
                            <Shield className="h-3.5 w-3.5 text-[#716DFF]" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[#383866]/40 pt-1 mt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#EF7B98] hover:bg-[#EF7B98]/10 rounded-xl transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-xs font-bold text-[#AAAAC1] hover:text-[#F5F5FA] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="h-10 px-4 rounded-full bg-gradient-to-r from-[#5754D8] to-[#716DFF] hover:brightness-110 text-white text-xs font-bold transition-all shadow-raised hover:shadow-floating active:shadow-pressed flex items-center justify-center gap-1.5"
                  >
                    <span>Get Access</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden h-10 w-10 rounded-full bg-[#303057] border border-[#383866]/30 shadow-raised-sm text-[#F5F5FA] flex items-center justify-center hover:bg-[#353560] active:shadow-pressed transition-all"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Neumorphic Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-[#161623]/70 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Tactile Drawer Content */}
          <div
            className="relative w-[85vw] max-w-sm h-full bg-[#29294D] border-l border-[#383866]/50 shadow-floating p-5 flex flex-col justify-between safe-pb z-10 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#383866]/40">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#5754D8] to-[#716DFF] flex items-center justify-center text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-extrabold tracking-wider text-[#F5F5FA] uppercase font-heading">
                    NAFIJ DIGITAL
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#303057] border border-[#383866]/40 shadow-raised-sm flex items-center justify-center text-[#AAAAC1] hover:text-[#F5F5FA]"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* User Brief if Logged In */}
              {isAuthenticated && (
                <div className="mt-4 p-3.5 rounded-2xl bg-[#303057] border border-[#383866]/40 shadow-raised-sm flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#5754D8] to-[#716DFF] text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                    {displayInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#F5F5FA] truncate">{displayName}</p>
                    <p className="text-[11px] text-[#AAAAC1] font-mono truncate">{user?.email || "Signed In"}</p>
                  </div>
                </div>
              )}

              {/* Primary Navigation Links */}
              <div className="mt-5 space-y-2">
                <div className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-[#777790] font-mono">
                  {"// CONSOLE NAVIGATION"}
                </div>
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href || pathname.startsWith(link.href + "/");

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all",
                        isActive
                          ? "bg-[#303057] text-[#F5F5FA] shadow-raised-sm border border-[#716DFF]/30"
                          : "text-[#AAAAC1] hover:bg-[#303057]/50 hover:text-[#F5F5FA]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <link.icon className={cn("h-4 w-4", isActive ? "text-[#716DFF]" : "text-[#777790]")} />
                        <span>{link.name}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-[#777790]" />
                    </Link>
                  );
                })}
              </div>

              {/* Account / Order links if Logged In */}
              {isAuthenticated ? (
                <div className="mt-5 pt-4 border-t border-[#383866]/40 space-y-1.5">
                  <div className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-[#777790] font-mono">
                    {"// USER VAULT"}
                  </div>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#AAAAC1] hover:text-[#F5F5FA] rounded-xl"
                  >
                    <Package className="h-4 w-4 text-[#716DFF]" />
                    <span>My Orders &amp; Access</span>
                  </Link>

                  <Link
                    href="/account/profile"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#AAAAC1] hover:text-[#F5F5FA] rounded-xl"
                  >
                    <UserIcon className="h-4 w-4 text-[#777790]" />
                    <span>Profile Settings</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#716DFF] rounded-xl"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="mt-6 space-y-2.5 pt-4 border-t border-[#383866]/40">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center h-11 rounded-full bg-[#303057] shadow-raised-sm border border-[#383866]/40 text-xs font-bold text-[#F5F5FA]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center h-11 rounded-full bg-gradient-to-r from-[#5754D8] to-[#716DFF] text-xs font-bold text-white shadow-raised"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>

            {/* Logout button at bottom of mobile drawer */}
            {isAuthenticated && (
              <div className="pt-4 border-t border-[#383866]/40">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-full bg-[#26264A] shadow-pressed-sm border border-[#EF7B98]/20 text-xs font-bold text-[#EF7B98]"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Instant Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
