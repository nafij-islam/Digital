"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validators/auth";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { user: currentUser, isAuthenticated, login, loginWithGoogle } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === "admin" || currentUser.role === "superadmin") {
        router.replace("/admin");
      } else {
        router.replace(redirectUrl);
      }
    }
  }, [isAuthenticated, currentUser, redirectUrl, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === "admin" || user.role === "superadmin") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
    } catch (error: any) {
      toast.error(error?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === "admin" || user.role === "superadmin") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
    } catch (error: any) {
      toast.error(error?.message || "Google sign-in could not be completed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-6 sm:p-8 shadow-neu-raised space-y-6 animate-neu-fade">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-black text-[#F5F5FA] tracking-tight">
          ACCOUNT LOGIN
        </h2>
        <p className="text-xs text-[#AAAAC1]">
          Access your digital subscriptions, orders, and credential vault.
        </p>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        disabled={isGoogleLoading || isLoading}
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 h-11 px-4 rounded-2xl border border-[#353560]/40 bg-[#29294D] text-[#F5F5FA] text-xs sm:text-sm font-bold shadow-neu-pressed hover:border-[#716DFF] transition-all disabled:opacity-50 cursor-pointer"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#353560]/50" />
        <span className="text-[11px] font-mono font-bold text-[#777790] uppercase tracking-wider">or email protocol</span>
        <div className="flex-1 h-px bg-[#353560]/50" />
      </div>

      {/* Quick demo credentials helper button for convenience */}
      <div className="p-3 rounded-2xl bg-[#29294D] border border-[#353560]/40 shadow-neu-pressed text-xs text-[#AAAAC1] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#716DFF] shrink-0" />
          <span>Demo: <strong className="text-[#F5F5FA]">nafij@example.com</strong></span>
        </div>
        <button
          type="button"
          onClick={() => {
            setValue("email", "nafij@example.com");
            setValue("password", "password123");
          }}
          className="text-[#716DFF] font-mono font-bold underline hover:text-[#F5F5FA] text-[11px]"
        >
          Auto-fill
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="yourname@domain.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-[#AAAAC1]">
            <input
              type="checkbox"
              className="rounded border-[#353560] bg-[#29294D] text-[#716DFF] focus:ring-0"
              {...register("rememberMe")}
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[#716DFF] font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full font-bold shadow-neu-raised mt-2 h-11 justify-center"
          isLoading={isLoading}
        >
          Sign In <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </form>

      <div className="text-center text-xs text-[#AAAAC1] pt-2 border-t border-[#353560]/40">
        Don&apos;t have an account yet?{" "}
        <Link href="/register" className="text-[#716DFF] font-bold hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
