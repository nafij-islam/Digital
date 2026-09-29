"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserSubscription } from "@/types/subscription";
import { formatShortDate } from "@/lib/utils/formatters";
import { SUBSCRIPTION_STATUS_CONFIG } from "@/lib/constants/statuses";
import { Button } from "@/components/ui/Button";
import { RotateCw, ExternalLink, Calendar, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SubscriptionCardProps {
  subscription: UserSubscription;
  onRenew?: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onRenew,
}) => {
  const statusConfig = SUBSCRIPTION_STATUS_CONFIG[subscription.status] || {
    label: subscription.status,
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
    borderColor: "border-slate-200",
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
            <Image
              src={subscription.productImage}
              alt={subscription.productName}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
              {subscription.productName}
            </h3>
            <p className="text-xs font-semibold text-primary-600">
              Plan: {subscription.planName}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold border",
            statusConfig.bgColor,
            statusConfig.textColor,
            statusConfig.borderColor
          )}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Date timeline */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">
            Activated On
          </span>
          <span className="font-semibold text-slate-800">
            {formatShortDate(subscription.startDate)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">
            Expires On
          </span>
          <span className="font-semibold text-slate-800">
            {formatShortDate(subscription.expiryDate)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <Link href={`/account/orders/${subscription.orderId}`}>
          <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
            View Access Key
          </Button>
        </Link>

        {subscription.autoRenewAvailable && (
          <Button
            variant="gradient"
            size="sm"
            onClick={() => onRenew && onRenew(subscription.id)}
            leftIcon={<RotateCw className="h-3.5 w-3.5" />}
          >
            Renew Plan
          </Button>
        )}
      </div>
    </div>
  );
};
