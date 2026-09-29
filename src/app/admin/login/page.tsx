"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("admin@digivault.shop");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login({ email, password, rememberMe: true });
      toast.success(`Admin authenticated: ${user.name}`);
      router.push("/admin");
    } catch {
      toast.error("Failed to authenticate as administrator.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 p-4 sm:p-6 text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <Logo variant="admin" size="lg" className="justify-center" />
          <h2 className="text-2xl font-black text-white tracking-tight pt-2">
            Administrator Gateway
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access order verification, catalog management, and payment settings.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@domain.com"
              leftIcon={<Mail className="h-4 w-4" />}
              className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-purple-500"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-purple-500"
            />

            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/50 text-xs text-purple-300">
              Pre-filled with default Admin demo credentials for instant testing.
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full font-bold shadow-lg shadow-purple-900/40"
              isLoading={isLoading}
            >
              Sign In as Administrator <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
