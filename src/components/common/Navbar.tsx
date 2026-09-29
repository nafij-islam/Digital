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
  LayoutDashboard,
  Shield,
  HelpCircle,
  Package,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Logo } from "./Logo";
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
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Support", href: "/account/support" },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          isScrolled
            ? "bg-[#F3F5F9]/90 backdrop-blur-md shadow-floating border-b border-slate-200/70"
            : "bg-[#F3F5F9]/80 backdrop-blur-xs border-b border-slate-200/50"
        )}
      >
        <Container className="h-[70px]">
          {/* Desktop 3-region Grid Layout (1fr auto 1fr) & Mobile Flex */}
          <div className="h-full grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center w-full">
            {/* 1. LEFT REGION: Brand Logo */}
            <div className="justify-self-start flex items-center">
              <Logo size="md" />
            </div>

            {/* 2. CENTER REGION: Strictly Centered Navigation Menu (Desktop Only) */}
            <nav className="hidden md:flex justify-self-center items-center gap-1 p-1 bg-[#F7F8FB] border border-slate-200/70 rounded-xl shadow-inset">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all relative select-none",
                      isActive
                        ? "bg-white text-[var(--site-primary,#356DF3)] shadow-soft border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                    )}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-3 rounded-full bg-[var(--site-primary,#356DF3)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* 3. RIGHT REGION: Search / Cart / Account Actions */}
            <div className="justify-self-end flex items-center gap-2 sm:gap-2.5">
              {/* Desktop Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2.5 h-10 px-3.5 rounded-xl bg-[#F7F8FB] border border-slate-200/80 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-white shadow-inset hover:shadow-soft transition-all"
                aria-label="Search digital products"
              >
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-400">Search products...</span>
                <kbd className="hidden lg:inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-200">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search Button (Compact) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden h-10 w-10 rounded-xl bg-white border border-slate-200/80 shadow-soft text-slate-600 flex items-center justify-center hover:bg-[#F7F8FB] active:shadow-pressed transition-all"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Cart Trigger Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative h-10 w-10 rounded-xl bg-white border border-slate-200/80 shadow-soft text-slate-700 flex items-center justify-center hover:bg-[#F7F8FB] hover:text-[var(--site-primary,#356DF3)] active:shadow-pressed transition-all"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="h-4 w-4" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-[var(--site-primary,#356DF3)] text-[10px] font-extrabold text-white flex items-center justify-center shadow-xs">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Desktop Auth States */}
              <div className="hidden md:flex items-center">
                {isAuthenticated ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 h-10 px-2.5 rounded-xl bg-white border border-slate-200/80 shadow-soft hover:shadow-raised transition-all"
                    >
                      <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-[var(--site-primary,#356DF3)] to-[var(--site-secondary,#7548F5)] text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate">
                        {user?.name?.split(" ")[0]}
                      </span>
                      <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-floating z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email}</p>
                        </div>

                        <div className="space-y-0.5">
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#F3F5F9] rounded-xl transition-colors"
                          >
                            <Package className="h-3.5 w-3.5 text-[var(--site-primary,#356DF3)]" />
                            <span>My Orders &amp; Access</span>
                          </Link>

                          <Link
                            href="/account/profile"
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#F3F5F9] rounded-xl transition-colors"
                          >
                            <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                            <span>Profile Settings</span>
                          </Link>

                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                            >
                              <Shield className="h-3.5 w-3.5 text-purple-600" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-slate-100 pt-1 mt-1">
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
                      className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="h-10 px-3.5 rounded-xl bg-gradient-to-r from-[var(--site-primary,#356DF3)] to-[var(--site-secondary,#7548F5)] hover:brightness-105 text-white text-xs font-bold transition-all shadow-soft hover:shadow-raised flex items-center justify-center gap-1.5"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="md:hidden h-10 w-10 rounded-xl bg-white border border-slate-200/80 shadow-soft text-slate-700 flex items-center justify-center hover:bg-[#F7F8FB] active:shadow-pressed transition-all"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Neumorphic Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Tactile Drawer Content */}
          <div
            className="relative w-[85vw] max-w-sm h-full bg-[#F3F5F9] border-l border-slate-200/80 shadow-floating p-5 flex flex-col justify-between safe-pb z-10 animate-in slide-in-from-right duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <Logo size="sm" />
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="h-9 w-9 rounded-xl bg-white border border-slate-200/80 shadow-soft flex items-center justify-center text-slate-500 hover:text-slate-800"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* User Brief if Logged In */}
              {isAuthenticated && (
                <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email}</p>
                  </div>
                </div>
              )}

              {/* Primary Navigation Links */}
              <div className="mt-5 space-y-1.5">
                <div className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Navigation
                </div>
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href || pathname.startsWith(link.href + "/");

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all",
                        isActive
                          ? "bg-white text-primary-600 shadow-soft border border-slate-200/70"
                          : "text-slate-700 hover:bg-white/70"
                      )}
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </Link>
                  );
                })}
              </div>

              {/* Account / Order links if Logged In */}
              {isAuthenticated ? (
                <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-1.5">
                  <div className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Account
                  </div>
                  <Link
                    href="/account/orders"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-white/70"
                  >
                    <span className="flex items-center gap-2.5">
                      <Package className="h-4 w-4 text-primary-500" />
                      <span>My Orders &amp; Access Vault</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/account/profile"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-white/70"
                  >
                    <span className="flex items-center gap-2.5">
                      <UserIcon className="h-4 w-4 text-slate-400" />
                      <span>Profile</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50/50 border border-purple-200/50"
                    >
                      <span className="flex items-center gap-2.5">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span>Admin Dashboard</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-purple-400" />
                    </Link>
                  )}
                </div>
              ) : null}
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-slate-200/80">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="w-full h-11 rounded-xl bg-white border border-rose-200 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 shadow-soft hover:bg-rose-50 active:shadow-pressed"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="w-full h-11 rounded-xl bg-white border border-slate-200/90 text-slate-800 text-xs font-bold flex items-center justify-center shadow-soft"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
