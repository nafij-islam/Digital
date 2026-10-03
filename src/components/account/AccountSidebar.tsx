"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  HelpCircle,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

export const AccountSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    {
      label: "Dashboard",
      href: "/account",
      icon: <LayoutDashboard className="h-4 w-4" />,
      exact: true,
    },
    {
      label: "My Orders",
      href: "/account/orders",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      label: "Profile",
      href: "/account/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Support",
      href: "/account/support",
      icon: <HelpCircle className="h-4 w-4" />,
    },
  ];

  return (
    <>
      {/* Mobile & Tablet: Compact Top Tactile Navigation Bar (< lg) */}
      <div className="lg:hidden w-full space-y-3 mb-2 animate-neu-fade">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#303057] border border-[#353560]/40 shadow-neu-raised">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-[#29294D] text-[#716DFF] border border-[#353560]/40 shadow-neu-pressed font-mono font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-[#F5F5FA] text-xs truncate">
                {user?.name || "Console Operator"}
              </h4>
              <p className="text-[10px] text-[#777790] font-mono truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isAdmin && (
              <Link
                href="/admin"
                className="p-1.5 rounded-xl bg-[#29294D] text-[#716DFF] border border-[#353560]/40 shadow-neu-pressed"
                title="Admin Console"
              >
                <Shield className="h-4 w-4" />
              </Link>
            )}
            <button
              onClick={logout}
              className="p-1.5 rounded-xl bg-[#29294D] text-[#EF7B98] hover:bg-[#353560] border border-[#353560]/40 shadow-neu-pressed transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all",
                  isActive
                    ? "bg-[#29294D] text-[#716DFF] shadow-neu-pressed border border-[#353560]/40"
                    : "bg-[#303057] text-[#AAAAC1] border border-[#353560]/40 shadow-neu-raised hover:text-[#F5F5FA]"
                )}
              >
                <span className={cn(isActive ? "text-[#716DFF]" : "text-[#777790]")}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sticky Sidebar (lg+) */}
      <aside className="hidden lg:block w-64 shrink-0 space-y-6 animate-neu-fade">
        {/* User Mini Profile Card */}
        <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 shadow-neu-raised flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-[#29294D] text-[#716DFF] border border-[#353560]/40 shadow-neu-pressed flex items-center justify-center font-mono font-bold text-base shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#F5F5FA] text-sm truncate">
              {user?.name || "Operator"}
            </h4>
            <p className="text-xs text-[#777790] font-mono truncate">{user?.email || "operator@console.com"}</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-3.5 shadow-neu-raised space-y-1.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all",
                  isActive
                    ? "bg-[#29294D] text-[#716DFF] shadow-neu-pressed border border-[#353560]/40"
                    : "text-[#AAAAC1] hover:bg-[#353560] hover:text-[#F5F5FA]"
                )}
              >
                <span className={cn(isActive ? "text-[#716DFF]" : "text-[#777790]")}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-mono font-bold text-[#716DFF] hover:bg-[#353560] transition-colors"
            >
              <Shield className="h-4 w-4 text-[#716DFF]" />
              <span>Admin Console</span>
            </Link>
          )}

          <div className="h-px bg-[#353560]/40 my-2" />

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-mono font-bold text-[#EF7B98] hover:bg-[#29294D] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>
    </>
  );
};
