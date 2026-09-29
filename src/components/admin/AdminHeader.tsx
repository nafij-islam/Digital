"use client";

import React from "react";
import Link from "next/link";
import { Menu, Bell, ShieldCheck, User, Search, Store } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  title = "Dashboard",
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" target="_blank">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            <Store className="h-3.5 w-3.5 text-blue-600" />
            <span>View Live Store</span>
          </button>
        </Link>

        <div className="h-8 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden sm:block text-left leading-none">
            <p className="text-xs font-bold text-slate-900">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-purple-600 font-semibold uppercase mt-0.5">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
