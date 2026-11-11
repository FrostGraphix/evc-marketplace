'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, MessageSquare, ArrowRight } from 'lucide-react';
import { CATS, PRODUCTS } from '@/lib/products';
import { money, waLink } from '@/lib/utils';
import { ProductImage } from './ProductImage';
import { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('locked');
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.classList.remove('locked');
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results: Product[] = query.trim()
    ? PRODUCTS.filter((p) => {
        const fullString = `${p.name} ${p.cat} ${p.desc}`.toLowerCase();
        return fullString.includes(query.trim().toLowerCase());
      }).slice(0, 6)
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalog"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog with clean outline */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--line)] rounded-3xl overflow-hidden z-10 shadow-2xl my-auto sm:my-0 animate-in zoom-in-95 duration-200"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-[var(--line)]">
          <Search className="w-5 h-5 text-brand flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search estates, locations (Ilorin, Ibadan, Lagos), or plot sizes..."
            className="flex-1 bg-transparent border-0 outline-none text-sm sm:text-base text-[var(--ink)] placeholder:text-[var(--mute)]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-semibold px-2 py-1 rounded-md text-[var(--mute)] hover:text-[var(--ink)]"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--surface2)]"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {query.trim() === '' ? (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--mute)] block mb-2.5">
                  Browse by Property Category
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATS.map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop?cat=${c.id}`}
                      onClick={onClose}
                      className="p-3 rounded-2xl border border-[var(--line)] hover:border-brand/40 bg-[var(--surface2)] hover:bg-brand/10 transition-all text-xs font-semibold text-[var(--ink)] hover:text-brand"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--mute)] block mb-2">
                Matching Results ({results.length})
              </span>
              <div className="divide-y divide-[var(--line)]">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3.5 py-3 group hover:bg-[var(--surface2)] px-2 rounded-xl transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--surface2)] border border-[var(--line)] flex-shrink-0 relative">
                      <ProductImage
                        src={product.images?.[0]}
                        alt={product.name}
                        fallbackArt={{ type: product.art, color: product.colors[0], view: 0 }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-sm text-[var(--ink)] group-hover:text-brand truncate">
                        {product.name}
                      </h4>
                      <span className="text-xs text-[var(--mute)] block">
                        {product.cat}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-display font-bold text-sm text-[var(--ink)] block">
                        {money(product.price)}
                      </span>
                      <span className="text-[11px] text-brand font-semibold group-hover:underline flex items-center justify-end gap-1">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <p className="text-sm text-[var(--ink)] font-semibold">
                No catalog items found matching &quot;{query}&quot;
              </p>
              <p className="text-xs text-[var(--mute)] max-w-sm mx-auto">
                Need a specific solar capacity, switch gang, or bespoke architectural panel? Chat directly with our engineering desk on WhatsApp.
              </p>
              <a
                href={waLink(`Hello EVC Nig. Ltd, I searched for "${query}" on your marketplace and could not find it. Can you source or quote this?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Inquire on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
