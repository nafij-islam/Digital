"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import { HomepageSetting } from "@/types/settings";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import {
  Upload,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";

export const AdminHeroVisualSetting: React.FC = () => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: initialSettings, isLoading, refetch } = useQuery({
    queryKey: ["admin-homepage-settings"],
    queryFn: () => settingsService.getAdminHomepageSettings(),
  });

  const [heroImage, setHeroImage] = useState<HomepageSetting["heroImage"]>(undefined);
  const [altText, setAltText] = useState("Premium Digital Products & Subscriptions");
  const [fit, setFit] = useState<"cover" | "contain">("cover");
  const [enabled, setEnabled] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setHeroImage(initialSettings.heroImage);
      if (initialSettings.heroImageAlt) setAltText(initialSettings.heroImageAlt);
      if (initialSettings.heroImageFit) setFit(initialSettings.heroImageFit);
      if (initialSettings.heroImageEnabled !== undefined) setEnabled(initialSettings.heroImageEnabled);
    }
  }, [initialSettings]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP).");
      return;
    }

    setIsUploading(true);
    try {
      const updated = await settingsService.uploadHeroImage(file);
      setHeroImage(updated.heroImage);
      toast.success("Hero image uploaded to Cloudinary successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload image to Cloudinary.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    try {
      await settingsService.deleteHeroImage();
      setHeroImage(undefined);
      toast.info("Hero image removed.");
      refetch();
    } catch {
      toast.error("Failed to remove hero image.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsService.updateHomepageSettings({
        heroImageAlt: altText,
        heroImageFit: fit,
        heroImageEnabled: enabled,
      });
      toast.success("Homepage hero settings updated successfully!");
      refetch();
    } catch {
      toast.error("Failed to update homepage settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading hero visual settings...</div>;
  }

  const currentPreviewSrc =
    heroImage?.secureUrl ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85";

  return (
    <form onSubmit={handleSave} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-bold mb-2">
          <ImageIcon className="h-3.5 w-3.5" /> Homepage Hero Visual
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Configurable Hero Image
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Upload, replace, or manage the right-hand hero visual displayed on the public storefront homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 cols: Live Preview */}
        <div className="lg:col-span-6 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Live Preview
          </label>
          <div className="relative w-full h-[280px] sm:h-[320px] rounded-3xl border border-slate-200 bg-slate-900 overflow-hidden shadow-md">
            <Image
              src={currentPreviewSrc}
              alt={altText}
              fill
              className={fit === "contain" ? "object-contain p-4" : "object-cover"}
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {!enabled && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xs">
                Hero Image Disabled (Default Fallback Active)
              </div>
            )}
          </div>
          {heroImage && (
            <p className="text-[11px] text-slate-400 font-mono">
              Cloudinary Public ID: {heroImage.publicId}
            </p>
          )}
        </div>

        {/* Right 6 cols: Settings & Upload */}
        <div className="lg:col-span-6 space-y-5">
          {/* File Upload Controls */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Upload / Replace Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={isUploading}
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Upload className="h-4 w-4" />}
              >
                {heroImage ? "Replace Image" : "Upload New Image"}
              </Button>

              {heroImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50"
                  onClick={handleRemove}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Recommended: 1200x900px or 4:3 / 16:9 ratio PNG, WebP, or JPG.
            </p>
          </div>

          {/* Alt Text */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Image Alt Text (for SEO &amp; Accessibility)</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. DigiVault Digital Tool Marketplace Suite"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Image Fit */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Object Fit</label>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="heroImageFit"
                  value="cover"
                  checked={fit === "cover"}
                  onChange={() => setFit("cover")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Cover (Fills Entire Container)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="heroImageFit"
                  value="contain"
                  checked={fit === "contain"}
                  onChange={() => setFit("contain")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Contain (Preserves Entire Ratio)</span>
              </label>
            </div>
          </div>

          {/* Enabled Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">
                Hero Image Active on Homepage
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <Button
          type="submit"
          isLoading={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-5 shadow-xs"
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Hero Settings
        </Button>
      </div>
    </form>
  );
};
