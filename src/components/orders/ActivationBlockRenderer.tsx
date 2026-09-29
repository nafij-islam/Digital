"use client";

import React from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertOctagon,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { ActivationBlock } from "@/types/activation";

interface ActivationBlockRendererProps {
  block: ActivationBlock;
  stepNumber?: number;
}

export const ActivationBlockRenderer: React.FC<ActivationBlockRendererProps> = ({
  block,
  stepNumber,
}) => {
  switch (block.type) {
    case "HEADING":
      return (
        <div className="pt-2 pb-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {block.title || block.content}
          </h3>
          {block.title && block.content && (
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{block.content}</p>
          )}
        </div>
      );

    case "TEXT":
      return (
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {block.content || block.title}
        </p>
      );

    case "STEP":
      return (
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="h-8 w-8 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
            {stepNumber !== undefined ? stepNumber : block.sortOrder + 1}
          </div>
          <div className="min-w-0 flex-1">
            {block.title && (
              <h4 className="text-sm font-bold text-slate-900">{block.title}</h4>
            )}
            {block.content && (
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                {block.content}
              </p>
            )}
          </div>
        </div>
      );

    case "BULLET_LIST":
      return (
        <div className="space-y-1.5">
          {block.title && (
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              {block.title}
            </h4>
          )}
          <ul className="space-y-2">
            {(block.items || (block.content ? block.content.split("\n") : [])).map(
              (item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              )
            )}
          </ul>
        </div>
      );

    case "NUMBERED_LIST":
      return (
        <div className="space-y-2">
          {block.title && (
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              {block.title}
            </h4>
          )}
          <ol className="space-y-2">
            {(block.items || (block.content ? block.content.split("\n") : [])).map(
              (item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              )
            )}
          </ol>
        </div>
      );

    case "SUCCESS_NOTICE":
      return (
        <div className="rounded-2xl bg-emerald-50/90 border border-emerald-200 p-4 sm:p-5 flex items-start gap-3.5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            {block.title && (
              <h4 className="text-sm font-bold text-emerald-900">{block.title}</h4>
            )}
            <p className="text-xs sm:text-sm text-emerald-800 mt-0.5 leading-relaxed whitespace-pre-line">
              {block.content}
            </p>
          </div>
        </div>
      );

    case "INFO_NOTICE":
      return (
        <div className="rounded-2xl bg-blue-50/90 border border-blue-200 p-4 sm:p-5 flex items-start gap-3.5">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            {block.title && <h4 className="text-sm font-bold text-blue-900">{block.title}</h4>}
            <p className="text-xs sm:text-sm text-blue-800 mt-0.5 leading-relaxed whitespace-pre-line">
              {block.content}
            </p>
          </div>
        </div>
      );

    case "WARNING_NOTICE":
      return (
        <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-4 sm:p-5 flex items-start gap-3.5">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            {block.title && <h4 className="text-sm font-bold text-amber-900">{block.title}</h4>}
            <p className="text-xs sm:text-sm text-amber-800 mt-0.5 leading-relaxed whitespace-pre-line">
              {block.content}
            </p>
          </div>
        </div>
      );

    case "DANGER_NOTICE":
      return (
        <div className="rounded-2xl bg-rose-50/90 border border-rose-200 p-4 sm:p-5 flex items-start gap-3.5">
          <AlertOctagon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            {block.title && <h4 className="text-sm font-bold text-rose-900">{block.title}</h4>}
            <p className="text-xs sm:text-sm text-rose-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
              {block.content}
            </p>
          </div>
        </div>
      );

    case "BUTTON":
      if (!block.buttonUrl) return null;
      return (
        <div className="pt-1">
          <a
            href={block.buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow-sm"
          >
            <span>{block.buttonLabel || "Open Activation Link"}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      );

    case "LINK":
      if (!block.buttonUrl) return null;
      return (
        <div className="pt-0.5">
          <a
            href={block.buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
          >
            <span>{block.title || block.buttonLabel || block.buttonUrl}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      );

    case "DIVIDER":
      return <hr className="border-slate-200 my-4" />;

    case "OPTIONAL_IMAGE":
      if (!block.image?.secureUrl) return null;
      return (
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 relative aspect-[16/9] max-w-xl">
          <Image
            src={block.image.secureUrl}
            alt={block.image.alt || block.title || "Activation Step"}
            fill
            className="object-contain p-2"
          />
        </div>
      );

    default:
      return null;
  }
};
