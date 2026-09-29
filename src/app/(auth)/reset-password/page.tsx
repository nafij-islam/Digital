"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormData } from "@/lib/validators/auth";
import { authService } from "@/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { Lock, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(data.password);
      toast.success("Password reset successfully! You can now log in.");
      router.push("/login");
    } catch {
      toast.error("Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-card space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Set New Password
        </h2>
        <p className="text-xs text-slate-500">
          Enter a strong, secure password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password"
          required
          type="password"
          placeholder="Min. 6 characters"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm New Password"
          required
          type="password"
          placeholder="Re-type password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full font-bold shadow-md"
          isLoading={isLoading}
        >
          Save New Password <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </form>
    </div>
  );
}
