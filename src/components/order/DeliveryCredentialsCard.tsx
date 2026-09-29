"use client";

import React, { useState } from "react";
import {
  DeliveryCredentials,
  DeliveryType,
} from "@/types/order";
import {
  Key,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  DownloadCloud,
  FileText,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

interface DeliveryCredentialsCardProps {
  deliveryType?: DeliveryType;
  deliveryData?: DeliveryCredentials;
}

export const DeliveryCredentialsCard: React.FC<DeliveryCredentialsCardProps> = ({
  deliveryType = "ACCOUNT_CREDENTIAL",
  deliveryData,
}) => {
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  const [isLicenseRevealed, setIsLicenseRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const toast = useToast();

  if (!deliveryData) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 bg-slate-50/50">
        Delivery information is being prepared by our fulfillment team.
      </div>
    );
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/40 via-white to-sky-50/30 p-6 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Your Digital Delivery Vault
            </h3>
            <p className="text-xs text-emerald-700 font-medium">
              Verified &amp; Secure Access
            </p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold border border-emerald-200">
          Ready to Use
        </span>
      </div>

      {/* Warning Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed">
        <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Keep your delivery information private:</strong> Do not share your login credentials or license key with anyone.
        </span>
      </div>

      {/* Dynamic Content based on Delivery Type */}
      <div className="space-y-4">
        {/* Type: ACTIVATION LINK */}
        {deliveryData.activationLink && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Direct Invitation / Activation Link
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(deliveryData.activationLink!, "Activation Link")
                }
                leftIcon={
                  copiedKey === "Activation Link" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )
                }
              >
                Copy Link
              </Button>
            </div>
            <a
              href={deliveryData.activationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="gradient"
                size="md"
                className="w-full font-bold justify-center"
                rightIcon={<ExternalLink className="h-4 w-4" />}
              >
                Open &amp; Claim Activation Link
              </Button>
            </a>
          </div>
        )}

        {/* Type: LICENSE KEY */}
        {deliveryData.licenseKey && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="h-4 w-4 text-purple-600" /> License / Product Key
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLicenseRevealed(!isLicenseRevealed)}
                  leftIcon={
                    isLicenseRevealed ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )
                  }
                >
                  {isLicenseRevealed ? "Hide" : "Reveal"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(deliveryData.licenseKey!, "License Key")}
                  leftIcon={
                    copiedKey === "License Key" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )
                  }
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="p-3 bg-slate-900 text-white rounded-xl font-mono text-sm font-bold tracking-widest text-center select-all">
              {isLicenseRevealed
                ? deliveryData.licenseKey
                : `${deliveryData.licenseKey.slice(0, 5)}-XXXX-XXXX-••••`}
            </div>
          </div>
        )}

        {/* Type: ACCOUNT CREDENTIALS (EMAIL & PASSWORD) */}
        {(deliveryData.emailOrUsername || deliveryData.password) && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-emerald-600" /> Account Access Credentials
            </div>

            {/* Email / Username */}
            {deliveryData.emailOrUsername && (
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Email / Username
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate font-mono">
                    {deliveryData.emailOrUsername}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    handleCopy(deliveryData.emailOrUsername!, "Email/Username")
                  }
                  leftIcon={
                    copiedKey === "Email/Username" ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )
                  }
                >
                  Copy
                </Button>
              </div>
            )}

            {/* Password (Masked by default) */}
            {deliveryData.password && (
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Password
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate font-mono">
                    {isPasswordRevealed ? deliveryData.password : "••••••••••••••••"}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsPasswordRevealed(!isPasswordRevealed)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 text-xs font-medium inline-flex items-center gap-1"
                  >
                    {isPasswordRevealed ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" /> <span>Reveal</span>
                      </>
                    )}
                  </button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopy(deliveryData.password!, "Password")}
                    leftIcon={
                      copiedKey === "Password" ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )
                    }
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}

            {/* Login URL */}
            {deliveryData.loginUrl && (
              <a
                href={deliveryData.loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block pt-1"
              >
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  rightIcon={<ExternalLink className="h-4 w-4" />}
                >
                  Open Official Login Page
                </Button>
              </a>
            )}
          </div>
        )}

        {/* Type: DOWNLOAD LINK */}
        {deliveryData.downloadUrl && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <DownloadCloud className="h-4 w-4 text-sky-600" /> Direct Download Asset
            </span>
            <a
              href={deliveryData.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                leftIcon={<DownloadCloud className="h-4 w-4" />}
              >
                Download Files / Installer
              </Button>
            </a>
          </div>
        )}

        {/* Text Instructions / Notes */}
        {(deliveryData.instructions || deliveryData.notes) && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <div className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-slate-500" /> Setup &amp; Usage Instructions
            </div>
            {deliveryData.instructions && (
              <p className="whitespace-pre-line leading-relaxed text-slate-600">
                {deliveryData.instructions}
              </p>
            )}
            {deliveryData.notes && (
              <p className="text-slate-500 italic pt-1">{deliveryData.notes}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
