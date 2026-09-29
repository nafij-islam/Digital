"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "@/lib/validators/checkout";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentMethods, useCreateOrder } from "@/hooks/useOrders";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { PaymentInstructionCard } from "@/components/checkout/PaymentInstructionCard";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { ShieldCheck, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/common/Container";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, couponCode, clearCart } = useCart();
  const { user } = useAuth();
  const { data: paymentMethods = [], isLoading: isPaymentMethodsLoading } = usePaymentMethods();
  const createOrderMutation = useCreateOrder();
  const toast = useToast();

  const [selectedMethodId, setSelectedMethodId] = useState<string>("");

  const totalAmount = getTotal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      paymentMethodId: "",
      senderNumber: "",
      transactionId: "",
      paymentNote: "",
      couponCode: couponCode || "",
      acceptTerms: true,
    },
  });

  // Auto-select first active payment method
  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedMethodId) {
      setSelectedMethodId(paymentMethods[0].id);
      setValue("paymentMethodId", paymentMethods[0].id);
    }
  }, [paymentMethods, selectedMethodId, setValue]);

  const handleSelectPaymentMethod = (id: string) => {
    setSelectedMethodId(id);
    setValue("paymentMethodId", id, { shouldValidate: true });
  };

  const selectedMethod = paymentMethods.find((m) => m.id === selectedMethodId);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items, router]);

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const order = await createOrderMutation.mutateAsync({
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        items: items.map((i) => ({
          productId: i.product.id,
          planId: i.selectedPlan.id,
          quantity: i.quantity,
        })),
        couponCode: data.couponCode || undefined,
        paymentMethodId: data.paymentMethodId,
        senderNumber: data.senderNumber,
        transactionId: data.transactionId,
        paymentNote: data.paymentNote || undefined,
        acceptTerms: data.acceptTerms,
      });

      clearCart();
      toast.success(
        "Your payment information has been submitted and is waiting for admin verification.",
        "Order Placed Successfully"
      );
      router.push(`/order-success/${order.id}`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit order. Please try again.");
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Container className="py-8 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout &amp; Payment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete your customer details and verify manual payment via bKash or Nagad.
          </p>
        </div>
        <Link href="/cart">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
            Back to Cart
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Area (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Customer Info */}
            <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="h-8 w-8 rounded-xl bg-primary-50 text-primary-600 font-bold text-xs flex items-center justify-center border border-primary-200/60">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Customer &amp; Delivery Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. Nafij Islam"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
                <Input
                  label="Email Address (Where credentials will be sent)"
                  required
                  type="email"
                  placeholder="nafij@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <Input
                label="Active WhatsApp / Mobile Number"
                required
                placeholder="017XXXXXXXX"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>

            {/* Step 2: Payment Provider Selection & Dynamic Number Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-7 shadow-soft space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 font-bold text-xs flex items-center justify-center border border-purple-200/60">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Manual Payment Transfer
                </h3>
              </div>

              <PaymentMethodSelector
                methods={paymentMethods}
                selectedMethodId={selectedMethodId}
                onSelect={handleSelectPaymentMethod}
              />
              {errors.paymentMethodId && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.paymentMethodId.message}
                </p>
              )}

              {/* Dynamic instruction card based on chosen method */}
              {selectedMethod && (
                <PaymentInstructionCard
                  method={selectedMethod}
                  amountToPay={totalAmount}
                />
              )}
            </div>

            {/* Step 3: Transaction ID Submission */}
            <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-5 sm:p-7 shadow-soft space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center border border-emerald-200/60">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Submit Payment Verification Proof
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Sender Mobile Number"
                  required
                  placeholder="e.g. 01712345678"
                  hint="The bKash/Nagad number from which you sent the money"
                  error={errors.senderNumber?.message}
                  {...register("senderNumber")}
                />
                <Input
                  label="Transaction ID (TrxID)"
                  required
                  placeholder="e.g. BL79XQ8210"
                  hint="The 8-10 digit Transaction ID from your SMS/App"
                  className="font-mono uppercase font-bold"
                  error={errors.transactionId?.message}
                  {...register("transactionId")}
                />
              </div>

              <Textarea
                label="Optional Payment Note / Additional Info"
                placeholder="Mention any specific instructions for this order..."
                rows={2}
                error={errors.paymentNote?.message}
                {...register("paymentNote")}
              />

              {/* Terms Acceptance */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    {...register("acceptTerms")}
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary-600 underline font-semibold">
                      Terms of Service
                    </Link>{" "}
                    and understand my order will be marked as{" "}
                    <span className="font-bold text-purple-700">
                      Pending Verification
                    </span>{" "}
                    until reviewed by the administrator.
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
                variant="primary"
                size="xl"
                className="w-full font-bold shadow-soft text-base mt-2 h-12 justify-center"
                isLoading={createOrderMutation.isPending}
                leftIcon={<Lock className="h-5 w-5 mr-1" />}
              >
                Place Order &amp; Submit Payment
              </Button>
            </div>
          </div>

          {/* Right Summary Area (4 cols) */}
          <div className="lg:col-span-4">
            <CheckoutSummary />
          </div>
        </div>
      </form>
    </Container>
  );
}
