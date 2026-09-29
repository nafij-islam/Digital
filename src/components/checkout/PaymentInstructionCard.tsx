"use client";

import React, { useState } from "react";
import { PaymentMethod } from "@/types/payment";
import { formatPrice } from "@/lib/utils/formatters";
import { Copy, Check, Info, Smartphone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

interface PaymentInstructionCardProps {
  method: PaymentMethod;
  amountToPay: number;
}

export const PaymentInstructionCard: React.FC<PaymentInstructionCardProps> = ({
  method,
  amountToPay,
}) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(method.paymentNumber);
    setCopied(true);
    toast.success("Payment number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isBkash = method.provider === "bkash";
  const isNagad = method.provider === "nagad";

  return (
    <div
      className={cn(
        "rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm",
        isBkash
          ? "border-pink-200 bg-gradient-to-br from-pink-50/50 via-white to-pink-50/20"
          : isNagad
          ? "border-orange-200 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/20"
          : "border-slate-200 bg-slate-50/50"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Payment Provider
          </span>
          <h3 className="text-base font-bold text-slate-900">{method.displayName}</h3>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Amount to Send
          </span>
          <div className="text-xl font-black text-slate-900">
            {formatPrice(amountToPay)}
          </div>
        </div>
      </div>

      {/* Number Box with Copy */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {method.displayName} ({method.accountType})
            </div>
            <div className="text-base sm:text-lg font-black font-mono tracking-wider text-slate-900 truncate">
              {method.paymentNumber}
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopyNumber}
          leftIcon={
            copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )
          }
          className="shrink-0"
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      {/* Instructions list */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Info className="h-4 w-4 text-blue-500" /> Instructions
        </div>
        <div className="rounded-2xl bg-white/80 p-3.5 text-xs text-slate-600 border border-slate-200/60 leading-relaxed whitespace-pre-line font-medium">
          {method.instructions}
        </div>
      </div>
    </div>
  );
};
