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
      <div className="lg:hidden w-full space-y-3 mb-2">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-xs truncate">
                {user?.name || "Customer Account"}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isAdmin && (
              <Link
                href="/admin"
                className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-200"
                title="Admin Dashboard"
              >
                <Shield className="h-4 w-4" />
              </Link>
            )}
            <button
              onClick={logout}
              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
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
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                  isActive
                    ? "bg-white text-primary-600 shadow-soft border border-slate-200/80"
                    : "bg-[#F7F8FB] text-slate-600 border border-slate-200/60 hover:bg-white"
                )}
              >
                <span className={cn(isActive ? "text-primary-500" : "text-slate-400")}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sticky Sidebar (lg+) */}
      <aside className="hidden lg:block w-64 shrink-0 space-y-6">
        {/* User Mini Profile Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-2xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-sm truncate">
              {user?.name || "Customer"}
            </h4>
            <p className="text-xs text-slate-400 font-mono truncate">{user?.email || "customer@store.com"}</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all",
                  isActive
                    ? "bg-primary-50 text-primary-600 shadow-inset border border-primary-200/50"
                    : "text-slate-600 hover:bg-[#F3F5F9] hover:text-slate-900"
                )}
              >
                <span className={cn(isActive ? "text-primary-600" : "text-slate-400")}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-purple-700 hover:bg-purple-50 transition-colors"
            >
              <Shield className="h-4 w-4 text-purple-600" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <div className="h-px bg-slate-100 my-2" />

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>
    </>
  );
};
