"use client";

import React from "react";
import { Star, CheckCircle, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export default function AdminReviewsPage() {
  const toast = useToast();

  const mockReviews = [
    {
      id: "rev-1",
      customer: "Shahriar Hossain",
      product: "Canva Pro Subscription",
      rating: 5,
      comment: "Purchased Canva Pro 12-month pass with bKash. Payment was verified in less than 5 minutes!",
      date: "2025-02-25",
      status: "APPROVED",
    },
    {
      id: "rev-2",
      customer: "Tanvir Chowdhury",
      product: "ChatGPT Plus & GPT-4o Access",
      rating: 5,
      comment: "Getting ChatGPT Plus in Bangladesh without a dual currency card was painless with bKash.",
      date: "2025-02-24",
      status: "APPROVED",
    },
    {
      id: "rev-3",
      customer: "Mahmudul Alam",
      product: "Windows 11 Pro Genuine Retail Key",
      rating: 5,
      comment: "Activated Windows 11 Pro online instantly with the genuine retail key.",
      date: "2025-02-20",
      status: "APPROVED",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Customer Reviews &amp; Ratings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Moderate verified customer feedback, testimonials, and star ratings.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Product</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3">Review Content</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {mockReviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50/50">
                  <td className="py-4 font-bold text-slate-900">{rev.customer}</td>
                  <td className="py-4 text-primary-600 font-semibold">{rev.product}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-bold text-slate-900">{rev.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-600 max-w-sm truncate">{rev.comment}</td>
                  <td className="py-4 text-slate-500">{rev.date}</td>
                  <td className="py-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                      Approved
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-rose-600 hover:bg-rose-50"
                      onClick={() => toast.success("Review deleted.")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
