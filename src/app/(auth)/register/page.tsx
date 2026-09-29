"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validators/auth";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { Lock, Mail, User, Phone, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: true,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const user = await registerUser(data);
      toast.success(`Account created! Welcome, ${user.name}`);
      router.push("/account");
    } catch (error: any) {
      toast.error(error?.message || "Registration failed. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-card space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Create Free Account
        </h2>
        <p className="text-xs text-slate-500">
          Unlock instant access to digital licenses, subscriptions, and exclusive discounts.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          required
          placeholder="e.g. Nafij Islam"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email Address"
          required
          type="email"
          placeholder="yourname@domain.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Mobile / WhatsApp Number (Optional)"
          placeholder="017XXXXXXXX"
          leftIcon={<Phone className="h-4 w-4" />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <Input
          label="Password"
          required
          type="password"
          placeholder="Min. 6 characters"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm Password"
          required
          type="password"
          placeholder="Re-type password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
            <input
              type="checkbox"
              className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              {...register("acceptTerms")}
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-primary-600 underline font-semibold">
                Terms of Service
              </Link>{" "}
              and Privacy Policy.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-xs text-rose-600 font-medium mt-1">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full font-bold shadow-md shadow-primary-500/20 mt-2"
          isLoading={isLoading}
        >
          Create Account <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-600 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
