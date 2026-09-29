"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Tag, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/utils/formatters";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { data } = useProducts({ search: query });
  const products = data?.products || [];

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const handleSelect = (slug: string) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <form onSubmit={handleSearchSubmit} className="relative mb-4">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AI tools, Canva Pro, JetBrains, Windows keys..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-10 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {/* Quick suggestions if query is empty */}
      {!query && (
        <div className="space-y-4 py-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Popular Searches
          </div>
          <div className="flex flex-wrap gap-2">
            {["Canva Pro", "ChatGPT Plus", "Windows 11 Pro", "Claude Pro", "JetBrains", "Spotify"].map(
              (term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Results list */}
      {query && (
        <div className="max-h-80 overflow-y-auto space-y-2 divide-y divide-slate-100">
          {products.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No products found matching &ldquo;<span className="font-semibold">{query}</span>&rdquo;
            </div>
          ) : (
            products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelect(product.slug)}
                className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h4>
                    {product.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{product.shortDescription}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-slate-900">
                    {formatPrice(product.startingPrice)}
                  </span>
                  <div className="text-[10px] text-slate-400">starting</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {query && products.length > 5 && (
        <div className="pt-3 border-t border-slate-100 text-center">
          <button
            onClick={handleSearchSubmit}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
          >
            View all {products.length} results <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </Modal>
  );
};
