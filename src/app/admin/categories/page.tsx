"use client";

import React, { useState } from "react";
import { useCategories } from "@/hooks/useProducts";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { Plus, Layers, Edit2, Trash2 } from "lucide-react";
import { Category } from "@/types/product";

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    toast.success(editingCategory ? "Category updated!" : "Category created!");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Categories Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize digital products into browsable marketplace departments.
          </p>
        </div>
        <Button
          variant="gradient"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading categories..." size="md" className="py-16" />
      ) : (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Category Name</th>
                  <th className="pb-3">Slug</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Products</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                          <Layers className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-slate-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-purple-600">/{cat.slug}</td>
                    <td className="py-4 text-slate-500 max-w-sm truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-4 font-bold text-slate-900">
                      {cat.productCount ?? 0} items
                    </td>
                    <td className="py-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2.5"
                        onClick={() => handleOpenEdit(cat)}
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "New Category"}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Category Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. AI & Machine Learning"
          />
          <Input
            label="URL Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. ai-tools"
          />
          <Textarea
            label="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief explanation of tools in this category..."
          />
          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
