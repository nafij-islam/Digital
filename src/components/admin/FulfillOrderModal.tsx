"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { DeliveryType, FulfillOrderPayload, Order } from "@/types/order";
import { CheckCircle2, ShieldCheck, Lock } from "lucide-react";

interface FulfillOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onFulfill: (payload: FulfillOrderPayload) => Promise<void>;
}

export const FulfillOrderModal: React.FC<FulfillOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onFulfill,
}) => {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    order?.deliveryType || "ACCOUNT_CREDENTIAL"
  );
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUrl, setLoginUrl] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [activationLink, setActivationLink] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onFulfill({
        orderId: order.id,
        deliveryType,
        emailOrUsername: emailOrUsername || undefined,
        password: password || undefined,
        loginUrl: loginUrl || undefined,
        licenseKey: licenseKey || undefined,
        activationLink: activationLink || undefined,
        downloadUrl: downloadUrl || undefined,
        instructions: instructions || undefined,
        notes: notes || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Fulfill Order #${order.orderNumber}`}
      description={`Assign digital delivery credentials to ${order.customerName} (${order.customerEmail})`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Delivery Format"
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
          options={[
            { value: "ACCOUNT_CREDENTIAL", label: "Account Credentials (Email & Password)" },
            { value: "ACTIVATION_LINK", label: "Activation / Team Invitation Link" },
            { value: "LICENSE_KEY", label: "Product / Software License Key" },
            { value: "DOWNLOAD_LINK", label: "Direct Download Link" },
            { value: "TEXT_INSTRUCTION", label: "Setup Guide / Text Instruction" },
            { value: "OTHER", label: "Other / Custom Delivery" },
          ]}
        />

        {/* Dynamic Fields for ACCOUNT CREDENTIAL */}
        {deliveryType === "ACCOUNT_CREDENTIAL" && (
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <Input
              label="Login Email / Username"
              required
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="e.g. user@digivault.access"
            />
            <Input
              label="Account Password"
              required
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
            />
            <Input
              label="Official Login URL"
              value={loginUrl}
              onChange={(e) => setLoginUrl(e.target.value)}
              placeholder="e.g. https://chatgpt.com/auth/login"
            />
          </div>
        )}

        {/* Dynamic Fields for ACTIVATION LINK */}
        {deliveryType === "ACTIVATION_LINK" && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <Input
              label="Activation / Invitation URL"
              required
              value={activationLink}
              onChange={(e) => setActivationLink(e.target.value)}
              placeholder="https://www.canva.com/brand/join?token=..."
            />
          </div>
        )}

        {/* Dynamic Fields for LICENSE KEY */}
        {deliveryType === "LICENSE_KEY" && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <Input
              label="Product License / Serial Key"
              required
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
            />
          </div>
        )}

        {/* Dynamic Fields for DOWNLOAD LINK */}
        {deliveryType === "DOWNLOAD_LINK" && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <Input
              label="Direct File Download URL"
              required
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="https://assets.example.com/download/file.zip"
            />
          </div>
        )}

        {/* Common Instructions & Notes */}
        <Textarea
          label="Customer Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Steps customer should follow to access their tool..."
          rows={3}
        />

        <Input
          label="Internal Admin Notes (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Supplier account slot #4"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gradient"
            isLoading={isSubmitting}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Fulfill &amp; Deliver to Customer
          </Button>
        </div>
      </form>
    </Modal>
  );
};
