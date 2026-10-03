import React from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-base)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto flex justify-center text-center">
        <Logo size="lg" className="mb-6" />
      </div>

      <div className="max-w-md w-full mx-auto">{children}</div>

      <div className="max-w-md w-full mx-auto text-center text-xs font-mono text-[#777790]">
        © {new Date().getFullYear()} shop.nafij • Verified Digital Subscriptions.
      </div>
    </div>
  );
}
