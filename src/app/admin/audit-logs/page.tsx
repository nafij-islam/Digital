"use client";

import React, { useState } from "react";
import { useAdminAuditLogs } from "@/hooks/useAdmin";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Input } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils/formatters";
import { History, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function AdminAuditLogsPage() {
  const { data: logs = [], isLoading } = useAdminAuditLogs();
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.adminName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          System Audit &amp; Activity Logs
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable audit trail tracking order fulfillments, payment verifications, and system modifications.
        </p>
      </div>

      <div className="max-w-md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by action, admin, or target ID..."
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading audit logs..." size="md" className="py-16" />
      ) : (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Admin</th>
                  <th className="pb-3">Action Type</th>
                  <th className="pb-3">Target</th>
                  <th className="pb-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-4 font-bold text-slate-900">
                      {log.adminName}
                    </td>
                    <td className="py-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                          log.action.includes("FULFILLED") || log.action.includes("APPROVED")
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : log.action.includes("REJECTED") || log.action.includes("DELETED")
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        )}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 font-mono font-semibold text-slate-700">
                      {log.targetType}: {log.targetId}
                    </td>
                    <td className="py-4 text-slate-600 max-w-md">{log.details}</td>
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
