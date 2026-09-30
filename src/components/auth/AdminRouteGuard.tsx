"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { tokenStorage } from "@/lib/auth/token";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Track validation status
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // /admin/login is an explicit public exception
    if (isLoginPage) {
      setIsValidating(false);
      setIsAuthorized(true);
      return;
    }

    let isMounted = true;

    async function checkAdminAuth() {
      setIsValidating(true);
      setIsAuthorized(false);

      const token = tokenStorage.getToken();
      if (!token) {
        if (isMounted) {
          setIsValidating(false);
          setIsAuthorized(false);
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        }
        return;
      }

      try {
        // Authoritative verification directly from backend MongoDB
        const verifiedUser = await authService.fetchMe();

        if (!isMounted) return;

        if (!verifiedUser) {
          // Token is invalid, expired, or user deleted
          tokenStorage.clearToken();
          setIsValidating(false);
          setIsAuthorized(false);
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        const role = String(verifiedUser.role || "").toLowerCase();
        const hasAdminAccess = role === "admin" || role === "superadmin";

        if (hasAdminAccess) {
          useAuth.setState({
            user: verifiedUser,
            token,
            isAuthenticated: true,
            isAdmin: true,
            isLoading: false,
          });
          setIsAuthorized(true);
          setIsValidating(false);
        } else {
          // User exists, but is a normal customer
          useAuth.setState({
            user: verifiedUser,
            token,
            isAuthenticated: true,
            isAdmin: false,
            isLoading: false,
          });
          setIsAuthorized(false);
          setIsValidating(false);
          // Block immediately and redirect away from /admin
          router.replace("/account");
        }
      } catch {
        if (!isMounted) return;
        tokenStorage.clearToken();
        setIsValidating(false);
        setIsAuthorized(false);
        router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }

    checkAdminAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  // If on public admin login page, render children directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Critical: Never flash admin content for even one frame before authorization is confirmed
  if (isValidating || !isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white select-none">
        <div className="flex flex-col items-center gap-4 max-w-sm px-6 text-center">
          <LoadingSpinner text="Verifying administrator security..." size="lg" className="text-white" />
          <p className="text-xs text-slate-400 font-medium">
            Confirming credentials with DigiVault Secure Gateway...
          </p>
        </div>
      </div>
    );
  }

  // Authorized admin or superadmin
  return <>{children}</>;
}
