"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportService } from "@/services/supportService";
import { CreateTicketPayload } from "@/types/support";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { formatShortDate } from "@/lib/utils/formatters";
import { useToast } from "@/hooks/useToast";
import { Plus, LifeBuoy, ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

function SupportContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";

  const queryClient = useQueryClient();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(!!initialOrderId);

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Product Issue");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [orderId, setOrderId] = useState(initialOrderId);
  const [message, setMessage] = useState("");

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: () => supportService.getTickets(),
  });

  const createTicketMutation = useMutation({
    mutationFn: (payload: CreateTicketPayload) => supportService.createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast.success("Support ticket created. Our team will reply shortly.");
      setIsModalOpen(false);
      setSubject("");
      setMessage("");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    createTicketMutation.mutate({
      subject,
      category,
      priority,
      orderId: orderId || undefined,
      initialMessage: message,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Support Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit inquiries, request replacements, or ask technical questions.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Support Ticket
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading tickets..." size="md" className="py-16" />
      ) : tickets.length === 0 ? (
        <EmptyState
          title="No support tickets"
          description="You haven't opened any support tickets yet."
          actionText="Create Ticket"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-[var(--bg-surface)] p-4 sm:p-6 shadow-soft overflow-hidden">
          {/* Mobile Stacked Tickets (< md) */}
          <div className="space-y-3 md:hidden">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900">#{t.ticketNumber}</span>
                    <span className="text-[10px] text-slate-400 block">{formatShortDate(t.updatedAt)}</span>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                      t.status === "RESOLVED" || t.status === "CLOSED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    )}
                  >
                    {t.status}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-xs text-slate-900">{t.subject}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span>{t.category}</span>
                    <span>•</span>
                    <span
                      className={cn(
                        "font-bold",
                        t.priority === "URGENT" || t.priority === "HIGH"
                          ? "text-rose-600"
                          : "text-slate-600"
                      )}
                    >
                      {t.priority}
                    </span>
                  </div>
                </div>

                <Link href={`/account/support/${t.id}`} className="block">
                  <Button variant="secondary" size="sm" className="w-full text-xs h-9 font-bold justify-center">
                    View Conversation
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Ticket ID</th>
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Last Updated</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="py-4 font-bold text-slate-900">
                      #{t.ticketNumber}
                    </td>
                    <td className="py-4 font-semibold text-slate-800 max-w-xs truncate">
                      {t.subject}
                    </td>
                    <td className="py-4 text-slate-600">{t.category}</td>
                    <td className="py-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                          t.priority === "URGENT" || t.priority === "HIGH"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        )}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                          t.status === "RESOLVED" || t.status === "CLOSED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        )}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">
                      {formatShortDate(t.updatedAt)}
                    </td>
                    <td className="py-4 text-right">
                      <Link href={`/account/support/${t.id}`}>
                        <Button variant="secondary" size="sm" className="text-xs h-7 px-2.5">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Open Support Ticket"
        description="Describe your issue or question and our team will get back to you promptly."
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Question regarding Canva Pro invite"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "Product Issue", label: "Product Issue" },
                { value: "Delivery", label: "Delivery / Access" },
                { value: "Billing", label: "Payment Verification" },
                { value: "Account", label: "Account Settings" },
                { value: "General", label: "General Question" },
              ]}
            />

            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              options={[
                { value: "LOW", label: "Low" },
                { value: "MEDIUM", label: "Medium" },
                { value: "HIGH", label: "High" },
                { value: "URGENT", label: "Urgent" },
              ]}
            />
          </div>

          <Input
            label="Related Order ID (Optional)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. DV-84920"
          />

          <Textarea
            label="Your Message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please detail your problem or inquiry..."
            rows={4}
          />

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createTicketMutation.isPending}
            >
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function AccountSupportPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading...</div>}>
      <SupportContent />
    </Suspense>
  );
}
