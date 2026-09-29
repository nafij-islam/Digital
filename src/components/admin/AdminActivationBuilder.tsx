"use client";

import React, { useState, useEffect } from "react";
import { ActivationBlock, ActivationBlockType, StyleVariant } from "@/types/activation";
import { activationService } from "@/services/activationService";
import { ActivationBlockRenderer } from "@/components/orders/ActivationBlockRenderer";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  BookOpen,
  Eye,
  Edit2,
  Check,
  Sparkles,
} from "lucide-react";

interface AdminActivationBuilderProps {
  orderId: string;
}

const BLOCK_TYPES: { type: ActivationBlockType; label: string }[] = [
  { type: "STEP", label: "Numbered Step" },
  { type: "HEADING", label: "Section Heading" },
  { type: "TEXT", label: "Paragraph Text" },
  { type: "INFO_NOTICE", label: "Info Notice (Blue)" },
  { type: "SUCCESS_NOTICE", label: "Success Notice (Green)" },
  { type: "WARNING_NOTICE", label: "Warning Notice (Amber)" },
  { type: "DANGER_NOTICE", label: "Danger Notice (Red)" },
  { type: "BULLET_LIST", label: "Bullet List" },
  { type: "NUMBERED_LIST", label: "Numbered List" },
  { type: "BUTTON", label: "Action Button" },
  { type: "LINK", label: "Simple Link" },
  { type: "DIVIDER", label: "Divider Line" },
  { type: "OPTIONAL_IMAGE", label: "Image Block" },
];

