"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { supportService } from "@/services/supportService";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/utils/formatters";
import { LifeBuoy, Eye } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function AdminSupportPage() {
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: () => supportService.getTickets(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Support Tickets Console
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Respond to customer inquiries, resolve billing queries, and maintain ticket statuses.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading tickets..." size="md" className="py-16" />
      ) : (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Ticket ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Updated</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="py-4 font-bold text-slate-900">
                      #{t.ticketNumber}
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-slate-900">{t.customerName}</div>
                      <div className="text-[10px] text-slate-400">{t.customerEmail}</div>
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
                        <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                          <Eye className="h-3.5 w-3.5 mr-1" /> Open Thread
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
    </div>
  );
}
