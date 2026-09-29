"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportService } from "@/services/supportService";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { formatDate } from "@/lib/utils/formatters";
import { ArrowLeft, Send, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const queryClient = useQueryClient();

  const [replyText, setReplyText] = useState("");

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => supportService.getTicketById(id),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (msg: string) => supportService.sendMessage(id, msg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      setReplyText("");
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendMessageMutation.mutate(replyText);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading ticket conversation..." size="lg" className="py-24" />;
  }

  if (error || !ticket) {
    return (
      <ErrorState
        title="Ticket Not Found"
        message="Could not load the requested support conversation."
        onRetry={() => router.push("/account/support")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/account/support"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Ticket #{ticket.ticketNumber}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              {ticket.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Subject: <strong>{ticket.subject}</strong> ({ticket.category})
          </p>
        </div>

        {ticket.orderId && (
          <Link href={`/account/orders/${ticket.orderId}`}>
            <Button variant="outline" size="sm">
              View Order #{ticket.orderId}
            </Button>
          </Link>
        )}
      </div>

      {/* Messages Feed */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card space-y-6">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {ticket.messages.map((msg) => {
            const isSupport = msg.senderRole === "support" || msg.senderRole === "admin";

            return (
              <div
                key={msg.id}
                className={cn(
                  "p-4 rounded-2xl border space-y-2",
                  isSupport
                    ? "bg-blue-50/50 border-blue-200/80 ml-4 sm:ml-8"
                    : "bg-slate-50 border-slate-200 mr-4 sm:mr-8"
                )}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isSupport ? (
                      <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                        {msg.senderName.charAt(0)}
                      </div>
                    )}
                    <span className="font-bold text-slate-900">{msg.senderName}</span>
                    {isSupport && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                        Support Staff
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-8">
                  {msg.message}
                </p>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSend} className="pt-4 border-t border-slate-100 space-y-3">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your response to support..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="gradient"
              size="md"
              isLoading={sendMessageMutation.isPending}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
