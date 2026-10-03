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
        "rounded-3xl border border-[#353560]/40 bg-[#303057] p-5 sm:p-6 space-y-4 shadow-neu-raised animate-neu-fade"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#353560]/40">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#AAAAC1]">
            Selected Provider
          </span>
          <h3 className="text-base font-bold text-[#F5F5FA]">{method.displayName}</h3>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#AAAAC1]">
            Transfer Amount
          </span>
          <div className="text-xl font-black text-[#6CD6B3]">
            {formatPrice(amountToPay)}
          </div>
        </div>
      </div>

      {/* Number Box with Copy */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#29294D] border border-[#353560]/40 shadow-neu-pressed">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-[#303057] shadow-neu-raised border border-[#353560]/40 flex items-center justify-center text-[#716DFF] shrink-0">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-[#777790]">
              {method.displayName} ({method.accountType})
            </div>
            <div className="text-base sm:text-lg font-black font-mono tracking-wider text-[#F5F5FA] truncate">
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
              <Check className="h-3.5 w-3.5 text-[#6CD6B3]" />
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
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#AAAAC1]">
          <Info className="h-4 w-4 text-[#716DFF]" /> Verification Steps
        </div>
        <div className="rounded-2xl bg-[#29294D] p-3.5 text-xs text-[#AAAAC1] border border-[#353560]/40 shadow-neu-pressed leading-relaxed whitespace-pre-line font-medium">
          {method.instructions}
        </div>
      </div>
    </div>
  );
};
