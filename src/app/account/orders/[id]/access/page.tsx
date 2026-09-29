"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Lock,
  Download,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { activationService } from "@/services/activationService";
import { ActivationBlockRenderer } from "@/components/orders/ActivationBlockRenderer";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export default function OrderAccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = params.id as string;

  const initialTab = searchParams.get("tab") === "activation" ? "activation" : "access";
  const [activeTab, setActiveTab] = useState<"access" | "activation">(initialTab);
  const [revealedFields, setRevealedFields] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Load Order details
  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrderById(orderId),
  });

  // Load Order Access / Delivery Credentials
  const { data: accessDetails, isLoading: isAccessLoading } = useQuery({
    queryKey: ["orderAccess", orderId],
    queryFn: () => orderService.getOrderAccess(orderId),
    enabled: !!order && order.status === "FULFILLED",
  });

  // Load Order-Specific Custom Activation Process
  const { data: activationProcess, isLoading: isActivationLoading } = useQuery({
    queryKey: ["orderActivation", orderId],
    queryFn: () => activationService.getCustomerActivationProcess(orderId),
    enabled: !!order,
  });

  const toggleReveal = (fieldKey: string) => {
    setRevealedFields((prev) => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => {
      setCopiedField((curr) => (curr === fieldKey ? null : curr));
    }, 2000);
  };

  if (isOrderLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading access vault..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center space-y-4 shadow-soft">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          The requested order does not exist or you do not have permission to view it.
        </p>
        <Link
          href="/account/orders"
          className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to My Orders
        </Link>
      </div>
    );
  }

  const primaryItem = order.items?.[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto min-w-0">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Order Details
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span>Order #{order.orderNumber}</span>
        </div>
      </div>

      {/* Main Order Access Header Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold mb-2 border border-emerald-200/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Secure Delivery Vault
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
              {primaryItem?.productName || "Digital Product"} Access
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Plan: <span className="font-semibold text-slate-800">{primaryItem?.planName}</span> •
              Purchased: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                order.status === "FULFILLED"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {order.status === "FULFILLED" ? "Delivered & Active" : order.status}
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 pt-5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("access")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === "access"
                ? "bg-primary-500 text-white shadow-soft"
                : "bg-[#F7F8FB] text-slate-600 border border-slate-200/70 hover:bg-white hover:text-slate-900"
            }`}
          >
            <Key className="h-4 w-4" />
            <span>Access Details</span>
          </button>

          <button
            onClick={() => setActiveTab("activation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === "activation"
                ? "bg-primary-500 text-white shadow-soft"
                : "bg-[#F7F8FB] text-slate-600 border border-slate-200/70 hover:bg-white hover:text-slate-900"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Activation Process</span>
            {activationProcess && activationProcess.blocks?.length > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === "activation"
                    ? "bg-primary-700 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {activationProcess.blocks.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Access Details */}
      {activeTab === "access" && (
        <div className="space-y-6">
          {order.status !== "FULFILLED" ? (
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-6 sm:p-8 text-center space-y-3 shadow-soft">
              <Lock className="h-8 w-8 text-amber-600 mx-auto" />
              <h3 className="text-base font-bold text-amber-900">Order Pending Fulfillment</h3>
              <p className="text-xs sm:text-sm text-amber-700 max-w-md mx-auto leading-relaxed">
                Your payment is currently being verified or processed. Once our team completes
                setup, your credentials will appear here immediately.
              </p>
            </div>
          ) : isAccessLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner text="Decrypting credentials..." />
            </div>
          ) : !accessDetails ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 text-center space-y-2 shadow-soft">
              <AlertCircle className="h-8 w-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Credentials Configured Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                The order is marked fulfilled, but access details have not been entered by the
                administrator yet. Please reach out to support.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-soft space-y-6 min-w-0">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">Credentials &amp; Access Keys</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click Reveal to view sensitive passwords or keys. Never share these credentials
                  with unauthorized parties.
                </p>
              </div>

              {/* Delivery Blocks with Inset Tactile Treatment */}
              <div className="space-y-3.5 min-w-0">
                {/* Login Email / Username */}
                {(accessDetails.loginEmail || accessDetails.loginUsername) && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#F7F8FB] border border-slate-200/80 shadow-inset gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Login Email / Username
                      </span>
                      <p className="font-mono text-xs sm:text-sm font-bold text-slate-900 mt-0.5 break-all">
                        {accessDetails.loginEmail || accessDetails.loginUsername}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          accessDetails.loginEmail || accessDetails.loginUsername || "",
                          "loginEmail"
                        )
                      }
                      className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-[#F7F8FB] shadow-soft active:shadow-pressed transition-all shrink-0 self-start sm:self-center"
                    >
                      {copiedField === "loginEmail" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Login Password (Masked initially) */}
                {accessDetails.loginPassword && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#F7F8FB] border border-slate-200/80 shadow-inset gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Password
                      </span>
                      <p className="font-mono text-xs sm:text-sm font-bold text-slate-900 mt-0.5 tracking-wider break-all">
                        {revealedFields["password"]
                          ? accessDetails.loginPassword
                          : "••••••••••••••••"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <button
                        onClick={() => toggleReveal("password")}
                        className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-[#F7F8FB] shadow-soft active:shadow-pressed transition-all"
                      >
                        {revealedFields["password"] ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5 text-slate-400" />
                            <span>Reveal</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          copyToClipboard(accessDetails.loginPassword || "", "password")
                        }
                        className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-[#F7F8FB] shadow-soft active:shadow-pressed transition-all"
                      >
                        {copiedField === "password" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-slate-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* License Key (Masked initially) */}
                {accessDetails.licenseKey && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#F7F8FB] border border-slate-200/80 shadow-inset gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        License Key
                      </span>
                      <p className="font-mono text-xs sm:text-sm font-bold text-slate-900 mt-0.5 tracking-wider break-all">
                        {revealedFields["licenseKey"]
                          ? accessDetails.licenseKey
                          : "••••-••••-••••-••••"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <button
                        onClick={() => toggleReveal("licenseKey")}
                        className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-[#F7F8FB] shadow-soft active:shadow-pressed transition-all"
                      >
                        {revealedFields["licenseKey"] ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5 text-slate-400" />
                            <span>Reveal</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          copyToClipboard(accessDetails.licenseKey || "", "licenseKey")
                        }
                        className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-[#F7F8FB] shadow-soft active:shadow-pressed transition-all"
                      >
                        {copiedField === "licenseKey" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-slate-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Login URL */}
                {accessDetails.loginUrl && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#F7F8FB] border border-slate-200/80 shadow-inset gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Official Login URL
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 break-all mt-0.5">
                        {accessDetails.loginUrl}
                      </p>
                    </div>
                    <a
                      href={accessDetails.loginUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold transition-all shadow-soft shrink-0 self-start sm:self-center"
                    >
                      <span>Open Login</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                {/* Activation Link */}
                {accessDetails.activationLink && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 shadow-inset gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                        Activation Link / Invitation
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-emerald-950 break-all mt-0.5">
                        {accessDetails.activationLink}
                      </p>
                    </div>
                    <a
                      href={accessDetails.activationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-soft shrink-0 self-start sm:self-center"
                    >
                      <span>Activate Product</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                {/* Download URL */}
                {accessDetails.downloadUrl && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#F7F8FB] border border-slate-200/80 shadow-inset gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Download Package
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 break-all mt-0.5">
                        Official Software Installer / Package
                      </p>
                    </div>
                    <a
                      href={accessDetails.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-soft shrink-0 self-start sm:self-center"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                )}

                {/* Public Instructions / Notes */}
                {(accessDetails.publicInstructions || accessDetails.additionalInstructions) && (
                  <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200/70 shadow-soft space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Important Instructions
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-950 leading-relaxed whitespace-pre-line break-words">
                      {accessDetails.publicInstructions || accessDetails.additionalInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Activation Process */}
      {activeTab === "activation" && (
        <div className="space-y-6">
          {isActivationLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner text="Loading activation steps..." />
            </div>
          ) : !activationProcess || activationProcess.blocks?.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center space-y-3 shadow-soft">
              <BookOpen className="h-8 w-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No Custom Activation Steps Needed
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                This digital product can be activated directly using the credentials and login link
                provided in the Access Details tab.
              </p>
              <button
                onClick={() => setActiveTab("access")}
                className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700"
              >
                Go to Access Details <ArrowLeft className="h-3.5 w-3.5 ml-1 rotate-180" />
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-soft space-y-6 min-w-0">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {activationProcess.title || "Official Product Activation Guide"}
                </h3>
                {activationProcess.subtitle && (
                  <p className="text-xs text-slate-500 mt-1">{activationProcess.subtitle}</p>
                )}
              </div>

              {/* Structured Activation Blocks */}
              <div className="space-y-4 min-w-0">
                {activationProcess.blocks
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((block, idx) => (
                    <ActivationBlockRenderer
                      key={block.id || idx}
                      block={block}
                      stepNumber={
                        block.type === "STEP"
                          ? activationProcess.blocks
                              .filter((b) => b.type === "STEP")
                              .findIndex((b) => b.id === block.id) + 1
                          : undefined
                      }
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