export const AdminActivationBuilder: React.FC<AdminActivationBuilderProps> = ({ orderId }) => {
  const toast = useToast();
  const [title, setTitle] = useState("Official Product Activation Guide");
  const [subtitle, setSubtitle] = useState("Please follow these steps carefully to complete your activation.");
  const [blocks, setBlocks] = useState<ActivationBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const process = await activationService.getAdminActivationProcess(orderId);
        if (process && isMounted) {
          if (process.title) setTitle(process.title);
          if (process.subtitle) setSubtitle(process.subtitle);
          if (process.blocks) {
            setBlocks(process.blocks.sort((a, b) => a.sortOrder - b.sortOrder));
          }
        } else if (isMounted) {
          // Provide default starter steps if empty
          setBlocks([
            {
              id: `blk-${Date.now()}-1`,
              type: "STEP",
              title: "Open the Official Website",
              content: "Navigate to the official portal provided in your credentials tab.",
              sortOrder: 0,
            },
            {
              id: `blk-${Date.now()}-2`,
              type: "STEP",
              title: "Log in with Assigned Email",
              content: "Enter your assigned email and reveal password from the Access Details tab.",
              sortOrder: 1,
            },
            {
              id: `blk-${Date.now()}-3`,
              type: "DANGER_NOTICE",
              title: "Do Not Change Account Details",
              content: "Do not change the password, recovery email, or remove any assigned workspaces.",
              styleVariant: "DANGER",
              sortOrder: 2,
            },
          ]);
        }
      } catch (e) {
        console.error("Failed to load activation process", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleAddBlock = (type: ActivationBlockType) => {
    const newBlock: ActivationBlock = {
      id: `blk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      title: type === "STEP" ? "New Step" : type.includes("NOTICE") ? "Important Notice" : "",
      content: "",
      items: type === "BULLET_LIST" || type === "NUMBERED_LIST" ? ["Item 1", "Item 2"] : undefined,
      buttonLabel: type === "BUTTON" ? "Open Activation Page" : undefined,
      buttonUrl: type === "BUTTON" || type === "LINK" ? "https://" : undefined,
      sortOrder: blocks.length,
      styleVariant: type.includes("DANGER")
        ? "DANGER"
        : type.includes("WARNING")
        ? "WARNING"
        : type.includes("SUCCESS")
        ? "SUCCESS"
        : type.includes("INFO")
        ? "INFO"
        : "DEFAULT",
    };
    setBlocks((prev) => [...prev, newBlock]);
    setEditingBlockId(newBlock.id);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) =>
      prev.filter((b) => b.id !== id).map((b, idx) => ({ ...b, sortOrder: idx }))
    );
    if (editingBlockId === id) setEditingBlockId(null);
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    setBlocks((prev) => {
      const copy = [...prev];
      const temp = copy[idx - 1];
      copy[idx - 1] = copy[idx];
      copy[idx] = temp;
      return copy.map((b, i) => ({ ...b, sortOrder: i }));
    });
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= blocks.length - 1) return;
    setBlocks((prev) => {
      const copy = [...prev];
      const temp = copy[idx + 1];
      copy[idx + 1] = copy[idx];
      copy[idx] = temp;
      return copy.map((b, i) => ({ ...b, sortOrder: i }));
    });
  };

  const handleBlockChange = (id: string, updates: Partial<ActivationBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await activationService.saveAdminActivationProcess(orderId, {
        title,
        subtitle,
        blocks,
      });
      toast.success("Activation process saved successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save activation process.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading activation process...</div>;
  }

  return (
    <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 text-purple-700 px-3 py-1 text-xs font-bold mb-2">
            <BookOpen className="h-3.5 w-3.5" /> Activation Process Builder
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Order Activation Workflow
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Build custom ordered activation instructions, warning notices, and links tailored to this order.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            leftIcon={<Eye className="h-3.5 w-3.5" />}
          >
            {previewMode ? "Edit Blocks" : "Live Preview"}
          </Button>

          <Button
            type="button"
            size="sm"
            isLoading={isSaving}
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
            leftIcon={<Save className="h-3.5 w-3.5" />}
          >
            Save Guide
          </Button>
        </div>
      </div>

      {/* Guide Meta Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Guide Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-purple-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Guide Subtitle / Note</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
          />
        </div>
      </div>

      {/* Preview Mode */}
      {previewMode ? (
        <div className="p-6 rounded-2xl border border-purple-200 bg-purple-50/20 space-y-4">
          <div className="border-b border-purple-100 pb-3">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
              Customer View Preview
            </span>
            <h4 className="text-base font-bold text-slate-900 mt-1">{title}</h4>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>

          <div className="space-y-3">
            {blocks.map((block, idx) => (
              <ActivationBlockRenderer
                key={block.id}
                block={block}
                stepNumber={
                  block.type === "STEP"
                    ? blocks.filter((b) => b.type === "STEP").findIndex((b) => b.id === block.id) + 1
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      ) : (
        /* Blocks List / Builder */
        <div className="space-y-4">
          {blocks.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
              No blocks added yet. Click &quot;Add Block&quot; below to start.
            </div>
          ) : (
            blocks.map((block, idx) => {
              const isEditing = editingBlockId === block.id;

              return (
                <div
                  key={block.id}
                  className={`rounded-2xl border transition-all p-4 ${
                    isEditing
                      ? "border-purple-400 bg-purple-50/20 shadow-xs"
                      : "border-slate-200/90 bg-white hover:border-slate-300"
                  }`}
                >
                  {/* Block Header Toolbar */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                        {block.type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === blocks.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBlockId(isEditing ? null : block.id)}
                        className="p-1 rounded text-slate-500 hover:text-slate-800"
                        title="Edit Block"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700"
                        title="Delete Block"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Content Editor */}
                  {isEditing ? (
                    <div className="space-y-3 pt-3">
                      {block.type !== "DIVIDER" && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Title</label>
                          <input
                            type="text"
                            value={block.title || ""}
                            onChange={(e) => handleBlockChange(block.id, { title: e.target.value })}
                            placeholder="Block Title..."
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-purple-500"
                          />
                        </div>
                      )}

                      {block.type !== "DIVIDER" && block.type !== "BUTTON" && block.type !== "LINK" && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Content / Instructions</label>
                          <textarea
                            rows={3}
                            value={block.content || ""}
                            onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                            placeholder="Detailed instruction text..."
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
                          />
                        </div>
                      )}

                      {(block.type === "BULLET_LIST" || block.type === "NUMBERED_LIST") && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            List Items (One per line)
                          </label>
                          <textarea
                            rows={3}
                            value={(block.items || []).join("\n")}
                            onChange={(e) =>
                              handleBlockChange(block.id, {
                                items: e.target.value.split("\n").filter((l) => l.trim().length > 0),
                              })
                            }
                            placeholder="First item&#10;Second item&#10;Third item"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-purple-500 font-mono"
                          />
                        </div>
                      )}

                      {(block.type === "BUTTON" || block.type === "LINK") && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">Button Label</label>
                            <input
                              type="text"
                              value={block.buttonLabel || ""}
                              onChange={(e) => handleBlockChange(block.id, { buttonLabel: e.target.value })}
                              placeholder="e.g. Open Portal"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">Destination URL</label>
                            <input
                              type="url"
                              value={block.buttonUrl || ""}
                              onChange={(e) => handleBlockChange(block.id, { buttonUrl: e.target.value })}
                              placeholder="https://..."
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
                            />
                          </div>
                        </div>
                      )}

                      {block.type === "OPTIONAL_IMAGE" && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Image Secure URL</label>
                          <input
                            type="url"
                            value={block.image?.secureUrl || ""}
                            onChange={(e) =>
                              handleBlockChange(block.id, {
                                image: { secureUrl: e.target.value, alt: block.title },
                              })
                            }
                            placeholder="https://res.cloudinary.com/..."
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
                          />
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingBlockId(null)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700"
                        >
                          <Check className="h-3.5 w-3.5" /> Done Editing
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Collapsed summary */
                    <div className="pt-2 text-xs text-slate-600">
                      <p className="font-semibold text-slate-900">{block.title || "Untitled Block"}</p>
                      {block.content && (
                        <p className="text-slate-500 truncate mt-0.5">{block.content}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Add Block Dropdown Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2">Add New Block:</span>
            {BLOCK_TYPES.map((bt) => (
              <button
                key={bt.type}
                type="button"
                onClick={() => handleAddBlock(bt.type)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>{bt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
