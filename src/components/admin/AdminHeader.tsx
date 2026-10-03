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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#353560]/40 bg-[#29294D] px-4 sm:px-6 lg:px-8 shadow-neu-raised">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-[#AAAAC1] hover:bg-[#303057] hover:text-[#F5F5FA] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-mono font-bold text-[#F5F5FA] leading-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" target="_blank">
          <button className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border border-[#353560]/40 bg-[#303057] text-xs font-mono font-semibold text-[#AAAAC1] hover:text-[#F5F5FA] shadow-neu-raised transition-all">
            <Store className="h-3.5 w-3.5 text-[#716DFF]" />
            <span>Console Live</span>
          </button>
        </Link>

        <div className="h-8 w-px bg-[#353560]/40 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-[#303057] text-[#716DFF] border border-[#353560]/40 shadow-neu-raised flex items-center justify-center font-mono font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden sm:block text-left leading-none">
            <p className="text-xs font-mono font-bold text-[#F5F5FA]">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-[#716DFF] font-mono font-semibold uppercase mt-0.5">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
