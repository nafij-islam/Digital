"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { Logo } from "./Logo";
import { SearchModal } from "./SearchModal";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const { getTotalItems, setOpen: setCartOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout, initializeAuth } = useAuth();
  const totalCartItems = getTotalItems();

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

  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileNavOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Support", href: "/account/support" },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/85 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-2.5"
            : "bg-[#F8FAFC]/90 backdrop-blur-xs border-b border-slate-200/50 py-3.5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Logo & Primary Navigation */}
          <div className="flex items-center gap-8 lg:gap-10">
            <Logo size="md" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
                      isActive
                        ? "text-blue-600 font-semibold bg-blue-50/70"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions (Search, Cart, Auth) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all hover:border-slate-300 shadow-2xs"
              aria-label="Search products"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline text-slate-400">Search tools...</span>
              <kbd className="hidden md:inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Auth States */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-400 mr-1" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        href="/account/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-slate-400" />
                        <span>Profile</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 rounded-lg transition-colors font-semibold"
                        >
                          <Shield className="h-3.5 w-3.5 text-purple-600" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
