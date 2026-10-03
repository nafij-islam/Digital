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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#353560]/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F5FA] tracking-tight">
            CONSOLE CHECKOUT &amp; ACTIVATION
          </h1>
          <p className="text-xs text-[#AAAAC1] mt-1">
            Complete your operator details and verify manual payment via bKash or Nagad.
          </p>
        </div>
        <Link href="/cart">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
            Back to Queue
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Area (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Customer Info */}
            <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 sm:p-7 shadow-neu-raised space-y-4 animate-neu-fade">
              <div className="flex items-center gap-3 pb-3 border-b border-[#353560]/40">
                <div className="h-8 w-8 rounded-xl bg-[#29294D] text-[#716DFF] font-mono font-bold text-xs flex items-center justify-center border border-[#353560]/40 shadow-neu-pressed">
                  01
                </div>
                <h3 className="text-base font-bold text-[#F5F5FA] font-mono tracking-wide">
                  OPERATOR &amp; CREDENTIAL DELIVERY
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
                  label="Email Address (Instant Delivery)"
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
            <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 sm:p-7 shadow-neu-raised space-y-5 animate-neu-fade">
              <div className="flex items-center gap-3 pb-3 border-b border-[#353560]/40">
                <div className="h-8 w-8 rounded-xl bg-[#29294D] text-[#716DFF] font-mono font-bold text-xs flex items-center justify-center border border-[#353560]/40 shadow-neu-pressed">
                  02
                </div>
                <h3 className="text-base font-bold text-[#F5F5FA] font-mono tracking-wide">
                  MANUAL PAYMENT GATEWAY
                </h3>
              </div>

              <PaymentMethodSelector
                methods={paymentMethods}
                selectedMethodId={selectedMethodId}
                onSelect={handleSelectPaymentMethod}
              />
              {errors.paymentMethodId && (
                <p className="text-xs text-[#EF7B98] font-medium">
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
            <div className="rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 sm:p-7 shadow-neu-raised space-y-5 animate-neu-fade">
              <div className="flex items-center gap-3 pb-3 border-b border-[#353560]/40">
                <div className="h-8 w-8 rounded-xl bg-[#29294D] text-[#6CD6B3] font-mono font-bold text-xs flex items-center justify-center border border-[#353560]/40 shadow-neu-pressed">
                  03
                </div>
                <h3 className="text-base font-bold text-[#F5F5FA] font-mono tracking-wide">
                  SUBMIT TRANSACTION TELEMETRY
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Sender Mobile Number"
                  required
                  placeholder="e.g. 01712345678"
                  hint="The bKash/Nagad number used for sending"
                  error={errors.senderNumber?.message}
                  {...register("senderNumber")}
                />
                <Input
                  label="Transaction ID (TrxID)"
                  required
                  placeholder="e.g. BL79XQ8210"
                  hint="The 8-10 digit Transaction ID from your provider SMS/App"
                  className="font-mono uppercase font-bold"
                  error={errors.transactionId?.message}
                  {...register("transactionId")}
                />
              </div>

              <Textarea
                label="Optional Operator Note / Special Instructions"
                placeholder="Mention any custom specifications for this order..."
                rows={2}
                error={errors.paymentNote?.message}
                {...register("paymentNote")}
              />

              {/* Terms Acceptance */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 mt-0.5 rounded border-[#353560] bg-[#29294D] text-[#716DFF] focus:ring-0"
                    {...register("acceptTerms")}
                  />
                  <span className="text-xs text-[#AAAAC1] leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#716DFF] underline font-semibold">
                      Console Protocols &amp; Terms
                    </Link>{" "}
                    and understand my cartridge license will be marked as{" "}
                    <span className="font-bold text-[#716DFF]">
                      Pending Verification
                    </span>{" "}
                    until telemetry is verified.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-xs text-[#EF7B98] font-medium mt-1">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="w-full font-bold shadow-neu-raised text-base mt-2 h-12 justify-center"
                isLoading={createOrderMutation.isPending}
                leftIcon={<Lock className="h-5 w-5 mr-1" />}
              >
                Submit Payment &amp; Verify Order
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
