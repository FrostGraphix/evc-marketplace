'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CATS, PRODUCTS } from '@/lib/products';
import { Category } from '@/types';
import { money } from '@/lib/utils';
import {
  Boxes,
  Plus,
  Edit3,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  Building2,
  Cpu,
  Armchair,
  Home,
  CheckCircle2,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  solar: Zap,
  'smart-living': Cpu,
  'smart-tech': Cpu,
  finishes: Building2,
  furniture: Armchair,
  living: Home,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(CATS);

  // Compute category statistics from PRODUCTS
  const categoryStats = categories.map((cat: Category) => {
    const prods = PRODUCTS.filter((p) => p.cat === cat.id);
    const totalInventoryValue = prods.reduce((sum, p) => sum + p.price * (p.stock || 10), 0);
    const inStockCount = prods.filter((p) => (p.stock || 10) > 0).length;
    return {
      ...cat,
      productCount: prods.length,
      inventoryValue: totalInventoryValue,
      inStockCount,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            Category Architecture
          </h1>
          <p className="text-xs text-[var(--mute)] mt-1">
            Manage product collections, regional positioning, and catalog taxonomies.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Equipment to Category</span>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryStats.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.id] || Boxes;
          return (
            <div
              key={cat.id}
              className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-black/40 border border-glow/25 text-[var(--mute)]">
                    /{cat.id}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[var(--mute)] mt-1 leading-relaxed">
                    {cat.blurb}
                  </p>
                </div>
              </div>

              {/* Metrics & Actions */}
              <div className="pt-4 border-t border-glow/15 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[var(--mute)] text-[11px] block">Equipment Count</span>
                    <strong className="text-white font-mono">{cat.productCount} models</strong>
                  </div>
                  <div>
                    <span className="text-[var(--mute)] text-[11px] block">Est. Stock Value</span>
                    <strong className="text-brand font-mono">{money(cat.inventoryValue)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    href={`/shop?cat=${cat.id}`}
                    target="_blank"
                    className="text-xs text-[var(--mute)] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View Shelf
                  </Link>
                  <Link
                    href={`/admin/products?cat=${cat.id}`}
                    className="btn-ghost text-xs py-1.5 px-3 border border-glow/25 text-white hover:text-brand"
                  >
                    Filter Inventory &rarr;
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}