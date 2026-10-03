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
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-[#716DFF]" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ChatGPT Plus, Gemini Advanced, Canva Pro, JetBrains, Windows..."
          className="w-full rounded-2xl border border-[#383866]/50 bg-[#26264A] pl-12 pr-10 py-3 text-sm text-[#F5F5FA] placeholder:text-[#777790] shadow-pressed focus:bg-[#232342] focus:border-[#716DFF] focus:outline-none focus:ring-2 focus:ring-[#716DFF]/20 transition-all font-mono"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-3.5 text-[#AAAAC1] hover:text-[#F5F5FA] p-0.5"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {/* Quick suggestions if query is empty */}
      {!query && (
        <div className="space-y-4 py-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#777790] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#716DFF]" /> POPULAR PRODUCTS
          </div>
          <div className="flex flex-wrap gap-2">
            {["ChatGPT Plus", "Gemini Advanced", "Canva Pro", "Claude Pro", "Windows 11 Pro", "JetBrains"].map(
              (term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-[#383866]/40 bg-[#26264A] px-3.5 py-1.5 text-xs font-mono font-medium text-[#AAAAC1] hover:text-[#F5F5FA] hover:bg-[#353560] shadow-pressed-sm transition-colors cursor-pointer"
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
        <div className="max-h-80 overflow-y-auto space-y-2 divide-y divide-[#383866]/30">
          {products.length === 0 ? (
            <div className="py-8 text-center text-[#AAAAC1] text-xs font-mono">
              No products found matching &ldquo;<span className="font-bold text-[#F5F5FA]">{query}</span>&rdquo;
            </div>
          ) : (
            products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelect(product.slug)}
                className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#26264A] cursor-pointer transition-colors group"
              >
                <div className="h-12 w-12 rounded-xl bg-[#26264A] overflow-hidden relative shrink-0 border border-[#383866]/40 p-1">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#F5F5FA] truncate group-hover:text-[#716DFF] transition-colors font-heading uppercase">
                      {product.name}
                    </h4>
                    {product.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#26264A] text-[#716DFF] border border-[#716DFF]/30">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#AAAAC1] truncate font-body">{product.shortDescription}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black font-mono text-[#F5F5FA]">
                    {formatPrice(product.startingPrice)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="pt-3 border-t border-[#383866]/30 flex justify-end">
        <button
          onClick={onClose}
          className="text-xs font-mono text-[#AAAAC1] hover:text-[#F5F5FA]"
        >
          [ESC to close]
        </button>
      </div>
    </Modal>
  );
};
