"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
          "sticky top-0 z-40 w-full transition-all duration-200 py-3 sm:py-4",
          isScrolled
            ? "backdrop-blur-md shadow-floating border-b"
            : "backdrop-blur-xs"
        )}
        style={{
          backgroundColor: isScrolled
            ? "var(--site-navbar-bg, #0B0F19)"
            : "var(--site-navbar-bg, #0B0F19)",
          borderColor: "var(--site-navbar-border, #1E2642)",
        }}
      >
        <Container className="flex items-center justify-between gap-4">
          {/* 1. LEFT REGION: User Brand Logo */}
          <Link
            href="/"
            className="group flex items-center select-none active:translate-y-[1px] focus-visible:outline-none"
          >
            <Image
              src="/logo-footer.png"
              alt="shop.nafij"
              width={145}
              height={42}
              priority
              className="h-[38px] sm:h-[42px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* 2. CENTER REGION: Recessed Tactile Pill Navigation (Desktop Only) */}
          <nav
            className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full shadow-pressed-sm border"
            style={{
              backgroundColor: "var(--site-secondary, #0F1424)",
              borderColor: "var(--site-navbar-border, #1E2642)",
            }}
          >
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all relative select-none flex items-center gap-2",
                    isActive
                      ? "shadow-raised-sm border"
                      : "hover:bg-white/5"
                  )}
                  style={{
                    backgroundColor: isActive ? "var(--site-card-bg, #141A2E)" : "transparent",
                    borderColor: isActive ? "var(--site-primary, #6366F1)" : "transparent",
                    color: isActive ? "var(--site-text-main, #F8FAFC)" : "var(--site-navbar-text, #CBD5E1)",
                  }}
                >
                  <link.icon
                    className="h-4 w-4"
                    style={{
                      color: isActive ? "var(--site-bright, #818CF8)" : "var(--site-text-muted, #94A3B8)",
                    }}
                  />
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
              className="hidden sm:flex items-center gap-2.5 h-10 px-4 rounded-full border text-xs sm:text-sm font-semibold shadow-raised-sm hover:shadow-floating active:shadow-pressed transition-all"
              style={{
                backgroundColor: "var(--site-card-bg, #141A2E)",
                borderColor: "var(--site-navbar-border, #1E2642)",
                color: "var(--site-navbar-text, #CBD5E1)",
              }}
              aria-label="Search digital products"
            >
              <Search className="h-4 w-4" style={{ color: "var(--site-bright, #818CF8)" }} />
              <span>Search...</span>
              <kbd
                className="hidden xl:inline-block rounded-full px-1.5 py-0.5 text-[10px] font-mono border shadow-pressed-sm"
                style={{
                  backgroundColor: "var(--site-secondary, #0F1424)",
                  borderColor: "var(--site-navbar-border, #1E2642)",
                  color: "var(--site-text-muted, #94A3B8)",
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden h-10 w-10 rounded-full border shadow-raised-sm flex items-center justify-center active:shadow-pressed transition-all"
              style={{
                backgroundColor: "var(--site-card-bg, #141A2E)",
                borderColor: "var(--site-navbar-border, #1E2642)",
                color: "var(--site-navbar-text, #CBD5E1)",
              }}
              aria-label="Search"
            >
              <Search className="h-4 w-4" style={{ color: "var(--site-bright, #818CF8)" }} />
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative h-10 px-4 rounded-full border shadow-raised-sm flex items-center justify-center gap-2 active:shadow-pressed transition-all"
              style={{
                backgroundColor: "var(--site-card-bg, #141A2E)",
                borderColor: "var(--site-navbar-border, #1E2642)",
                color: "var(--site-text-main, #F8FAFC)",
              }}
              aria-label="View shopping cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline text-xs sm:text-sm font-bold font-mono">CART</span>
              {totalCartItems > 0 && (
                <span
                  className="h-4 min-w-[16px] px-1 rounded-full text-[10px] font-extrabold text-white flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: "var(--site-primary, #6366F1)" }}
                >
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
                    className="flex items-center gap-2 h-10 px-3.5 rounded-full border shadow-raised-sm hover:shadow-floating active:shadow-pressed transition-all"
                    style={{
                      backgroundColor: "var(--site-card-bg, #141A2E)",
                      borderColor: "var(--site-navbar-border, #1E2642)",
                    }}
                  >
                    <div
                      className="h-6 w-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center shadow-2xs"
                      style={{
                        background: "linear-gradient(135deg, var(--site-primary, #4F46E5), var(--site-bright, #6366F1))",
                      }}
                    >
                      {displayInitial}
                    </div>
                    <span
                      className="text-xs sm:text-sm font-bold max-w-[100px] truncate"
                      style={{ color: "var(--site-text-main, #F8FAFC)" }}
                    >
                      {displayName.split(" ")[0]}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 ml-0.5" style={{ color: "var(--site-navbar-text, #CBD5E1)" }} />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl border p-2 shadow-floating z-50 animate-fade-in"
                      style={{
                        backgroundColor: "var(--site-card-bg, #141A2E)",
                        borderColor: "var(--site-navbar-border, #1E2642)",
                      }}
                    >
                      <div
                        className="px-3 py-2 border-b mb-1"
                        style={{ borderColor: "var(--site-navbar-border, #1E2642)" }}
                      >
                        <p className="text-xs sm:text-sm font-bold truncate" style={{ color: "var(--site-text-main, #F8FAFC)" }}>
                          {displayName}
                        </p>
                        <p className="text-[11px] font-mono truncate" style={{ color: "var(--site-text-muted, #94A3B8)" }}>
                          {user?.email || "Signed In"}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors hover:bg-white/5"
                          style={{ color: "var(--site-navbar-text, #CBD5E1)" }}
                        >
                          <Package className="h-3.5 w-3.5" style={{ color: "var(--site-bright, #818CF8)" }} />
                          <span>My Orders &amp; Access</span>
                        </Link>

                        <Link
                          href="/account/profile"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors hover:bg-white/5"
                          style={{ color: "var(--site-navbar-text, #CBD5E1)" }}
                        >
                          <UserIcon className="h-3.5 w-3.5" style={{ color: "var(--site-text-muted, #94A3B8)" }} />
                          <span>Profile Settings</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors hover:bg-white/5"
                            style={{ color: "var(--site-bright, #818CF8)" }}
                          >
                            <Shield className="h-3.5 w-3.5" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      <div
                        className="border-t pt-1 mt-1"
                        style={{ borderColor: "var(--site-navbar-border, #1E2642)" }}
                      >
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
                    className="px-3.5 py-2 text-xs sm:text-sm font-bold transition-colors"
                    style={{ color: "var(--site-navbar-text, #CBD5E1)" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="h-10 px-5 rounded-full hover:brightness-110 text-white text-xs sm:text-sm font-extrabold transition-all shadow-raised hover:shadow-floating active:shadow-pressed flex items-center justify-center gap-1.5"
                    style={{
                      background: "linear-gradient(135deg, var(--site-primary, #4F46E5), var(--site-bright, #6366F1))",
                    }}
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
              className="lg:hidden h-10 w-10 rounded-full border shadow-raised-sm flex items-center justify-center active:shadow-pressed transition-all"
              style={{
                backgroundColor: "var(--site-card-bg, #141A2E)",
                borderColor: "var(--site-navbar-border, #1E2642)",
                color: "var(--site-text-main, #F8FAFC)",
              }}
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
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Tactile Drawer Content */}
          <div
            className="relative w-[85vw] max-w-sm h-full border-l shadow-floating p-5 flex flex-col justify-between safe-pb z-10 animate-fade-in"
            style={{
              backgroundColor: "var(--site-navbar-bg, #0B0F19)",
              borderColor: "var(--site-navbar-border, #1E2642)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div>
              {/* Drawer Header */}
              <div
                className="flex items-center justify-between pb-4 border-b"
                style={{ borderColor: "var(--site-navbar-border, #1E2642)" }}
              >
                <Link
                  href="/"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center group"
                >
                  <Image
                    src="/logo-footer.png"
                    alt="shop.nafij"
                    width={120}
                    height={34}
                    priority
                    className="h-[34px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="h-9 w-9 rounded-full border shadow-raised-sm flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--site-card-bg, #141A2E)",
                    borderColor: "var(--site-navbar-border, #1E2642)",
                    color: "var(--site-navbar-text, #CBD5E1)",
                  }}
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* User Brief if Logged In */}
              {isAuthenticated && (
                <div
                  className="mt-4 p-3.5 rounded-2xl border shadow-raised-sm flex items-center gap-3"
                  style={{
                    backgroundColor: "var(--site-card-bg, #141A2E)",
                    borderColor: "var(--site-navbar-border, #1E2642)",
                  }}
                >
                  <div
                    className="h-9 w-9 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-2xs"
                    style={{
                      background: "linear-gradient(135deg, var(--site-primary, #4F46E5), var(--site-bright, #6366F1))",
                    }}
                  >
                    {displayInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold truncate" style={{ color: "var(--site-text-main, #F8FAFC)" }}>
                      {displayName}
                    </p>
                    <p className="text-[11px] font-mono truncate" style={{ color: "var(--site-text-muted, #94A3B8)" }}>
                      {user?.email || "Signed In"}
                    </p>
                  </div>
                </div>
              )}

              {/* Primary Navigation Links */}
              <div className="mt-5 space-y-2">
                <div
                  className="px-2 text-[10px] font-extrabold uppercase tracking-widest font-mono"
                  style={{ color: "var(--site-text-muted, #94A3B8)" }}
                >
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
                        "flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border",
                        isActive
                          ? "shadow-raised-sm"
                          : "hover:bg-white/5"
                      )}
                      style={{
                        backgroundColor: isActive ? "var(--site-card-bg, #141A2E)" : "transparent",
                        borderColor: isActive ? "var(--site-primary, #6366F1)" : "transparent",
                        color: isActive ? "var(--site-text-main, #F8FAFC)" : "var(--site-navbar-text, #CBD5E1)",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <link.icon
                          className="h-4 w-4"
                          style={{
                            color: isActive ? "var(--site-bright, #818CF8)" : "var(--site-text-muted, #94A3B8)",
                          }}
                        />
                        <span>{link.name}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5" style={{ color: "var(--site-text-muted, #94A3B8)" }} />
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
