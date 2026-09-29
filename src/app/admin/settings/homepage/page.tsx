"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminHeroVisualSetting } from "@/components/admin/AdminHeroVisualSetting";

export default function AdminHomepageSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/settings"
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Homepage Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dynamic homepage visual components and hero imagery.
          </p>
        </div>
      </div>

      <AdminHeroVisualSetting />
    </div>
  );
}
