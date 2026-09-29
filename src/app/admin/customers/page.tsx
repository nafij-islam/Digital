"use client";

import React, { useState } from "react";
import { useAdminCustomers } from "@/hooks/useAdmin";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Input } from "@/components/ui/Input";
import { formatShortDate } from "@/lib/utils/formatters";
import { Users, Search, Mail, Phone, ShieldCheck } from "lucide-react";

export default function AdminCustomersPage() {
  const { data: customers = [], isLoading } = useAdminCustomers();
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Registered Customers
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View customer accounts, registration dates, and purchase history.
        </p>
      </div>

      <div className="max-w-md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email, or phone..."
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading customer accounts..." size="md" className="py-16" />
      ) : (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Phone / WhatsApp</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Joined Date</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">{customer.email}</td>
                    <td className="py-4 font-mono text-slate-700">
                      {customer.phone || "—"}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          customer.role === "superadmin" || customer.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {customer.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">
                      {formatShortDate(customer.createdAt)}
                    </td>
                    <td className="py-4 text-right">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                        Verified
                      </span>
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
