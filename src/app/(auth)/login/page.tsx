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

  const { login } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
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

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-card space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-slate-500">
          Access your orders, active subscriptions, and secure delivery credentials.
        </p>
      </div>

      {/* Quick demo credentials helper button for convenience */}
      <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0" />
          <span>Demo Customer: <strong>nafij@example.com</strong></span>
        </div>
        <button
          type="button"
          onClick={() => {
            (document.getElementById("email") as HTMLInputElement).value = "nafij@example.com";
            (document.getElementById("password") as HTMLInputElement).value = "password123";
          }}
          className="text-purple-700 font-bold underline hover:text-purple-900 text-[11px]"
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
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              {...register("rememberMe")}
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary-600 font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full font-bold shadow-md shadow-primary-500/20 mt-2"
          isLoading={isLoading}
        >
          Sign In <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Don&apos;t have an account yet?{" "}
        <Link href="/register" className="text-primary-600 font-bold hover:underline">
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
