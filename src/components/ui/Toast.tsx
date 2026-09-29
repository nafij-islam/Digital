"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200 bg-white/95 text-slate-800",
    error: "border-rose-200 bg-white/95 text-slate-800",
    warning: "border-amber-200 bg-white/95 text-slate-800",
    info: "border-blue-200 bg-white/95 text-slate-800",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md",
              borders[toast.type]
            )}
          >
            {icons[toast.type]}
            <div className="flex-1 text-xs sm:text-sm">
              {toast.title && (
                <p className="font-bold text-slate-900 leading-none mb-1">
                  {toast.title}
                </p>
              )}
              <p className="text-slate-600 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 rounded-md p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
