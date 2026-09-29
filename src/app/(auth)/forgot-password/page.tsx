"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/lib/validators/auth";
import { authService } from "@/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email.");
    } catch {
      toast.error("Failed to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-card space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Forgot Password
        </h2>
        <p className="text-xs text-slate-500">
          Enter your registered email address and we&apos;ll send recovery instructions.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-slate-900 text-sm">Check Your Inbox</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            We have dispatched password reset instructions to your email address.
          </p>
          <Link href="/login" className="block pt-2">
            <Button variant="primary" size="sm" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            required
            type="email"
            placeholder="yourname@domain.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full font-bold shadow-md"
            isLoading={isLoading}
          >
            Send Reset Instructions
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
