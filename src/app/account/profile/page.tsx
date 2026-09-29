"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { User, Mail, Phone, CheckCircle2 } from "lucide-react";

export default function AccountProfilePage() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ name, phone });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Profile Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Update your contact information for order confirmations and WhatsApp delivery updates.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="h-4 w-4" />}
          />

          <Input
            label="Email Address"
            disabled
            value={user?.email || ""}
            leftIcon={<Mail className="h-4 w-4" />}
            hint="Email cannot be modified directly. Contact support for assistance."
          />

          <Input
            label="Mobile / WhatsApp Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="h-4 w-4" />}
            placeholder="017XXXXXXXX"
            hint="Used for instant WhatsApp delivery updates."
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="gradient"
              size="md"
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
