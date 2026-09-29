"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordFormData } from "@/lib/validators/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { Lock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AccountSecurityPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      // Simulate password change
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Password changed successfully!");
      reset();
    } catch {
      toast.error("Failed to change password. Please check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Security Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your account password and security preferences.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>
            Passwords are encrypted on secure backend servers. Never share your account credentials with anyone.
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            required
            type="password"
            placeholder="••••••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          <Input
            label="New Password"
            required
            type="password"
            placeholder="Min. 6 characters"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <Input
            label="Confirm New Password"
            required
            type="password"
            placeholder="Re-type new password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="gradient"
              size="md"
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
