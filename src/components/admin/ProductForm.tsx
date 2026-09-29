"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductPlan, DeliveryType } from "@/types/product";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useCategories } from "@/hooks/useProducts";
import { useToast } from "@/hooks/useToast";
import { Plus, Trash2, CheckCircle2, ArrowLeft, Layers, Sparkles } from "lucide-react";

interface ProductFormProps {
  initialProduct?: Product;
  onSave: (productData: Partial<Product>) => Promise<void>;
  isEditing?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSave,
  isEditing = false,
}) => {
  const router = useRouter();
  const toast = useToast();
  const { data: categories = [] } = useCategories();

  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || categories[0]?.id || "cat-1");
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.imageUrl ||
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
  );
  const [badge, setBadge] = useState(initialProduct?.badge || "");
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);
  const [isPopular, setIsPopular] = useState(initialProduct?.isPopular ?? false);
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    initialProduct?.deliveryType || "ACTIVATION_LINK"
  );
  const [deliveryInfo, setDeliveryInfo] = useState(
    initialProduct?.deliveryInfo || "Delivered within 5-15 minutes after payment verification."
  );
  const [importantNotes, setImportantNotes] = useState(initialProduct?.importantNotes || "");
  const [featuresText, setFeaturesText] = useState(
    initialProduct?.features?.join("\n") || "100% Genuine Official License\nInstant Delivery\nWarranty Included"
  );

  // Dynamic Plans State
  const [plans, setPlans] = useState<ProductPlan[]>(
    initialProduct?.plans || [
      {
        id: "plan-1",
        productId: "",
        name: "1 Month Pass",
        durationValue: 1,
        durationUnit: "months",
        regularPrice: 500,
        salePrice: 350,
        stock: -1,
        active: true,
        sortOrder: 1,
      },
      {
        id: "plan-2",
        productId: "",
        name: "12 Months (1 Year)",
        durationValue: 12,
        durationUnit: "months",
        regularPrice: 3000,
        salePrice: 1890,
        stock: -1,
        active: true,
        isPopular: true,
        sortOrder: 2,
      },
    ]
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleAddPlan = () => {
    const newPlan: ProductPlan = {
      id: `plan-${Date.now()}`,
      productId: initialProduct?.id || "",
      name: "New Duration Plan",
      durationValue: 1,
      durationUnit: "months",
      regularPrice: 600,
      salePrice: 450,
      stock: -1,
      active: true,
      sortOrder: plans.length + 1,
    };
    setPlans([...plans, newPlan]);
  };

  const handleUpdatePlan = (index: number, updates: Partial<ProductPlan>) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], ...updates };
    setPlans(updated);
  };

  const handleRemovePlan = (index: number) => {
    if (plans.length <= 1) {
      toast.warning("A product must contain at least one subscription plan.");
      return;
    }
    setPlans(plans.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a product name.");
      return;
    }

    setIsLoading(true);
    try {
      const features = featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const generatedSlug =
        slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const startingPrice = Math.min(...plans.map((p) => p.salePrice));

      await onSave({
        name,
        slug: generatedSlug,
        shortDescription,
        description,
        categoryId,
        imageUrl,
        badge: badge || undefined,
        isFeatured,
        isPopular,
        isActive,
        deliveryType,
        deliveryInfo,
        importantNotes: importantNotes || undefined,
        features,
        plans,
        startingPrice,
      });

      toast.success(
        isEditing ? "Product updated successfully!" : "Product created successfully!"
      );
      router.push("/admin/products");
    } catch {
      toast.error("Failed to save product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/products")}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Products
          </Button>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {isEditing ? `Edit Product: ${initialProduct?.name}` : "Create New Product"}
          </h1>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="md"
          isLoading={isLoading}
          leftIcon={<CheckCircle2 className="h-4 w-4" />}
        >
          {isEditing ? "Save Changes" : "Publish Product"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
              Basic Product Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Product Title / Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Canva Pro Subscription"
              />
              <Input
                label="URL Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. canva-pro (auto-generated if blank)"
              />
            </div>

            <Input
              label="Short Catchy Description"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="1-2 sentences highlighting the core value..."
            />

            <Textarea
              label="Full Product Description"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed specifications, features, and usage details..."
            />
          </div>

          {/* Multi-Plan Management */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Subscription Plans &amp; Pricing Tiers ({plans.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Define durations and prices (e.g. 1 Month, 3 Months, 6 Months, 12 Months, Lifetime).
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPlan}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Plan
              </Button>
            </div>

            <div className="space-y-4">
              {plans.map((plan, index) => (
                <div
                  key={plan.id || index}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase">
                      Plan #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePlan(index)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Plan Display Name"
                      required
                      value={plan.name}
                      onChange={(e) => handleUpdatePlan(index, { name: e.target.value })}
                      placeholder="e.g. 1 Month Solo"
                    />

                    <Input
                      label="Duration Value"
                      type="number"
                      required
                      value={plan.durationValue}
                      onChange={(e) =>
                        handleUpdatePlan(index, { durationValue: Number(e.target.value) })
                      }
                    />

                    <Select
                      label="Duration Unit"
                      value={plan.durationUnit}
                      onChange={(e) =>
                        handleUpdatePlan(index, { durationUnit: e.target.value as any })
                      }
                      options={[
                        { value: "days", label: "Days" },
                        { value: "months", label: "Months" },
                        { value: "years", label: "Years" },
                        { value: "lifetime", label: "Lifetime" },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Regular Price (৳)"
                      type="number"
                      required
                      value={plan.regularPrice}
                      onChange={(e) =>
                        handleUpdatePlan(index, { regularPrice: Number(e.target.value) })
                      }
                    />

                    <Input
                      label="Sale Price (৳)"
                      type="number"
                      required
                      value={plan.salePrice}
                      onChange={(e) =>
                        handleUpdatePlan(index, { salePrice: Number(e.target.value) })
                      }
                    />

                    <div className="flex items-center gap-4 pt-6">
                      <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={plan.isPopular}
                          onChange={(e) =>
                            handleUpdatePlan(index, { isPopular: e.target.checked })
                          }
                          className="rounded border-slate-300 text-primary-600"
                        />
                        <span>Popular Tag</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features & Delivery */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
              Key Features &amp; Delivery Notes
            </h3>

            <Textarea
              label="Key Feature Bullet Points (One per line)"
              rows={4}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            />

            <Input
              label="Delivery Instructions / Guarantee Text"
              value={deliveryInfo}
              onChange={(e) => setDeliveryInfo(e.target.value)}
              placeholder="e.g. Private invitation sent directly to customer email"
            />

            <Textarea
              label="Important Customer Notes (Optional)"
              rows={2}
              value={importantNotes}
              onChange={(e) => setImportantNotes(e.target.value)}
              placeholder="e.g. Works on both existing and new emails"
            />
          </div>
        </div>

        {/* Sidebar Settings (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
              Settings &amp; Visibility
            </h3>

            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Select
              label="Delivery Type"
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
              options={[
                { value: "ACTIVATION_LINK", label: "Activation / Invite Link" },
                { value: "LICENSE_KEY", label: "License / Product Key" },
                { value: "ACCOUNT_CREDENTIAL", label: "Account Credentials (Email/Pass)" },
                { value: "DOWNLOAD_LINK", label: "Download Link" },
                { value: "TEXT_INSTRUCTION", label: "Text Instruction" },
                { value: "OTHER", label: "Other" },
              ]}
            />

            <Input
              label="Product Image URL"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />

            <Input
              label="Custom Badge Text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Best Seller, Hot, Top Pick"
            />

            <div className="pt-2 space-y-2.5 border-t border-slate-100 text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600"
                />
                <span>Show in Featured Section</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600"
                />
                <span>Show in Popular Section</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600"
                />
                <span>Active for Purchase</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
