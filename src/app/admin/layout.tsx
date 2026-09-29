"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading, initializeAuth } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && !isLoading) {
      if (!isAuthenticated) {
        router.push("/admin/login");
      }
    }
  }, [isAuthenticated, isLoginPage, isLoading, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoadingSpinner text="Authenticating administrator access..." size="lg" className="text-white" />
      </div>
    );
  }

  // Derive title from pathname
  const segments = pathname.split("/").filter(Boolean);
  const currentTitle =
    segments.length <= 1
      ? "Dashboard Overview"
      : segments[1].charAt(0).toUpperCase() + segments[1].slice(1).replace(/-/g, " ");

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={currentTitle}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
