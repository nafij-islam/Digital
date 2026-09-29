"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Repeat,
  User,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

export const AccountSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* User Mini Profile Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card flex items-center gap-3.5">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-slate-900 text-sm truncate">
            {user?.name || "Customer"}
          </h4>
          <p className="text-xs text-slate-500 truncate">{user?.email || "customer@store.com"}</p>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="rounded-3xl border border-slate-200/90 bg-white p-3 shadow-card space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className={cn(isActive ? "text-primary-600" : "text-slate-400")}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="h-px bg-slate-100 my-2" />

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
};
