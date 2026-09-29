"use client";

import React, { useState, useEffect } from "react";
import { DeliveryType } from "@/types/product";
import { OrderAccessDetails } from "@/types/order";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import {
  Save,
  Key,
  Link as LinkIcon,
  User,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface AdminAccessFormProps {
  orderId: string;
  initialType?: DeliveryType;
  onSaved?: () => void;
}

export const AdminAccessForm: React.FC<AdminAccessFormProps> = ({
  orderId,
  initialType = "ACCOUNT_CREDENTIAL",
  onSaved,
}) => {
  const toast = useToast();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(initialType);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginUrl, setLoginUrl] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [activationLink, setActivationLink] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [publicInstructions, setPublicInstructions] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const access = await adminService.getOrderAccess(orderId);
        if (access && isMounted) {
          if (access.type) setDeliveryType(access.type);
          if (access.loginEmail) setLoginEmail(access.loginEmail);
          if (access.loginUsername) setLoginUsername(access.loginUsername);
          if (access.loginPassword) setLoginPassword(access.loginPassword);
          if (access.loginUrl) setLoginUrl(access.loginUrl);
          if (access.licenseKey) setLicenseKey(access.licenseKey);
          if (access.activationLink) setActivationLink(access.activationLink);
          if (access.downloadUrl) setDownloadUrl(access.downloadUrl);
          if (access.publicInstructions) setPublicInstructions(access.publicInstructions);
          if (access.additionalInstructions) setAdditionalInstructions(access.additionalInstructions);
        }
      } catch (e) {
        console.error("Failed to load access details", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminService.saveOrderAccess(orderId, {
        type: deliveryType,
        loginEmail,
        loginUsername,
        loginPassword,
        loginUrl,
        licenseKey,
        activationLink,
        downloadUrl,
        publicInstructions,
        additionalInstructions,
      });
      toast.success("Order access credentials configured and securely saved!");
      onSaved?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save access credentials.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading access data...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-bold mb-2">
          <Key className="h-3.5 w-3.5" /> Order Access &amp; Delivery Configuration
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Configure Delivery for Order
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Specify exact credentials or activation links. Sensitive items (passwords, private license keys) will be encrypted with AES-256-GCM on the backend.
        </p>
      </div>

      {/* Delivery Type Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Delivery Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(
            [
              { type: "ACCOUNT_CREDENTIAL", label: "Account Credential", icon: <User className="h-4 w-4" /> },
              { type: "LICENSE_KEY", label: "License Key", icon: <Key className="h-4 w-4" /> },
              { type: "ACTIVATION_LINK", label: "Activation Link", icon: <LinkIcon className="h-4 w-4" /> },
              { type: "DOWNLOAD_LINK", label: "Download Link", icon: <Download className="h-4 w-4" /> },
              { type: "TEXT_INSTRUCTION", label: "Text Instruction", icon: <FileText className="h-4 w-4" /> },
              { type: "OTHER", label: "Other / Custom", icon: <ShieldCheck className="h-4 w-4" /> },
            ] as const
          ).map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => setDeliveryType(item.type)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                deliveryType === item.type
                  ? "border-blue-600 bg-blue-50/70 text-blue-700 shadow-2xs"
                  : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100/70"
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Fields Based on Delivery Type */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        {deliveryType === "ACCOUNT_CREDENTIAL" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Login Email</label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="customer-account@service.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Login Username (Optional)</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="optional username"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Login Password</label>
              <input
                type="text"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="SecurePassword123!"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Login URL</label>
              <input
                type="url"
                value={loginUrl}
                onChange={(e) => setLoginUrl(e.target.value)}
                placeholder="https://app.service.com/login"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {deliveryType === "LICENSE_KEY" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">License / Product Key</label>
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono tracking-wider font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Login / Activation URL (Optional)</label>
              <input
                type="url"
                value={loginUrl}
                onChange={(e) => setLoginUrl(e.target.value)}
                placeholder="https://setup.office.com or official portal"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {deliveryType === "ACTIVATION_LINK" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Activation URL / Workspace Invitation</label>
              <input
                type="url"
                value={activationLink}
                onChange={(e) => setActivationLink(e.target.value)}
                placeholder="https://service.com/invite/xxxx-xxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {deliveryType === "DOWNLOAD_LINK" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Download Package URL</label>
              <input
                type="url"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://cdn.service.com/releases/installer.exe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Public & Additional Instructions */}
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Customer Visible Instructions
            </label>
            <textarea
              rows={3}
              value={publicInstructions}
              onChange={(e) => setPublicInstructions(e.target.value)}
              placeholder="e.g. Please do not modify password or workspace profile. Keep this account for your personal devices only."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Internal Admin Notes (Private)
            </label>
            <input
              type="text"
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="e.g. Assigned from batch B-14, slot #3"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="submit"
          isLoading={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-5 shadow-xs"
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Access Credentials
        </Button>
      </div>
    </form>
  );
};
